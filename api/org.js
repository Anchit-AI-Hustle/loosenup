// LoosenUp for organisations: create an organisation, join with a code, share an anonymous
// weekly pulse, and read the organisation dashboard.
//
// Privacy rules enforced here, not just in the app:
// - A pulse holds only weekly averages and up to three feeling labels from a fixed list. No names,
//   no text, no device ids. The member id is a random string the app makes, stored only as a hash.
// - The dashboard shows a week only when at least MIN_GROUP people, on MIN_GROUP different networks,
//   shared that week, so an admin cannot unlock a small group by posting made-up pulses.
// - Nothing about SOS or crisis support is ever sent.
import { sql, ensureSchema, sha256, token, joinCode } from './_db.js';

export const MIN_GROUP = 5;
const KINDS = ['college', 'school', 'company', 'ngo', 'other'];
const CONTEXTS = ['Busy mind', 'Tight shoulders', 'Big moment ahead', 'Hard to focus', 'Just a quick lift', 'Work pile-up',
  'Before a meeting', 'After a tough call', 'Hard to switch off', 'Tense with someone', 'After a disagreement',
  'Before a hard talk', 'Feeling disconnected', 'Feeling low', 'Low energy', 'Hard on myself', 'Winding down', 'Mind racing at night'];

const clean = (s, max) => String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);
const num = (v, lo, hi) => { const n = Number(v); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : null; };
const problem = (status, message) => Object.assign(new Error(message), { status });

async function create(body, ip) {
  const name = clean(body.name, 80);
  if (name.length < 2) throw problem(400, 'Add the organisation name.');
  const kind = KINDS.includes(body.kind) ? body.kind : 'other';
  const supportName = clean(body.supportName, 80) || null;
  const supportPhone = clean(body.supportPhone, 20).replace(/[^\d+ ]/g, '') || null;
  const ipHash = sha256('lu-ip:' + ip);
  const recent = await sql(`SELECT count(*)::int AS n FROM lu_orgs WHERE ip_hash = $1 AND created_at > now() - interval '1 hour'`, [ipHash]);
  if ((recent[0] && recent[0].n) >= 5) throw problem(429, 'Please wait a little before creating another organisation.');
  const adminKey = token();
  for (let i = 0; i < 5; i++) {
    const code = joinCode();
    const rows = await sql(`INSERT INTO lu_orgs (name, kind, join_code, admin_hash, support_name, support_phone, ip_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (join_code) DO NOTHING RETURNING join_code`,
    [name, kind, code, sha256(adminKey), supportName, supportPhone, ipHash]);
    if (rows.length) return { name, kind, joinCode: code, adminKey, supportName, supportPhone };
  }
  throw problem(500, 'Could not create a join code. Please try again.');
}

async function orgByCode(code) {
  const c = clean(code, 12).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const rows = await sql('SELECT id, name, kind, join_code, support_name, support_phone FROM lu_orgs WHERE join_code = $1', [c]);
  if (!rows.length) throw problem(404, 'That code was not found. Check it with your organisation.');
  return rows[0];
}

async function join(body) {
  const o = await orgByCode(body.code);
  return { name: o.name, kind: o.kind, joinCode: o.join_code, supportName: o.support_name, supportPhone: o.support_phone };
}

async function pulse(body, ip) {
  const o = await orgByCode(body.code);
  const member = clean(body.member, 64);
  if (member.length < 16) throw problem(400, 'Missing member id.');
  const week = clean(body.week, 8);
  if (!/^\d{4}-W\d{2}$/.test(week)) throw problem(400, 'Week must look like 2026-W42.');
  const mood = body.mood == null ? null : num(body.mood, 1, 5);
  const calmGain = body.calmGain == null ? null : num(body.calmGain, -9, 9);
  const breaks = Math.round(num(body.breaks, 0, 500) || 0);
  const contexts = (Array.isArray(body.contexts) ? body.contexts : []).filter((c) => CONTEXTS.includes(c)).slice(0, 3);
  await sql(`INSERT INTO lu_pulses (org_id, week, member_hash, mood, calm_gain, breaks, contexts, ip_hash)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (org_id, week, member_hash) DO UPDATE SET mood = EXCLUDED.mood, calm_gain = EXCLUDED.calm_gain,
      breaks = EXCLUDED.breaks, contexts = EXCLUDED.contexts, ip_hash = EXCLUDED.ip_hash, created_at = now()`,
  [o.id, week, sha256(o.id + ':' + member), mood, calmGain, breaks, contexts, sha256('lu-ip:' + o.id + ':' + ip)]);
  return { ok: true };
}

async function orgByAdmin(key) {
  const k = clean(key, 64);
  if (k.length < 20) throw problem(401, 'Add your admin key.');
  const rows = await sql('SELECT id, name, kind, join_code, support_name, support_phone, created_at FROM lu_orgs WHERE admin_hash = $1', [sha256(k)]);
  if (!rows.length) throw problem(401, 'That admin key was not recognised.');
  return rows[0];
}

async function dashboard(key) {
  const o = await orgByAdmin(key);
  const weeks = await sql(`SELECT week, count(*)::int AS members, count(DISTINCT ip_hash)::int AS networks, round(avg(mood)::numeric, 2)::float AS mood,
      round(avg(calm_gain)::numeric, 2)::float AS calm_gain, sum(breaks)::int AS breaks
    FROM lu_pulses WHERE org_id = $1 GROUP BY week ORDER BY week DESC LIMIT 12`, [o.id]);
  const ctx = await sql(`SELECT week, c AS context, count(*)::int AS n FROM lu_pulses, unnest(contexts) AS c
    WHERE org_id = $1 GROUP BY week, c`, [o.id]);
  const shown = weeks.map((w) => {
    const enough = w.members >= MIN_GROUP && (w.networks == null || w.networks >= MIN_GROUP);
    const top = ctx.filter((c) => c.week === w.week).sort((a, b) => b.n - a.n).slice(0, 3).map((c) => c.context);
    return enough
      ? { week: w.week, members: w.members, mood: w.mood, calmGain: w.calm_gain, breaks: w.breaks, topFeelings: top }
      : { week: w.week, members: null, hidden: true };
  });
  return {
    name: o.name, kind: o.kind, joinCode: o.join_code, supportName: o.support_name, supportPhone: o.support_phone,
    minGroup: MIN_GROUP, weeks: shown,
  };
}

async function remove(key) {
  const o = await orgByAdmin(key);
  await sql('DELETE FROM lu_orgs WHERE id = $1', [o.id]);
  return { ok: true };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    await ensureSchema();
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const action = (req.query && req.query.action) || body.action;
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const adminKey = req.headers['x-admin-key'] || body.adminKey;
    let out;
    if (req.method === 'GET' && action === 'dashboard') out = await dashboard(adminKey);
    else if (req.method === 'POST' && action === 'create') out = await create(body, ip);
    else if (req.method === 'POST' && action === 'join') out = await join(body);
    else if (req.method === 'POST' && action === 'pulse') out = await pulse(body, ip);
    else if (req.method === 'POST' && action === 'delete') out = await remove(adminKey);
    else throw problem(400, 'Unknown action.');
    return res.status(200).json(out);
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.status ? e.message : 'Something went sideways. Please try again.' });
  }
}
