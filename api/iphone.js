// Native iPhone install on request. A free Apple ID build can only be installed from a Mac, so /get
// queues a request here and a small job on Anchit's Mac (scripts/iphone-agent.sh) picks it up, installs
// the latest signed build on the registered iPhone over Wi-Fi, and reports back.
//
// Every call needs IPHONE_INSTALL_KEY, a private key that lives only in Vercel, on the Mac and in the
// phone's browser storage (it arrives in the address fragment, which never reaches a server log).
import { sql, sha256 } from './_db.js';
import { timingSafeEqual } from 'node:crypto';

const QUEUE_MINUTES = 30;   // a request nobody picked up in this time is dropped
const ONLINE_SECONDS = 150; // the Mac checks every minute; this much silence means it is away

const problem = (status, message) => Object.assign(new Error(message), { status });
const clean = (s, max) => String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);

export function keyOk(given, expected) {
  if (!expected || !given) return false;
  const a = Buffer.from(sha256(String(given))), b = Buffer.from(sha256(String(expected)));
  return a.length === b.length && timingSafeEqual(a, b);
}

// Postgres storage. Tests pass an in-memory store with the same methods.
let ready = null;
export const pgStore = {
  async init() {
    ready = ready || sql(`CREATE TABLE IF NOT EXISTS lu_iphone (
        id bigserial PRIMARY KEY,
        status text NOT NULL DEFAULT 'queued',
        message text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now())`)
      .then(() => sql(`CREATE TABLE IF NOT EXISTS lu_iphone_agent (id int PRIMARY KEY, seen_at timestamptz NOT NULL)`))
      .catch((e) => { ready = null; throw e; });
    return ready;
  },
  async open() {
    const rows = await sql(`SELECT id, status, message FROM lu_iphone WHERE status IN ('queued', 'installing')
      AND created_at > now() - interval '${QUEUE_MINUTES} minutes' ORDER BY id DESC LIMIT 1`);
    return rows[0] || null;
  },
  async add() { return (await sql(`INSERT INTO lu_iphone DEFAULT VALUES RETURNING id, status, message`))[0]; },
  async get(id) { return (await sql('SELECT id, status, message FROM lu_iphone WHERE id = $1', [id]))[0] || null; },
  async seen() { await sql(`INSERT INTO lu_iphone_agent (id, seen_at) VALUES (1, now()) ON CONFLICT (id) DO UPDATE SET seen_at = now()`); },
  async lastSeen() { const r = await sql(`SELECT extract(epoch FROM now() - seen_at)::int AS ago FROM lu_iphone_agent WHERE id = 1`); return r[0] ? r[0].ago : null; },
  async take() {
    await sql(`UPDATE lu_iphone SET status = 'dropped', updated_at = now() WHERE status = 'queued' AND created_at <= now() - interval '${QUEUE_MINUTES} minutes'`);
    const r = await sql(`UPDATE lu_iphone SET status = 'installing', updated_at = now() WHERE id = (
      SELECT id FROM lu_iphone WHERE status = 'queued' ORDER BY id LIMIT 1) RETURNING id, status, message`);
    return r[0] || null;
  },
  async finish(id, status, message) {
    return (await sql(`UPDATE lu_iphone SET status = $2, message = $3, updated_at = now() WHERE id = $1 RETURNING id, status, message`, [id, status, message]))[0] || null;
  }
};

export async function act(store, action, body) {
  await store.init();
  if (action === 'request') {
    const open = await store.open();
    const row = open || await store.add();
    const ago = await store.lastSeen();
    return { id: Number(row.id), status: row.status, macOnline: ago != null && ago <= ONLINE_SECONDS };
  }
  if (action === 'status') {
    const row = await store.get(Number(body.id));
    if (!row) throw problem(404, 'That request was not found.');
    const ago = await store.lastSeen();
    return { id: Number(row.id), status: row.status, message: row.message || null, macOnline: ago != null && ago <= ONLINE_SECONDS };
  }
  if (action === 'next') {
    await store.seen();
    const row = await store.take();
    return row ? { id: Number(row.id) } : { none: true };
  }
  if (action === 'finish') {
    const status = body.ok ? 'installed' : 'stopped';
    const row = await store.finish(Number(body.id), status, clean(body.message, 300) || null);
    if (!row) throw problem(404, 'That request was not found.');
    return { id: Number(row.id), status: row.status };
  }
  throw problem(400, 'Unknown action.');
}

export function makeHandler(store) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (req.method !== 'POST') throw problem(405, 'Use POST.');
      const expected = process.env.IPHONE_INSTALL_KEY;
      if (!expected) throw problem(503, 'Native iPhone installs are not set up.');
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      if (!keyOk(body.key, expected)) throw problem(403, 'This link is not allowed to install the native app.');
      return res.status(200).json(await act(store, clean(body.action, 20), body));
    } catch (e) {
      return res.status(e.status || 500).json({ error: e.status ? e.message : 'Something went sideways. Please try again.' });
    }
  };
}

export default makeHandler(pgStore);
