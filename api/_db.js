// Tiny Neon client over its HTTPS SQL endpoint (the same protocol @neondatabase/serverless uses),
// so the functions need no npm packages. DATABASE_URL is set by the Vercel Neon integration.
import { createHash, randomBytes } from 'node:crypto';

export async function sql(query, params = []) {
  const url = process.env.DATABASE_URL;
  if (!url) throw Object.assign(new Error('Database is not configured'), { status: 503 });
  const host = new URL(url).hostname.replace(/^[^.]+\./, 'api.');
  const r = await fetch('https://' + host + '/sql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Neon-Connection-String': url },
    body: JSON.stringify({ query, params }),
  });
  const out = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(out.message || 'Database error'), { status: 500 });
  return out.rows || [];
}

let ready = null;
export function ensureSchema() {
  ready = ready || (async () => {
    await sql(`CREATE TABLE IF NOT EXISTS lu_orgs (
      id bigserial PRIMARY KEY,
      name text NOT NULL,
      kind text NOT NULL,
      join_code text UNIQUE NOT NULL,
      admin_hash text UNIQUE NOT NULL,
      support_name text,
      support_phone text,
      ip_hash text,
      created_at timestamptz NOT NULL DEFAULT now())`);
    await sql(`CREATE TABLE IF NOT EXISTS lu_pulses (
      org_id bigint NOT NULL REFERENCES lu_orgs(id) ON DELETE CASCADE,
      week text NOT NULL,
      member_hash text NOT NULL,
      mood real,
      calm_gain real,
      breaks integer NOT NULL DEFAULT 0,
      contexts text[] NOT NULL DEFAULT '{}',
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (org_id, week, member_hash))`);
    // A week only counts people on different networks, so one person cannot fake a group.
    await sql('ALTER TABLE lu_pulses ADD COLUMN IF NOT EXISTS ip_hash text');
  })().catch((e) => { ready = null; throw e; });
  return ready;
}

export const sha256 = (s) => createHash('sha256').update(String(s)).digest('hex');
export const token = (bytes = 24) => randomBytes(bytes).toString('base64url');
const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const joinCode = () => 'LU' + [...randomBytes(6)].map((b) => ALPHA[b % ALPHA.length]).join('');
