// AT47: LoosenUp Plus in the app: what is paid, what stays free, and managing, restoring and cancelling Plus.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const KEY = 'LU' + 'k'.repeat(32);
const OPEN = { payConfig: { enabled: true, provider: 'razorpay', currency: 'INR', prices: { monthly: '₹149', yearly: '₹799' } } };
const PLUS = { plus: { key: KEY, plan: 'yearly', provider: 'razorpay', active: true, until: day(200).toISOString(), cancelAtEnd: false } };
const ready = (extra) => { const app = makeApp({ now: day(1) }); onboard(app); app.B.setState({ ...OPEN, ...extra }); app.B.go('today'); return app; };
function server(app, statusFor) {
  const calls = [];
  app.window.fetch = async (url, opts) => {
    const body = opts && opts.body ? JSON.parse(opts.body) : {};
    calls.push(body);
    const json = /action=config/.test(url) ? OPEN.payConfig : statusFor(body);
    return { ok: !json.error, json: async () => json };
  };
  return calls;
}

test('AT47 without Plus: sleep keeps the body scan free, other sessions and packs open the Plus sheet; breathing, SOS and the journal stay free', () => {
  const app = ready();
  const M = app.window.LoosenUpMore;
  assert.equal(M.sleepStart('scan'), true, 'the body scan is always free');
  M.sleepStop();
  assert.equal(M.sleepStart('nidra'), false);
  assert.equal(app.visible('#shop-sheet'), true);
  assert.match(app.$('#shop-note').textContent, /Every sleep session is part of LoosenUp Plus/);
  app.click('#shop-close');
  app.B.go('sleep');
  assert.equal(app.document.querySelectorAll('[data-sleep] .plus-tag').length, 3);
  app.B.go('packs');
  app.click('[data-pack-item="practice:cooldown"]');
  assert.match(app.$('#shop-note').textContent, /Seasonal packs are part of LoosenUp Plus/);
  app.click('#shop-close');
  app.B.go('today');
  app.click('#breathe-now');
  assert.equal(app.B.currentScreen(), 'session', 'breathing is free');
  app.click('#sos-btn');
  assert.equal(app.visible('#support-sheet'), true, 'SOS is free');
  app.B.go('journal');
  assert.equal(app.B.currentScreen(), 'journal', 'the journal is free');
});

test('AT47 with Plus: every sleep session and pack opens, the tags go, and Me shows the plan and key', () => {
  const app = ready(PLUS);
  assert.equal(app.B.isPlus(), true);
  assert.equal(app.window.LoosenUpMore.sleepStart('nidra'), true);
  app.window.LoosenUpMore.sleepStop();
  app.B.go('sleep');
  assert.equal(app.document.querySelectorAll('[data-sleep] .plus-tag').length, 0);
  app.B.go('packs');
  assert.equal(app.document.querySelectorAll('.pack-card .plus-tag').length, 0);
  app.click('[data-pack-item="lesson:repair"]');
  assert.equal(app.B.currentScreen(), 'lesson');
  app.B.go('me');
  assert.match(app.$('#me-plan').textContent, /LoosenUp Plus: on, renews/);
  assert.equal(app.visible('#open-shop'), false);
  assert.equal(app.$('#plus-key-view').textContent, KEY);
  assert.equal(app.visible('#plus-cancel'), true);
});

test('AT47 Plus ends three days after the paid period unless it renews', () => {
  const app = ready({ plus: { ...PLUS.plus, until: day(1).toISOString() } });
  app.B.setNow(day(3));
  assert.equal(app.B.isPlus(), true, 'grace while a renewal goes through');
  app.B.setNow(day(5));
  assert.equal(app.B.isPlus(), false);
  assert.equal(app.window.LoosenUpMore.sleepStart('train'), false);
});

test('AT47 coming back from checkout turns Plus on as soon as the server confirms the payment', async () => {
  const app = ready({ plus: { key: KEY, plan: 'yearly', provider: 'razorpay', active: false } });
  server(app, () => ({ active: true, plan: 'yearly', provider: 'razorpay', until: day(366).toISOString(), cancelAtEnd: false }));
  assert.equal(app.B.isPlus(), false);
  await app.B.refreshPlus();
  assert.equal(app.B.isPlus(), true);
  assert.match(app.$('#toast').textContent, /LoosenUp Plus is on/);
});

test('AT47 restore Plus on another phone with the key; a wrong key is explained', async () => {
  const app = ready();
  server(app, (b) => (b.key === KEY ? { active: true, plan: 'monthly', provider: 'paddle', until: day(30).toISOString() } : { error: 'That Plus key was not found.' }));
  app.B.go('me');
  app.setValue('#plus-restore-key', 'hello');
  assert.equal(await app.B.restorePlus(), false);
  assert.match(app.$('#plus-status').textContent, /does not look right/);
  app.setValue('#plus-restore-key', 'LU' + 'x'.repeat(32));
  assert.equal(await app.B.restorePlus(), false);
  assert.match(app.$('#plus-status').textContent, /not found/);
  app.setValue('#plus-restore-key', KEY);
  assert.equal(await app.B.restorePlus(), true);
  assert.equal(app.B.state().plus.key, KEY);
  assert.match(app.$('#plus-status').textContent, /restored on this phone/);
  assert.match(app.$('#me-plan').textContent, /LoosenUp Plus/);
});

test('AT47 cancelling asks twice, then keeps Plus on until the end of the period', async () => {
  const app = ready(PLUS);
  const calls = server(app, (b) => (b.action === 'cancel' ? { active: true, plan: 'yearly', provider: 'razorpay', until: PLUS.plus.until, cancelAtEnd: true } : {}));
  app.B.go('me');
  await app.B.cancelPlus();
  assert.equal(calls.filter((c) => c.action === 'cancel').length, 0, 'the first tap only asks');
  assert.match(app.$('#plus-cancel').textContent, /Tap again/);
  await app.B.cancelPlus();
  assert.equal(calls.filter((c) => c.action === 'cancel').length, 1);
  assert.equal(app.B.isPlus(), true);
  assert.match(app.$('#me-plan').textContent, /on until .*then it ends/);
  assert.equal(app.visible('#plus-cancel'), false);
});

test('AT47 the service worker never caches server answers, so Plus status and prices are always live', async () => {
  const { readFileSync } = await import('node:fs');
  const handlers = {};
  const self = { addEventListener: (k, f) => { handlers[k] = f; }, location: { origin: 'https://loosenup.anchit-tandon.com' } };
  const caches = { match: () => Promise.resolve(null), open: () => Promise.resolve({ put() {} }) };
  new Function('self', 'caches', 'fetch', readFileSync(new URL('../../www/sw.js', import.meta.url), 'utf8'))(self, caches, () => Promise.resolve({ ok: true }));
  const answered = (path) => { let r = false; handlers.fetch({ request: { method: 'GET', url: 'https://loosenup.anchit-tandon.com' + path, mode: 'cors' }, respondWith: () => { r = true; } }); return r; };
  assert.equal(answered('/api/plus?action=config'), false);
  assert.equal(answered('/api/push?action=key'), false);
  assert.equal(answered('/styles.css'), true, 'app files still work offline');
});
