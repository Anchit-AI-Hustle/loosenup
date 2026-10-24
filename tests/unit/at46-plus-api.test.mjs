// AT46: LoosenUp Plus on the server. Razorpay in India, Paddle elsewhere, with signed payments and webhooks.
// The database and both payment services are stand-ins here; nothing real is charged.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

const ENV = {
  DATABASE_URL: 'postgres://u:p@ep-test-123.ap-southeast-1.aws.neon.tech/db',
  RAZORPAY_KEY_ID: 'rzp_test_abc', RAZORPAY_KEY_SECRET: 'rzp_secret', RAZORPAY_WEBHOOK_SECRET: 'rzp_hook',
  RAZORPAY_PLAN_MONTHLY: 'plan_m', RAZORPAY_PLAN_YEARLY: 'plan_y',
  PADDLE_CLIENT_TOKEN: 'test_tok', PADDLE_API_KEY: 'pdl_key', PADDLE_WEBHOOK_SECRET: 'pdl_hook',
  PADDLE_PRICE_MONTHLY: 'pri_m', PADDLE_PRICE_YEARLY: 'pri_y', PADDLE_ENV: 'sandbox'
};
const hmac = (k, d) => createHmac('sha256', k).update(d).digest('hex');

// A tiny in-memory lu_plus table that answers the exact queries api/plus.js sends.
function world() {
  const rows = [], calls = [];
  globalThis.fetch = async (url, opts = {}) => {
    const body = opts.body ? JSON.parse(opts.body) : {};
    if (/neon\.tech\/sql$/.test(url)) {
      const { query: q, params: p = [] } = body;
      let out = [];
      if (/CREATE (TABLE|INDEX)/.test(q)) out = [];
      else if (/count\(\*\)/.test(q)) out = [{ n: rows.filter((r) => r.ip_hash === p[0]).length }];
      else if (/^INSERT INTO lu_plus/.test(q)) rows.push({ key_hash: p[0], provider: p[1], plan: p[2], ip_hash: p[3], status: 'pending_payment', sub_id: null, current_end: null, cancel_at_end: false });
      else if (/^SELECT \* FROM lu_plus WHERE key_hash/.test(q)) out = rows.filter((r) => r.key_hash === p[0]);
      else if (/SET sub_id = \$2, status = 'created'/.test(q)) { const r = rows.find((x) => x.key_hash === p[0]); r.sub_id = p[1]; r.status = 'created'; }
      else if (/SET status = 'active', current_end = \$2/.test(q)) { const r = rows.find((x) => x.key_hash === p[0]); r.status = 'active'; r.current_end = p[1]; }
      else if (/SET cancel_at_end = true/.test(q)) rows.find((x) => x.key_hash === p[0]).cancel_at_end = true;
      else if (/cancel_at_end = \(cancel_at_end OR \$6\)/.test(q)) {
        out = rows.filter((r) => r.key_hash === p[0] || (r.sub_id && r.sub_id === p[1])).map((r) => {
          r.status = p[2]; if (p[3]) r.current_end = p[3]; if (p[4]) r.customer_id = p[4]; r.cancel_at_end = r.cancel_at_end || p[5]; return { key_hash: r.key_hash };
        });
      } else if (/sub_id = COALESCE\(sub_id, \$2\)/.test(q)) {
        out = rows.filter((r) => r.key_hash === p[0] || (r.sub_id && r.sub_id === p[1])).map((r) => {
          r.sub_id = r.sub_id || p[1]; r.status = p[2]; if (p[3]) r.current_end = p[3]; if (p[4]) r.customer_id = p[4]; r.cancel_at_end = p[5]; return { key_hash: r.key_hash };
        });
      } else throw new Error('unexpected query ' + q);
      return { ok: true, json: async () => ({ rows: out }) };
    }
    calls.push({ url, method: opts.method || 'GET', body, auth: opts.headers && opts.headers.Authorization });
    if (url === 'https://api.razorpay.com/v1/subscriptions') return { ok: true, json: async () => ({ id: 'sub_123', status: 'created' }) };
    if (url === 'https://api.razorpay.com/v1/subscriptions/sub_123') return { ok: true, json: async () => ({ id: 'sub_123', status: 'active', current_end: 1830000000 }) };
    if (/razorpay\.com\/v1\/subscriptions\/sub_123\/cancel$/.test(url)) return { ok: true, json: async () => ({ id: 'sub_123', status: 'active' }) };
    if (/sandbox-api\.paddle\.com\/subscriptions\/sub_pdl\/cancel$/.test(url)) return { ok: true, json: async () => ({ data: { id: 'sub_pdl' } }) };
    return { ok: false, json: async () => ({ error: { description: 'not found' } }) };
  };
  return { rows, calls };
}

async function api(env = ENV) {
  for (const k of Object.keys(ENV)) delete process.env[k];
  Object.assign(process.env, env);
  const w = world();
  const mod = await import('../../api/plus.js?' + Math.random());
  const call = async (method, { query = {}, body = {}, headers = {}, raw } = {}) => {
    let status = 200, json;
    const res = { setHeader() {}, status(s) { status = s; return res; }, json(j) { json = j; return res; }, end() { return res; } };
    await mod.default({ method, query, body, headers, rawBody: raw }, res);
    return { status, json };
  };
  return { ...w, mod, call };
}

test('AT46 India sees Razorpay in rupees, everyone else sees Paddle in dollars, and nothing shows until a provider is set up', async () => {
  const { call } = await api();
  const india = await call('GET', { query: { action: 'config' }, headers: { 'x-vercel-ip-country': 'IN' } });
  assert.deepEqual([india.json.enabled, india.json.provider, india.json.currency, india.json.prices.monthly, india.json.prices.yearly], [true, 'razorpay', 'INR', '₹149', '₹799']);
  const us = await call('GET', { query: { action: 'config' }, headers: { 'x-vercel-ip-country': 'US' } });
  assert.deepEqual([us.json.provider, us.json.currency, us.json.prices.monthly, us.json.paddle.env], ['paddle', 'USD', 'US$4.99', 'sandbox']);
  assert.ok(!JSON.stringify(us.json).includes('rzp_secret') && !JSON.stringify(us.json).includes('pdl_key'), 'no secret leaves the server');
  const none = await (await api({ DATABASE_URL: ENV.DATABASE_URL })).call('GET', { query: { action: 'config' }, headers: { 'x-vercel-ip-country': 'IN' } });
  assert.equal(none.json.enabled, false);
  assert.equal(none.json.prices.monthly, '₹149', 'India sees rupee prices even before Plus opens');
  const only = await (await api({ ...ENV, PADDLE_API_KEY: '' })).call('GET', { query: { action: 'config' }, headers: { 'x-vercel-ip-country': 'DE' } });
  assert.equal(only.json.provider, 'razorpay', 'with only Razorpay set up, it serves everyone');
});

test('AT46 Razorpay: start makes a key (stored only as a hash), checkout makes a subscription, and a signed payment turns Plus on', async () => {
  const { call, rows, calls } = await api();
  const s = await call('POST', { body: { action: 'start', plan: 'yearly' }, headers: { 'x-vercel-ip-country': 'IN', 'x-forwarded-for': '1.2.3.4' } });
  assert.equal(s.status, 200);
  assert.match(s.json.key, /^LU[A-Za-z0-9_-]{30,}$/);
  assert.ok(!JSON.stringify(rows).includes(s.json.key), 'the key itself is never stored');
  const c = await call('POST', { body: { action: 'checkout', key: s.json.key } });
  assert.deepEqual([c.json.provider, c.json.keyId, c.json.subscriptionId], ['razorpay', 'rzp_test_abc', 'sub_123']);
  const created = calls.find((x) => x.url === 'https://api.razorpay.com/v1/subscriptions');
  assert.equal(created.body.plan_id, 'plan_y');
  assert.equal(created.body.notes.kh, rows[0].key_hash);
  assert.match(created.auth, /^Basic /);
  const again = await call('POST', { body: { action: 'checkout', key: s.json.key } });
  assert.equal(again.json.subscriptionId, 'sub_123');
  assert.equal(calls.filter((x) => x.url === 'https://api.razorpay.com/v1/subscriptions').length, 1, 'one subscription per key');

  const before = await call('POST', { body: { action: 'status', key: s.json.key } });
  assert.equal(before.json.active, false, 'not Plus before paying');
  const forged = await call('POST', { body: { action: 'verify', key: s.json.key, razorpay_payment_id: 'pay_1', razorpay_subscription_id: 'sub_123', razorpay_signature: 'f'.repeat(64) } });
  assert.equal(forged.status, 400, 'a forged payment is refused');
  assert.equal((await call('POST', { body: { action: 'status', key: s.json.key } })).json.active, false);
  const ok = await call('POST', { body: { action: 'verify', key: s.json.key, razorpay_payment_id: 'pay_1', razorpay_subscription_id: 'sub_123', razorpay_signature: hmac('rzp_secret', 'pay_1|sub_123') } });
  assert.equal(ok.status, 200);
  assert.equal(ok.json.active, true);
  assert.equal(ok.json.until, new Date(1830000000 * 1000).toISOString());
  assert.equal((await call('POST', { body: { action: 'status', key: s.json.key } })).json.active, true);
});

test('AT46 Razorpay webhooks: renewals extend Plus, a halted mandate ends it, and a cancellation lasts to the end of the period', async () => {
  const { call, rows } = await api();
  const s = await call('POST', { body: { action: 'start', plan: 'monthly' }, headers: { 'x-vercel-ip-country': 'IN' } });
  await call('POST', { body: { action: 'checkout', key: s.json.key } });
  const kh = rows[0].key_hash;
  const send = (event, sub, sig) => {
    const raw = JSON.stringify({ event, payload: { subscription: { entity: { id: 'sub_123', notes: { kh }, customer_id: 'cust_1', ...sub } } } });
    return call('POST', { query: { hook: 'razorpay' }, raw, headers: { 'x-razorpay-signature': sig || hmac('rzp_hook', raw) } });
  };
  const future = Math.floor(Date.now() / 1000) + 30 * 86400;
  assert.equal((await send('subscription.charged', { status: 'active', current_end: future }, 'f'.repeat(64))).status, 400, 'unsigned webhooks are refused');
  assert.equal((await send('subscription.charged', { status: 'active', current_end: future })).json.updated, 1);
  let st = (await call('POST', { body: { action: 'status', key: s.json.key } })).json;
  assert.equal(st.active, true);
  assert.equal(st.until, new Date(future * 1000).toISOString());
  await send('subscription.cancelled', { status: 'cancelled', current_end: future });
  st = (await call('POST', { body: { action: 'status', key: s.json.key } })).json;
  assert.deepEqual([st.active, st.cancelAtEnd], [true, true], 'paid time is kept after cancelling');
  const past = Math.floor(Date.now() / 1000) - 5 * 86400;
  await send('subscription.halted', { status: 'halted', current_end: past });
  assert.equal((await call('POST', { body: { action: 'status', key: s.json.key } })).json.active, false, 'a halted mandate ends Plus');
});

test('AT46 Paddle: checkout opens with the right price, and signed webhooks turn Plus on, schedule a cancel, and end it', async () => {
  const { call, rows } = await api();
  const s = await call('POST', { body: { action: 'start', plan: 'monthly' }, headers: { 'x-vercel-ip-country': 'GB' } });
  assert.equal(s.json.provider, 'paddle');
  const c = await call('POST', { body: { action: 'checkout', key: s.json.key } });
  assert.deepEqual([c.json.provider, c.json.priceId, c.json.token, c.json.env, c.json.customData.kh], ['paddle', 'pri_m', 'test_tok', 'sandbox', rows[0].key_hash]);
  const send = (event_type, data, opts = {}) => {
    const raw = JSON.stringify({ event_type, data: { id: 'sub_pdl', customer_id: 'ctm_1', custom_data: { kh: rows[0].key_hash }, ...data } });
    const ts = opts.ts || Math.floor(Date.now() / 1000);
    return call('POST', { query: { hook: 'paddle' }, raw, headers: { 'paddle-signature': 'ts=' + ts + ';h1=' + (opts.h1 || hmac('pdl_hook', ts + ':' + raw)) } });
  };
  const ends = new Date(Date.now() + 30 * 86400000).toISOString();
  assert.equal((await send('subscription.created', { status: 'active' }, { h1: 'f'.repeat(64) })).status, 400, 'bad signature refused');
  assert.equal((await send('subscription.created', { status: 'active' }, { ts: Math.floor(Date.now() / 1000) - 7200 })).status, 400, 'an old replayed webhook is refused');
  await send('subscription.created', { status: 'active', current_billing_period: { ends_at: ends } });
  let st = (await call('POST', { body: { action: 'status', key: s.json.key } })).json;
  assert.deepEqual([st.active, st.provider, st.until], [true, 'paddle', ends]);
  await send('subscription.updated', { status: 'active', current_billing_period: { ends_at: ends }, scheduled_change: { action: 'cancel' } });
  st = (await call('POST', { body: { action: 'status', key: s.json.key } })).json;
  assert.deepEqual([st.active, st.cancelAtEnd], [true, true]);
  const old = new Date(Date.now() - 10 * 86400000).toISOString();
  await send('subscription.canceled', { status: 'canceled', current_billing_period: { ends_at: old } });
  assert.equal((await call('POST', { body: { action: 'status', key: s.json.key } })).json.active, false);
});

test('AT46 cancelling stops the next payment at each provider and keeps Plus to the end of the period', async () => {
  const { call, calls, rows } = await api();
  const s = await call('POST', { body: { action: 'start', plan: 'yearly' }, headers: { 'x-vercel-ip-country': 'IN' } });
  await call('POST', { body: { action: 'checkout', key: s.json.key } });
  await call('POST', { body: { action: 'verify', key: s.json.key, razorpay_payment_id: 'pay_1', razorpay_subscription_id: 'sub_123', razorpay_signature: hmac('rzp_secret', 'pay_1|sub_123') } });
  const r = await call('POST', { body: { action: 'cancel', key: s.json.key } });
  assert.deepEqual([r.json.active, r.json.cancelAtEnd], [true, true]);
  assert.deepEqual(calls.find((x) => /\/cancel$/.test(x.url)).body, { cancel_at_cycle_end: 1 });
  const p = await call('POST', { body: { action: 'start', plan: 'monthly' }, headers: { 'x-vercel-ip-country': 'FR' } });
  rows.at(-1).sub_id = 'sub_pdl'; rows.at(-1).status = 'active';
  await call('POST', { body: { action: 'cancel', key: p.json.key } });
  const pc = calls.find((x) => /paddle\.com\/subscriptions\/sub_pdl\/cancel$/.test(x.url));
  assert.deepEqual(pc.body, { effective_from: 'next_billing_period' });
  assert.equal(pc.auth, 'Bearer pdl_key');
});

test('AT46 keys are checked, unknown keys and plans are refused, and payments cannot be bought while switched off', async () => {
  const { call } = await api();
  assert.equal((await call('POST', { body: { action: 'status', key: 'nope' } })).status, 400);
  assert.equal((await call('POST', { body: { action: 'status', key: 'LU' + 'z'.repeat(32) } })).status, 404);
  assert.equal((await call('POST', { body: { action: 'start', plan: 'lifetime' } })).status, 400);
  const off = await (await api({ DATABASE_URL: ENV.DATABASE_URL })).call('POST', { body: { action: 'start', plan: 'monthly' } });
  assert.equal(off.status, 503);
  assert.match(off.json.error, /opens soon/);
});

test('AT46 entitlement rules: grace for a renewal in progress, nothing for an unpaid subscription', async () => {
  const { mod } = await api();
  const now = Date.parse('2026-11-01T00:00:00Z');
  const e = (row) => mod.entitlement(row, now).active;
  assert.equal(e({ status: 'created' }), false);
  assert.equal(e({ status: 'pending_payment' }), false);
  assert.equal(e({ status: 'active', current_end: '2026-11-20T00:00:00Z' }), true);
  assert.equal(e({ status: 'active', current_end: '2026-10-30T00:00:00Z' }), true, 'three days of grace while a renewal goes through');
  assert.equal(e({ status: 'active', current_end: '2026-10-20T00:00:00Z' }), false);
  assert.equal(e({ status: 'past_due', current_end: '2026-10-31T00:00:00Z' }), true);
  assert.equal(e({ status: 'cancelled', current_end: '2026-11-10T00:00:00Z' }), true);
  assert.equal(e({ status: 'cancelled', current_end: '2026-10-31T00:00:00Z' }), false);
  assert.equal(e({ status: 'halted', current_end: '2026-11-10T00:00:00Z' }), false);
});
