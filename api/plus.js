// LoosenUp Plus: real subscriptions, picked by region.
//   India: Razorpay (UPI, UPI Autopay, cards, netbanking) in INR.
//   Everywhere else: Paddle, the merchant of record, so sales tax and VAT are handled in every country.
//
//   GET  /api/plus?action=config                      -> which provider and prices this visitor sees
//   POST /api/plus { action: 'start', plan }           -> a new Plus key (shown once; the app keeps it)
//   POST /api/plus { action: 'checkout', key }         -> what the checkout page needs to open the provider
//   POST /api/plus { action: 'verify', key, razorpay_payment_id, razorpay_subscription_id, razorpay_signature }
//   POST /api/plus { action: 'status', key }           -> { active, plan, until, cancelAtEnd, provider }
//   POST /api/plus { action: 'cancel', key }           -> cancels at the end of the paid period
//   POST /api/plus?hook=razorpay | ?hook=paddle        -> provider webhooks, signature checked on the raw body
//
// No names, emails or card details are stored here. A Plus key is stored only as a hash, so the key
// itself is the proof of purchase that restores Plus on another phone.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { sql, sha256, token } from './_db.js';

export const PLANS = { monthly: { months: 1 }, yearly: { months: 12 } };
const PRICES = {
  INR: { monthly: '₹149', yearly: '₹799', note: 'per month', yearNote: 'per year' },
  USD: { monthly: 'US$4.99', yearly: 'US$34.99', note: 'per month', yearNote: 'per year' }
};
// Paid access lasts while a subscription is in one of these states; cancelled plans last to the end of the paid period.
const LIVE = ['active', 'authenticated', 'trialing', 'past_due', 'pending'];
const GRACE_MS = 3 * 86400000;

const problem = (status, message) => Object.assign(new Error(message), { status });
const env = (k) => process.env[k] || '';

export function razorpayReady() { return !!(env('RAZORPAY_KEY_ID') && env('RAZORPAY_KEY_SECRET') && env('RAZORPAY_PLAN_MONTHLY') && env('RAZORPAY_PLAN_YEARLY')); }
export function paddleReady() { return !!(env('PADDLE_CLIENT_TOKEN') && env('PADDLE_API_KEY') && env('PADDLE_PRICE_MONTHLY') && env('PADDLE_PRICE_YEARLY')); }
const paddleApi = () => (env('PADDLE_ENV') === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com');

// India pays in rupees with UPI through Razorpay; everyone else goes through Paddle. If only one is set up, it serves all.
export function providerFor(country) {
  const india = String(country || '').toUpperCase() === 'IN';
  if (india && razorpayReady()) return 'razorpay';
  if (!india && paddleReady()) return 'paddle';
  if (razorpayReady()) return 'razorpay';
  if (paddleReady()) return 'paddle';
  return null;
}

let ready = null;
function schema() {
  ready = ready || sql(`CREATE TABLE IF NOT EXISTS lu_plus (
      key_hash text PRIMARY KEY,
      provider text NOT NULL,
      plan text NOT NULL,
      status text NOT NULL DEFAULT 'pending_payment',
      sub_id text,
      customer_id text,
      current_end timestamptz,
      cancel_at_end boolean NOT NULL DEFAULT false,
      ip_hash text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now())`)
    .then(() => sql('CREATE INDEX IF NOT EXISTS lu_plus_sub ON lu_plus (sub_id)'))
    .catch((e) => { ready = null; throw e; });
  return ready;
}

const hmac = (secret, data) => createHmac('sha256', secret).update(data).digest('hex');
function same(a, b) {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''));
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}

// Whether a stored subscription gives Plus right now.
export function entitlement(row, nowMs = Date.now()) {
  if (!row) return { active: false };
  const end = row.current_end ? new Date(row.current_end).getTime() : null;
  const live = LIVE.includes(row.status) && row.status !== 'pending' ? (end == null || end + GRACE_MS > nowMs) : false;
  const paidOut = (row.status === 'cancelled' || row.status === 'canceled' || row.status === 'pending') && end != null && end > nowMs;
  return {
    active: live || paidOut,
    plan: row.plan, provider: row.provider,
    until: end ? new Date(end).toISOString() : null,
    cancelAtEnd: !!row.cancel_at_end || row.status === 'cancelled' || row.status === 'canceled',
    status: row.status
  };
}

async function rowFor(key) {
  const k = String(key || '');
  if (!/^LU[A-Za-z0-9_-]{20,40}$/.test(k)) throw problem(400, 'That Plus key does not look right.');
  const rows = await sql('SELECT * FROM lu_plus WHERE key_hash = $1', [sha256(k)]);
  if (!rows.length) throw problem(404, 'That Plus key was not found.');
  return rows[0];
}

async function razorpay(path, body, method = 'POST') {
  const auth = Buffer.from(env('RAZORPAY_KEY_ID') + ':' + env('RAZORPAY_KEY_SECRET')).toString('base64');
  const r = await fetch('https://api.razorpay.com/v1' + path, {
    method, headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw problem(502, (j.error && j.error.description) || 'The payment service did not answer. Please try again.');
  return j;
}
async function paddle(path, body, method = 'POST') {
  const r = await fetch(paddleApi() + path, {
    method, headers: { Authorization: 'Bearer ' + env('PADDLE_API_KEY'), 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw problem(502, (j.error && j.error.detail) || 'The payment service did not answer. Please try again.');
  return j.data || j;
}

function config(country) {
  const provider = providerFor(country);
  const currency = provider === 'razorpay' ? 'INR' : 'USD';
  return {
    enabled: !!provider, provider, country: String(country || '').toUpperCase() || null, currency,
    prices: PRICES[currency],
    paddle: provider === 'paddle' ? { token: env('PADDLE_CLIENT_TOKEN'), env: env('PADDLE_ENV') === 'production' ? 'production' : 'sandbox' } : null
  };
}

async function start(body, country, ip) {
  const plan = PLANS[body.plan] ? body.plan : null;
  if (!plan) throw problem(400, 'Choose monthly or yearly.');
  const provider = providerFor(country);
  if (!provider) throw problem(503, 'LoosenUp Plus opens soon.');
  const ipHash = sha256('lu-plus-ip:' + ip);
  const recent = await sql(`SELECT count(*)::int AS n FROM lu_plus WHERE ip_hash = $1 AND created_at > now() - interval '1 hour'`, [ipHash]);
  if ((recent[0] && recent[0].n) >= 20) throw problem(429, 'Please wait a little before trying again.');
  const key = 'LU' + token(24);
  await sql('INSERT INTO lu_plus (key_hash, provider, plan, ip_hash) VALUES ($1, $2, $3, $4)', [sha256(key), provider, plan, ipHash]);
  return { key, provider, plan };
}

async function checkout(body) {
  const row = await rowFor(body.key);
  if (entitlement(row).active) return { provider: row.provider, alreadyActive: true };
  if (row.provider === 'razorpay') {
    let sub = row.sub_id;
    if (!sub) {
      const s = await razorpay('/subscriptions', {
        plan_id: env(row.plan === 'yearly' ? 'RAZORPAY_PLAN_YEARLY' : 'RAZORPAY_PLAN_MONTHLY'),
        total_count: row.plan === 'yearly' ? 10 : 120, customer_notify: 1, notes: { kh: row.key_hash }
      });
      sub = s.id;
      await sql(`UPDATE lu_plus SET sub_id = $2, status = 'created', updated_at = now() WHERE key_hash = $1`, [row.key_hash, sub]);
    }
    return { provider: 'razorpay', keyId: env('RAZORPAY_KEY_ID'), subscriptionId: sub, plan: row.plan };
  }
  return {
    provider: 'paddle', token: env('PADDLE_CLIENT_TOKEN'), env: env('PADDLE_ENV') === 'production' ? 'production' : 'sandbox',
    priceId: env(row.plan === 'yearly' ? 'PADDLE_PRICE_YEARLY' : 'PADDLE_PRICE_MONTHLY'), customData: { kh: row.key_hash }, plan: row.plan
  };
}

// Razorpay's checkout returns a signature over payment id and subscription id, made with our secret.
async function verify(body) {
  const row = await rowFor(body.key);
  if (row.provider !== 'razorpay') throw problem(400, 'This key uses a different checkout.');
  const pay = String(body.razorpay_payment_id || ''), sub = String(body.razorpay_subscription_id || '');
  if (!row.sub_id || sub !== row.sub_id) throw problem(400, 'That payment is for a different subscription.');
  if (!same(hmac(env('RAZORPAY_KEY_SECRET'), pay + '|' + sub), body.razorpay_signature)) throw problem(400, 'The payment could not be confirmed.');
  let end = null;
  try { const s = await razorpay('/subscriptions/' + sub, null, 'GET'); end = s.current_end ? new Date(s.current_end * 1000).toISOString() : null; } catch (e) { /* the webhook fills it in */ }
  if (!end) { const d = new Date(); d.setMonth(d.getMonth() + PLANS[row.plan].months); end = d.toISOString(); }
  await sql(`UPDATE lu_plus SET status = 'active', current_end = $2, updated_at = now() WHERE key_hash = $1`, [row.key_hash, end]);
  return entitlement({ ...row, status: 'active', current_end: end });
}

async function status(body) { return entitlement(await rowFor(body.key)); }

async function cancel(body) {
  const row = await rowFor(body.key);
  if (!row.sub_id) throw problem(400, 'There is no subscription to cancel.');
  if (row.provider === 'razorpay') await razorpay('/subscriptions/' + row.sub_id + '/cancel', { cancel_at_cycle_end: 1 });
  else await paddle('/subscriptions/' + row.sub_id + '/cancel', { effective_from: 'next_billing_period' });
  await sql('UPDATE lu_plus SET cancel_at_end = true, updated_at = now() WHERE key_hash = $1', [row.key_hash]);
  return entitlement({ ...row, cancel_at_end: true });
}

// Webhooks: renewals, failed payments and cancellations keep each key's access current.
export async function razorpayHook(raw, headers) {
  const secret = env('RAZORPAY_WEBHOOK_SECRET');
  if (!secret || !same(hmac(secret, raw), headers['x-razorpay-signature'])) throw problem(400, 'Signature did not match.');
  const ev = JSON.parse(raw);
  const s = ev.payload && ev.payload.subscription && ev.payload.subscription.entity;
  if (!s) return { ok: true, ignored: ev.event };
  const kh = s.notes && s.notes.kh;
  const end = s.current_end ? new Date(s.current_end * 1000).toISOString() : null;
  const rows = await sql(`UPDATE lu_plus SET status = $3, current_end = COALESCE($4, current_end), customer_id = COALESCE($5, customer_id),
      cancel_at_end = (cancel_at_end OR $6), updated_at = now() WHERE key_hash = $1 OR sub_id = $2 RETURNING key_hash`,
  [kh || '', s.id, s.status, end, s.customer_id || null, s.status === 'cancelled']);
  return { ok: true, updated: rows.length };
}

export async function paddleHook(raw, headers) {
  const secret = env('PADDLE_WEBHOOK_SECRET');
  const sig = String(headers['paddle-signature'] || '');
  const ts = (/ts=(\d+)/.exec(sig) || [])[1], h1 = (/h1=([a-f0-9]+)/.exec(sig) || [])[1];
  if (!secret || !ts || !same(hmac(secret, ts + ':' + raw), h1)) throw problem(400, 'Signature did not match.');
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 3600) throw problem(400, 'Old webhook.');
  const ev = JSON.parse(raw);
  const d = ev.data || {};
  const kh = d.custom_data && d.custom_data.kh;
  if (!/^subscription\./.test(ev.event_type || '')) return { ok: true, ignored: ev.event_type };
  const end = d.current_billing_period && d.current_billing_period.ends_at;
  const cancelAtEnd = !!(d.scheduled_change && d.scheduled_change.action === 'cancel') || d.status === 'canceled';
  const rows = await sql(`UPDATE lu_plus SET sub_id = COALESCE(sub_id, $2), status = $3, current_end = COALESCE($4, current_end),
      customer_id = COALESCE($5, customer_id), cancel_at_end = $6, updated_at = now() WHERE key_hash = $1 OR sub_id = $2 RETURNING key_hash`,
  [kh || '', d.id || '', d.status || 'active', end || null, d.customer_id || null, cancelAtEnd]);
  return { ok: true, updated: rows.length };
}

// Webhook signatures cover the exact bytes sent, so read the body before anything parses it.
function rawBody(req) {
  if (typeof req.rawBody === 'string') return Promise.resolve(req.rawBody);
  if (Buffer.isBuffer(req.rawBody)) return Promise.resolve(req.rawBody.toString('utf8'));
  if (typeof req.on !== 'function' || req.readableEnded) return Promise.resolve(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const hook = req.query && req.query.hook;
    if (hook) {
      const raw = await rawBody(req);
      await schema();
      const out = hook === 'razorpay' ? await razorpayHook(raw, req.headers) : hook === 'paddle' ? await paddleHook(raw, req.headers) : null;
      if (!out) throw problem(400, 'Unknown webhook.');
      return res.status(200).json(out);
    }
    const country = req.headers['x-vercel-ip-country'] || '';
    const action = (req.query && req.query.action) || (req.body && req.body.action);
    if (req.method === 'GET' && action === 'config') return res.status(200).json(config(country));
    await schema();
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    let out;
    if (req.method !== 'POST') throw problem(405, 'Use POST.');
    if (action === 'start') out = await start(body, country, ip);
    else if (action === 'checkout') out = await checkout(body);
    else if (action === 'verify') out = await verify(body);
    else if (action === 'status') out = await status(body);
    else if (action === 'cancel') out = await cancel(body);
    else throw problem(400, 'Unknown action.');
    return res.status(200).json(out);
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.status ? e.message : 'Something went sideways. Please try again.' });
  }
}
