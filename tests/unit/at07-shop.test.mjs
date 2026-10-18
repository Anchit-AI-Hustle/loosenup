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

test('AT7 LoosenUp Plus is a clearly labelled demo subscription in INR and USD, for programmes only', () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  app.B.openShop();
  const t = app.$('#shop-sheet').textContent.replace(/\s+/g, ' ');
  for (const p of ['₹149', 'USD 4.99/mo', '₹799', 'USD 34.99']) assert.ok(t.includes(p), `price ${p}`);
  assert.match(t, /LoosenUp Plus/);
  assert.match(t, /DEMO/);
  assert.match(t, /Every calm break, tool and SOS stays free/);
  assert.doesNotMatch(t, /Seed/);
});

test('AT7 a demo purchase changes the plan only after a clearly labelled confirmation', () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  app.B.openShop();
  app.click('[data-sku="fullbloom"]');
  assert.equal(app.visible('#checkout-sheet'), true);
  assert.match(app.$('#checkout-sheet').textContent, /DEMO/);
  assert.equal(app.B.state().plan, 'free', 'nothing changes before confirm');
  app.click('#checkout-confirm');
  assert.equal(app.B.state().plan, 'fullbloom');
  assert.equal(app.B.state().purchases[0].demo, true);
  app.B.go('me');
  assert.match(app.$('#me-plan').textContent, /LoosenUp Plus/);
});

test('AT7 Quick breeze starts from Today without any shop', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.B.go('today');
  app.click('#quick-breeze');
  app.setValue('#calm-before', 5);
  app.click('[data-context="Just a quick lift"]');
  app.click('#checkin-next');
  assert.equal(app.B.currentScreen(), 'session');
  app.click('#session-finish');
  app.setValue('#calm-after', 7);
  app.click('#after-next');
  assert.equal(app.B.state().sessions.at(-1).technique, 'quick');
});
