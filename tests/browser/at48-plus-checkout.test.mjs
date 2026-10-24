// AT48: the LoosenUp Plus checkout page in a real browser, with stand-in Razorpay and Paddle scripts.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { chromium } from 'playwright';
import { startServer } from '../helpers/serve.mjs';

let server, browser;
before(async () => { server = await startServer(0); browser = await chromium.launch(); });
after(async () => { await browser?.close(); await server?.close(); });

const KEY = 'LU' + 'q'.repeat(32);
// Stand-in Razorpay: opens, then reports a signed successful payment (or a closed window).
const FAKE_RZP = (mode) => `window.Razorpay = function (o) { this.o = o; };
  window.Razorpay.prototype.on = function () {};
  window.Razorpay.prototype.open = function () { window.__rzp = this.o; var o = this.o;
    setTimeout(function () { ${mode === 'close' ? 'o.modal.ondismiss();' : "o.handler(o.order_id ? { razorpay_payment_id: 'pay_1', razorpay_order_id: o.order_id, razorpay_signature: 'sig' } : { razorpay_payment_id: 'pay_1', razorpay_subscription_id: o.subscription_id, razorpay_signature: 'sig' });"} }, 50); };`;
const FAKE_PADDLE = `window.Paddle = { Environment: { set: function (e) { window.__env = e; } },
  Initialize: function (o) { window.__init = o; },
  Checkout: { open: function (o) { window.__open = o; setTimeout(function () { window.__init.eventCallback({ name: window.__paddleFails ? 'checkout.error' : 'checkout.completed' }); }, 50); } } };`;

async function page({ provider = 'razorpay', mode = 'pay', activeAfter = 1, orders = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errors = [], calls = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  let statusChecks = 0;
  await p.route('https://checkout.razorpay.com/**', (r) => r.fulfill({ contentType: 'text/javascript', body: FAKE_RZP(mode) }));
  await p.route('https://cdn.paddle.com/**', (r) => r.fulfill({ contentType: 'text/javascript', body: FAKE_PADDLE }));
  await p.route('**/api/plus**', async (r) => {
    const req = r.request();
    const body = req.postData() ? JSON.parse(req.postData()) : {};
    calls.push(body.action || 'config');
    let json;
    if (/action=config/.test(req.url())) json = { enabled: true, renews: !orders, provider, currency: provider === 'razorpay' ? 'INR' : 'USD', prices: provider === 'razorpay' ? { monthly: '₹149', yearly: '₹799' } : { monthly: 'US$4.99', yearly: 'US$34.99' } };
    else if (body.action === 'start') json = { key: KEY, provider, plan: body.plan };
    else if (body.action === 'checkout' && orders) json = { provider, keyId: 'rzp_test_abc', orderId: 'order_1', amount: 79900, currency: 'INR', plan: 'yearly' };
    else if (body.action === 'checkout') json = provider === 'razorpay' ? { provider, keyId: 'rzp_test_abc', subscriptionId: 'sub_123', plan: 'yearly' } : { provider, token: 'test_tok', env: 'sandbox', transactionId: 'txn_1', priceId: 'pri_y', customData: { kh: 'h' }, plan: 'yearly' };
    else if (body.action === 'verify' && orders) json = body.razorpay_order_id === 'order_1' && body.razorpay_payment_id === 'pay_1' ? { active: true, until: '2027-10-24T00:00:00.000Z', plan: 'yearly', provider, cancelAtEnd: true } : { error: 'no' };
    else if (body.action === 'verify') json = body.razorpay_subscription_id === 'sub_123' ? { active: true, until: '2027-10-24T00:00:00.000Z', plan: 'yearly', provider } : { error: 'no' };
    else if (body.action === 'status') { statusChecks++; json = { active: statusChecks >= activeAfter, until: '2027-10-24T00:00:00.000Z', plan: 'yearly', provider }; }
    await r.fulfill({ status: json.error ? 400 : 200, contentType: 'application/json', body: JSON.stringify(json) });
  });
  return { ctx, p, errors, calls };
}

test('AT48 India: the app opens checkout with its key, Razorpay takes the UPI or card payment, the server verifies it, and the key is shown', async () => {
  const { ctx, p, errors, calls } = await page();
  await p.goto(server.url + '/plus.html#k=' + KEY + '&plan=yearly');
  await p.waitForSelector('#plus-done:not([hidden])');
  assert.deepEqual(calls, ['config', 'checkout', 'verify'], 'no new key is made when the app already made one');
  const opts = await p.evaluate(() => ({ key: window.__rzp.key, sub: window.__rzp.subscription_id, name: window.__rzp.name }));
  assert.deepEqual(opts, { key: 'rzp_test_abc', sub: 'sub_123', name: 'LoosenUp Plus' });
  assert.equal(await p.textContent('#plus-key'), KEY);
  assert.match(await p.textContent('#plus-until'), /Active until 24 October 2027/);
  assert.equal(await p.evaluate(() => location.hash), '#done', 'the key leaves the address bar');
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('AT48 a visitor on the website picks a plan, and closing the checkout says nothing was charged and offers Try again', async () => {
  const { ctx, p, errors, calls } = await page({ mode: 'close' });
  await p.goto(server.url + '/plus.html');
  assert.equal(await p.textContent('#price-yearly'), '₹799');
  await p.click('[data-plan="monthly"]');
  await p.click('#plus-buy');
  await p.waitForSelector('#plus-retry:not([hidden])');
  assert.match(await p.textContent('#plus-error'), /Nothing was charged/);
  assert.deepEqual(calls.slice(0, 3), ['config', 'start', 'checkout']);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('AT48 outside India: Paddle opens in sandbox with the price, and Plus shows once the webhook has confirmed it', async () => {
  const { ctx, p, errors } = await page({ provider: 'paddle', activeAfter: 2 });
  await p.goto(server.url + '/plus.html#k=' + KEY + '&plan=yearly');
  await p.waitForSelector('#plus-done:not([hidden])', { timeout: 10000 });
  const o = await p.evaluate(() => ({ env: window.__env, token: window.__init.token, txn: window.__open.transactionId, items: window.__open.items || null }));
  assert.deepEqual(o, { env: 'sandbox', token: 'test_tok', txn: 'txn_1', items: null }, 'opens the server-made transaction');
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('AT48 in Hindi, the checkout page speaks Hindi', async () => {
  const { ctx, p } = await page({ mode: 'close' });
  await p.goto(server.url + '/plus.html#lang=hi');
  assert.match(await p.textContent('#plus-buy'), /[ऀ-ॿ]/);
  assert.match(await p.textContent('.perks'), /[ऀ-ॿ]/);
  await ctx.close();
});

test('AT48 from the app: choosing a plan opens the checkout page with a fresh key, and returning turns Plus on', async () => {
  const { ctx, p } = await page();
  await p.goto(server.url + '/');
  await p.fill('#name-input', 'Asha'); await p.click('#welcome-go'); await p.click('#gift-go');
  await p.evaluate(() => window.LoosenUp.loadPayConfig());
  await p.evaluate(() => window.LoosenUp.openShop());
  await p.click('[data-plus-plan="yearly"]');
  await p.waitForURL(/plus\.html/);
  await p.waitForSelector('#plus-done:not([hidden])');
  await p.click('#plus-back');
  await p.waitForFunction(() => window.LoosenUp && window.LoosenUp.isPlus());
  await p.evaluate(() => window.LoosenUp.go('me'));
  assert.match(await p.textContent('#me-plan'), /LoosenUp Plus/);
  await ctx.close();
});

test('AT48 Razorpay Standard Checkout: one order, the order id goes back for verification, and it says it does not renew', async () => {
  const { ctx, p, errors, calls } = await page({ orders: true });
  await p.goto(server.url + '/plus.html#k=' + KEY + '&plan=yearly');
  await p.waitForSelector('#plus-done:not([hidden])');
  const o = await p.evaluate(() => ({ order: window.__rzp.order_id, amount: window.__rzp.amount, currency: window.__rzp.currency, sub: window.__rzp.subscription_id || null }));
  assert.deepEqual(o, { order: 'order_1', amount: 79900, currency: 'INR', sub: null });
  assert.deepEqual(calls, ['config', 'checkout', 'verify']);
  assert.match(await p.textContent('#plus-until'), /Active until 24 October 2027\. Buy again any time to add more\./);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('AT48 back from Razorpay redirect mode: #paid shows Plus on with the key kept in the tab, #unpaid offers Try again', async () => {
  const { ctx, p, errors } = await page({ orders: true });
  await p.goto(server.url + '/plus.html');
  await p.evaluate((k) => sessionStorage.setItem('lu.plusKey', k), KEY);
  await p.goto('about:blank');
  await p.goto(server.url + '/plus.html#paid');
  await p.waitForSelector('#plus-done:not([hidden])');
  assert.equal(await p.textContent('#plus-key'), KEY);
  await p.goto('about:blank');
  await p.goto(server.url + '/plus.html#unpaid');
  await p.waitForSelector('#plus-retry:not([hidden])');
  assert.match(await p.textContent('#plus-error'), /Nothing was charged/);
  const opts = await p.evaluate(() => window.__rzp || null);
  assert.equal(opts, null, 'no checkout opens by itself after an unpaid return');
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('AT48 Standard Checkout asks Razorpay for redirect mode with our callback, so bank checks never need a popup', async () => {
  const { ctx, p } = await page({ orders: true });
  await p.goto(server.url + '/plus.html#k=' + KEY + '&plan=yearly');
  await p.waitForSelector('#plus-done:not([hidden])');
  const o = await p.evaluate(() => ({ redirect: window.__rzp.redirect, cb: window.__rzp.callback_url }));
  assert.deepEqual(o, { redirect: true, cb: server.url + '/api/plus?action=callback' });
  await ctx.close();
});

test('AT48 when Paddle cannot open its checkout, the page says so and offers Try again instead of waiting forever', async () => {
  const { ctx, p, errors } = await page({ provider: 'paddle' });
  await p.addInitScript(() => { window.__paddleFails = true; });
  await p.goto(server.url + '/plus.html#k=' + KEY + '&plan=monthly');
  await p.waitForSelector('#plus-retry:not([hidden])');
  assert.match(await p.textContent('#plus-error'), /could not open\. Nothing was charged/);
  assert.deepEqual(errors, []);
  await ctx.close();
});
