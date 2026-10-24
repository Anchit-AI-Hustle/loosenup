// AT52: Razorpay Standard Checkout. Without subscription plans, Razorpay sells one month or one year of
// Plus as a single order: the server creates the order, and Plus turns on only when the signature over
// order_id|payment_id matches and Razorpay confirms the payment for that order and amount.
// The database and Razorpay are stand-ins here; nothing real is charged.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

const ENV = { DATABASE_URL: 'postgres://u:p@ep-test-123.ap-southeast-1.aws.neon.tech/db', RAZORPAY_KEY_ID: 'rzp_test_abc', RAZORPAY_KEY_SECRET: 'rzp_secret', RAZORPAY_WEBHOOK_SECRET: 'rzp_hook' };
const hmac = (k, d) => createHmac('sha256', k).update(d).digest('hex');

function world(payments) {
  const rows = [], orders = [], calls = [];
  globalThis.fetch = async (url, opts = {}) => {
    const body = opts.body ? JSON.parse(opts.body) : {};
    if (/neon\.tech\/sql$/.test(url)) {
      const { query: q, params: p = [] } = body;
      let out = [];
      if (/CREATE (TABLE|INDEX)/.test(q)) out = [];
      else if (/count\(\*\)/.test(q)) out = [{ n: 0 }];
      else if (/^INSERT INTO lu_plus/.test(q)) rows.push({ key_hash: p[0], provider: p[1], plan: p[2], status: 'pending_payment', sub_id: null, current_end: null, cancel_at_end: false });
      else if (/^SELECT \* FROM lu_plus WHERE key_hash/.test(q)) out = rows.filter((r) => r.key_hash === p[0]);
      else if (/SET sub_id = \$2, status = 'created'/.test(q)) Object.assign(rows.find((x) => x.key_hash === p[0]), { sub_id: p[1], status: 'created' });
      else if (/SET status = 'active', current_end = \$2, cancel_at_end = true/.test(q)) Object.assign(rows.find((x) => x.key_hash === p[0]), { status: 'active', current_end: p[1], cancel_at_end: true });
      else if (/WHERE sub_id = \$1 AND \(key_hash = \$2 OR \$2 = ''\) AND status <> 'active'/.test(q)) {
        out = rows.filter((r) => r.sub_id === p[0] && (r.key_hash === p[1] || p[1] === '') && r.status !== 'active')
          .map((r) => { Object.assign(r, { status: 'active', current_end: r.current_end || p[2], cancel_at_end: true }); return { key_hash: r.key_hash }; });
      } else throw new Error('unexpected query ' + q);
      return { ok: true, json: async () => ({ rows: out }) };
    }
    calls.push({ url, method: opts.method || 'GET', body, auth: opts.headers && opts.headers.Authorization });
    if (url === 'https://api.razorpay.com/v1/orders') { const o = { id: 'order_' + (orders.length + 1), amount: body.amount, currency: body.currency, notes: body.notes }; orders.push(o); return { ok: true, json: async () => o }; }
    const pm = url.match(/razorpay\.com\/v1\/payments\/(.+)$/);
    if (pm && payments[pm[1]]) return { ok: true, json: async () => payments[pm[1]] };
    return { ok: false, json: async () => ({ error: { description: 'not found' } }) };
  };
  return { rows, orders, calls };
}

async function api(payments = {}, env = ENV) {
  for (const k of ['RAZORPAY_PLAN_MONTHLY', 'RAZORPAY_PLAN_YEARLY', 'PADDLE_API_KEY', 'PADDLE_CLIENT_TOKEN', 'PADDLE_PRICE_MONTHLY', 'PADDLE_PRICE_YEARLY', ...Object.keys(ENV)]) delete process.env[k];
  Object.assign(process.env, env);
  const w = world(payments);
  const mod = await import('../../api/plus.js?' + Math.random());
  const call = async (method, { query = {}, body = {}, headers = {}, raw } = {}) => {
    let status = 200, json;
    const res = { setHeader() {}, status(s) { status = s; return res; }, json(j) { json = j; return res; }, end() { return res; } };
    await mod.default({ method, query, body, headers, rawBody: raw }, res);
    return { status, json };
  };
  return { ...w, mod, call };
}
const IN = { 'x-vercel-ip-country': 'IN' };
async function bought(a, plan = 'monthly') {
  const { json: s } = await a.call('POST', { body: { action: 'start', plan }, headers: IN });
  const { json: c } = await a.call('POST', { body: { action: 'checkout', key: s.key } });
  return { key: s.key, c };
}

test('AT52 with only keys set, Razorpay sells one-time Plus in rupees and says it does not renew', async () => {
  const a = await api();
  assert.equal(a.mod.razorpayMode(), 'orders');
  const { json } = await a.call('GET', { query: { action: 'config' }, headers: IN });
  assert.deepEqual([json.enabled, json.provider, json.currency, json.renews], [true, 'razorpay', 'INR', false]);
  assert.ok(!JSON.stringify(json).includes('rzp_secret'), 'the secret never leaves the server');
});

test('AT52 checkout creates an order for the exact plan amount, and opening it again reuses the order', async () => {
  const a = await api();
  const { key, c } = await bought(a, 'yearly');
  assert.deepEqual([c.provider, c.keyId, c.orderId, c.amount, c.currency], ['razorpay', 'rzp_test_abc', 'order_1', 79900, 'INR']);
  const call = a.calls.find((x) => x.url.endsWith('/v1/orders'));
  assert.deepEqual([call.body.amount, call.body.currency], [79900, 'INR']);
  assert.ok(call.body.amount >= 100, 'at least 100 paise');
  assert.ok(call.body.receipt.length <= 40, 'Razorpay receipts are at most 40 characters');
  assert.equal(call.auth, 'Basic ' + Buffer.from('rzp_test_abc:rzp_secret').toString('base64'));
  const again = await a.call('POST', { body: { action: 'checkout', key } });
  assert.equal(again.json.orderId, 'order_1');
  assert.equal(a.orders.length, 1);
});

test('AT52 a matching signature and a captured payment for the order turn Plus on for a month, with no renewal', async () => {
  const a = await api({ pay_ok: { id: 'pay_ok', order_id: 'order_1', amount: 14900, status: 'captured' } });
  const { key } = await bought(a);
  const sig = hmac('rzp_secret', 'order_1|pay_ok');
  const v = await a.call('POST', { body: { action: 'verify', key, razorpay_order_id: 'order_1', razorpay_payment_id: 'pay_ok', razorpay_signature: sig } });
  assert.equal(v.status, 200);
  assert.deepEqual([v.json.active, v.json.cancelAtEnd, v.json.plan], [true, true, 'monthly']);
  const days = (new Date(v.json.until) - Date.now()) / 86400000;
  assert.ok(days > 27 && days < 32, 'about a month');
  const st = await a.call('POST', { body: { action: 'status', key } });
  assert.equal(st.json.active, true);
  const cancel = await a.call('POST', { body: { action: 'cancel', key } });
  assert.deepEqual([cancel.status, cancel.json.active], [200, true], 'nothing to cancel; Plus stays to the end');
});

test('AT52 a wrong signature, missing fields, another order or the wrong amount never turn Plus on', async () => {
  const a = await api({ pay_ok: { id: 'pay_ok', order_id: 'order_1', amount: 14900, status: 'captured' }, pay_low: { id: 'pay_low', order_id: 'order_1', amount: 100, status: 'captured' } });
  const { key } = await bought(a);
  const tries = [
    { razorpay_order_id: 'order_1', razorpay_payment_id: 'pay_ok', razorpay_signature: hmac('wrong', 'order_1|pay_ok') },
    { razorpay_order_id: 'order_1', razorpay_payment_id: 'pay_ok' },
    { razorpay_order_id: 'order_9', razorpay_payment_id: 'pay_ok', razorpay_signature: hmac('rzp_secret', 'order_9|pay_ok') },
    { razorpay_order_id: 'order_1', razorpay_payment_id: 'pay_low', razorpay_signature: hmac('rzp_secret', 'order_1|pay_low') }
  ];
  for (const t of tries) {
    const r = await a.call('POST', { body: { action: 'verify', key, ...t } });
    assert.equal(r.status, 400, JSON.stringify(t));
  }
  assert.equal(a.rows[0].status, 'created', 'not marked as paid');
  assert.equal((await a.call('POST', { body: { action: 'status', key } })).json.active, false);
});

test('AT52 the order.paid webhook turns Plus on if the page closed before it could confirm', async () => {
  const a = await api();
  const { key } = await bought(a, 'yearly');
  const raw = JSON.stringify({ event: 'order.paid', payload: { order: { entity: { id: 'order_1', notes: { kh: a.rows[0].key_hash, plan: 'yearly' } } } } });
  const bad = await a.call('POST', { query: { hook: 'razorpay' }, raw, headers: { 'x-razorpay-signature': hmac('nope', raw) } });
  assert.equal(bad.status, 400);
  const ok = await a.call('POST', { query: { hook: 'razorpay' }, raw, headers: { 'x-razorpay-signature': hmac('rzp_hook', raw) } });
  assert.deepEqual([ok.status, ok.json.updated], [200, 1]);
  const st = await a.call('POST', { body: { action: 'status', key } });
  assert.equal(st.json.active, true);
  assert.ok((new Date(st.json.until) - Date.now()) / 86400000 > 360, 'a year');
});

test('AT52 with subscription plans set, Razorpay keeps using subscriptions', async () => {
  const a = await api({}, { ...ENV, RAZORPAY_PLAN_MONTHLY: 'plan_m', RAZORPAY_PLAN_YEARLY: 'plan_y' });
  assert.equal(a.mod.razorpayMode(), 'subscriptions');
  const { json } = await a.call('GET', { query: { action: 'config' }, headers: IN });
  assert.equal(json.renews, true);
});
