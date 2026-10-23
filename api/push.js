// Daily reminders for the web app (website and mobile website), sent as Web Push notifications.
// The phone apps schedule their own local notification and do not use this.
//
//   GET  /api/push?action=key                 -> { publicKey } for PushManager.subscribe
//   POST /api/push { action: 'subscribe', subscription, time: 'HH:MM', tz: minutes east of UTC, lang }
//   POST /api/push { action: 'unsubscribe', endpoint }
//   POST /api/push { action: 'send' } with Authorization: Bearer CRON_SECRET  (called every 15 minutes)
//
// Only the push endpoint, its keys, the chosen time, time zone and language are stored. Nothing about
// moods, breaks or the person.
import webpush from 'web-push';
import { sql, sha256 } from './_db.js';

const TEXT = {
  en: { title: 'LoosenUp', body: 'Two calm minutes are here for you whenever you like.' },
  hi: { title: 'LoosenUp', body: 'दो शांत मिनट हमेशा आपके लिए हैं, जब भी आप चाहें।' },
};
const WINDOW_MIN = 20; // a reminder goes out within 20 minutes after the chosen time

let ready = null;
function schema() {
  ready = ready || sql(`CREATE TABLE IF NOT EXISTS lu_push (
      id text PRIMARY KEY,
      endpoint text NOT NULL,
      p256dh text NOT NULL,
      auth text NOT NULL,
      at_minute integer NOT NULL,
      tz_minutes integer NOT NULL DEFAULT 330,
      lang text NOT NULL DEFAULT 'en',
      last_sent date,
      created_at timestamptz NOT NULL DEFAULT now())`).catch((e) => { ready = null; throw e; });
  return ready;
}
const problem = (status, message) => Object.assign(new Error(message), { status });

function vapid() {
  const pub = process.env.VAPID_PUBLIC_KEY, priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) throw problem(503, 'Reminders are not set up on the server yet.');
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'https://loosenup.anchit-tandon.com', pub, priv);
  return pub;
}

function parseTime(t) {
  const m = /^(\d{2}):(\d{2})$/.exec(String(t || ''));
  if (!m || +m[1] > 23 || +m[2] > 59) throw problem(400, 'Pick a time first.');
  return +m[1] * 60 + +m[2];
}

async function subscribe(body) {
  const sub = body.subscription || {};
  const endpoint = String(sub.endpoint || '');
  if (!/^https:\/\//.test(endpoint) || endpoint.length > 1000) throw problem(400, 'This browser did not give a reminder address.');
  const keys = sub.keys || {};
  if (!keys.p256dh || !keys.auth) throw problem(400, 'This browser did not give reminder keys.');
  const tz = Math.max(-720, Math.min(840, Math.round(Number(body.tz) || 330)));
  const lang = body.lang === 'hi' ? 'hi' : 'en';
  await sql(`INSERT INTO lu_push (id, endpoint, p256dh, auth, at_minute, tz_minutes, lang)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (id) DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, at_minute = EXCLUDED.at_minute,
      tz_minutes = EXCLUDED.tz_minutes, lang = EXCLUDED.lang`,
  [sha256(endpoint), endpoint, String(keys.p256dh).slice(0, 200), String(keys.auth).slice(0, 100), parseTime(body.time), tz, lang]);
  return { ok: true };
}

async function unsubscribe(body) {
  await sql('DELETE FROM lu_push WHERE id = $1', [sha256(String(body.endpoint || ''))]);
  return { ok: true };
}

// Everyone whose local time has just passed their chosen minute, and who has not had today's reminder.
export function due(rows, nowMs) {
  return rows.filter((r) => {
    const local = new Date(nowMs + r.tz_minutes * 60000);
    const minute = local.getUTCHours() * 60 + local.getUTCMinutes();
    const day = local.toISOString().slice(0, 10);
    const since = (minute - r.at_minute + 1440) % 1440;
    const last = r.last_sent ? String(r.last_sent).slice(0, 10) : null;
    return since < WINDOW_MIN && last !== day;
  });
}

async function send(req) {
  const auth = String(req.headers.authorization || '');
  if (!process.env.CRON_SECRET || auth !== 'Bearer ' + process.env.CRON_SECRET) throw problem(401, 'Not allowed.');
  vapid();
  const rows = await sql('SELECT id, endpoint, p256dh, auth, at_minute, tz_minutes, lang, last_sent FROM lu_push');
  const now = Date.now();
  let sent = 0, removed = 0;
  for (const r of due(rows, now)) {
    const day = new Date(now + r.tz_minutes * 60000).toISOString().slice(0, 10);
    try {
      await webpush.sendNotification({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } },
        JSON.stringify({ ...TEXT[r.lang] || TEXT.en, url: '/' }), { TTL: 3600 });
      await sql('UPDATE lu_push SET last_sent = $2 WHERE id = $1', [r.id, day]);
      sent++;
    } catch (e) {
      if (e && (e.statusCode === 404 || e.statusCode === 410)) { await sql('DELETE FROM lu_push WHERE id = $1', [r.id]); removed++; }
    }
  }
  return { ok: true, checked: rows.length, sent, removed };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    await schema();
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const action = (req.query && req.query.action) || body.action;
    let out;
    if (req.method === 'GET' && action === 'key') out = { publicKey: vapid() };
    else if (req.method === 'POST' && action === 'subscribe') out = await subscribe(body);
    else if (req.method === 'POST' && action === 'unsubscribe') out = await unsubscribe(body);
    else if (req.method === 'POST' && action === 'send') out = await send(req);
    else throw problem(400, 'Unknown action.');
    return res.status(200).json(out);
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.status ? e.message : 'Something went sideways. Please try again.' });
  }
}
