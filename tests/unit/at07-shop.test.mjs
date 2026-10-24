import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const toPick = (app) => {
  app.setValue('#calm-before', 4);
  app.click('[data-context="Busy mind"]');
  app.click('#checkin-next');
};

test('AT7 every calm break starts straight away on the free plan; there is no per-break charge', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  toPick(app);
  app.click('#pick-begin');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.visible('#shop-sheet'), false);
  assert.equal(app.$('#seed-pill'), null, 'no Seeds counter anywhere');
});

test('AT7 before payments open, LoosenUp Plus shows its prices but cannot be bought, and everything stays free', () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  app.B.openShop();
  const t = app.$('#shop-sheet').textContent.replace(/\s+/g, ' ');
  for (const p of ['₹149', '₹799', 'Every sleep session', 'Every seasonal pack', 'Exam calm']) assert.ok(t.includes(p), p);
  assert.doesNotMatch(t, /DEMO|demo/);
  assert.match(t, /SOS and every helpline stay free/);
  assert.match(app.$('#shop-status').textContent, /opens soon/);
  assert.equal(app.visible('[data-plus-plan="yearly"]'), false);
  assert.equal(app.B.plusRequired(), false, 'nothing is locked while nobody can pay');
});

test('AT7 choosing a plan makes a Plus key on the server and opens the secure checkout page; nothing unlocks until paid', async () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  const calls = [];
  app.window.fetch = async (url, opts) => {
    const body = opts && opts.body ? JSON.parse(opts.body) : {};
    calls.push({ url, body });
    const json = /action=config/.test(url) ? { enabled: true, provider: 'razorpay', currency: 'INR', prices: { monthly: '₹149', yearly: '₹799' } }
      : body.action === 'start' ? { key: 'LU' + 'a'.repeat(32), provider: 'razorpay', plan: body.plan } : { active: false };
    return { ok: true, json: async () => json };
  };
  await app.B.loadPayConfig();
  const opened = [];
  app.B.setOpenUrl((u) => opened.push(u));
  app.B.openShop();
  assert.equal(app.visible('[data-plus-plan="yearly"]'), true);
  await app.B.buyPlus('yearly');
  assert.equal(calls.find((c) => c.body.action === 'start').body.plan, 'yearly');
  assert.equal(opened[0], app.window.location.origin + '/plus.html#k=LU' + 'a'.repeat(32) + '&plan=yearly');
  assert.equal(app.B.state().plus.key, 'LU' + 'a'.repeat(32));
  assert.equal(app.B.isPlus(), false, 'not Plus until the payment is confirmed');
  assert.equal(app.B.plusRequired(), true);
});

test('AT7 an old demo purchase never counts as Plus', () => {
  const app = makeApp({ now: day(1), state: { onboarded: true, name: 'Asha', plan: 'fullbloom', purchases: [{ sku: 'fullbloom', demo: true }] } });
  assert.equal(app.B.state().plan, 'free');
  assert.equal(app.B.isPlus(), false);
});

test('AT7 Breathe now starts a free guided breath from Today without any shop', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.B.go('today');
  app.click('#breathe-now');
  assert.equal(app.B.currentScreen(), 'session');
  app.click('#session-finish');
  app.setValue('#calm-after', 7);
  app.click('#after-next');
  assert.equal(app.B.state().sessions.at(-1).technique, 'quick');
});
