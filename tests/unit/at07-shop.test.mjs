import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const toPick = (app) => {
  app.setValue('#calm-before', 4);
  app.click('[data-context="Busy mind"]');
  app.click('#checkin-next');
};

test('AT7 zero Seeds on the free plan opens the Seed shop instead of a guided break', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.B.setState({ seeds: 0 });
  toPick(app);
  app.click('#pick-begin');
  assert.notEqual(app.B.currentScreen(), 'session');
  assert.equal(app.visible('#shop-sheet'), true, 'shop open');
  assert.match(app.$('#shop-sheet').textContent, /DEMO/);
  assert.match(app.$('#shop-sheet').textContent, /nothing is charged/i);
  assert.equal(app.B.state().seeds, 0);
});

test('AT7 shop lists Full Bloom and Seed packs in INR and USD', () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  app.B.openShop();
  const t = app.$('#shop-sheet').textContent.replace(/\s+/g, ' ');
  for (const p of ['₹299', 'USD 6.99', '₹99', 'USD 1.99', '₹249', 'USD 4.99', '₹699', 'USD 12.99']) {
    assert.ok(t.includes(p), `price ${p}`);
  }
  for (const n of ['10 Seeds', '30 Seeds', '100 Seeds', 'Full Bloom']) assert.ok(t.includes(n), n);
});

test('AT7 demo purchase adds Seeds after a clearly labelled demo confirmation', () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  app.B.setState({ seeds: 0 });
  app.B.openShop();
  app.click('[data-sku="seeds30"]');
  assert.equal(app.visible('#checkout-sheet'), true);
  assert.match(app.$('#checkout-sheet').textContent, /DEMO/);
  assert.equal(app.B.state().seeds, 0, 'nothing added before confirm');
  app.click('#checkout-confirm');
  assert.equal(app.B.state().seeds, 30);
  assert.equal(app.B.state().purchases.length, 1);
  assert.equal(app.B.state().purchases[0].demo, true);
});

test('AT7 Full Bloom guided breaks do not consume Seeds', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.B.openShop();
  app.click('[data-sku="fullbloom"]');
  app.click('#checkout-confirm');
  assert.equal(app.B.state().plan, 'fullbloom');
  app.B.setState({ seeds: 0 });
  app.click('#shop-close');
  app.B.go('checkin');
  toPick(app);
  assert.match(app.$('#pick-begin').textContent, /Full Bloom/);
  app.click('#pick-begin');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.B.state().seeds, 0);
});

test('AT7 Quick breeze is always free, even at zero Seeds', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.B.setState({ seeds: 0 });
  app.B.go('today');
  app.click('#quick-breeze');
  // Quick breeze still asks for the before score, then starts without the shop.
  app.setValue('#calm-before', 5);
  app.click('[data-context="Just a quick lift"]');
  app.click('#checkin-next');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.visible('#shop-sheet'), false);
  assert.equal(app.B.state().seeds, 0);
  app.click('#session-finish');
  app.setValue('#calm-after', 7);
  app.click('#after-next');
  assert.equal(app.B.state().sessions.at(-1).technique, 'quick');
  assert.equal(app.B.state().seeds, 0);
});
