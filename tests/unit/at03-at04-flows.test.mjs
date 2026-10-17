import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, runBreak, day } from '../helpers/app.mjs';

test('AT3 first open shows welcome and asks for a first name', () => {
  const app = makeApp({ now: day(1) });
  assert.equal(app.B.currentScreen(), 'welcome');
  assert.ok(app.$('#name-input'), 'name input');
  assert.equal(app.$('#name-input').getAttribute('autocomplete'), 'given-name');
});

test('AT3 gift grants 5 Seeds and 25 XP, Seedling bar at 50 percent, then straight into the first break', () => {
  const app = makeApp({ now: day(1) });
  app.setValue('#name-input', 'Asha');
  app.click('#welcome-go');
  assert.equal(app.B.currentScreen(), 'gift');
  const s = app.B.state();
  assert.equal(s.name, 'Asha');
  assert.equal(s.seeds, 5);
  assert.equal(s.xp, 25);
  assert.match(app.$('#screen-gift').textContent, /5 Seeds/);
  assert.match(app.$('#screen-gift').textContent, /25 XP/);
  const lvl = app.B.level();
  assert.equal(lvl.name, 'Seedling');
  assert.equal(lvl.percent, 50);
  assert.equal(app.$('#gift-level-fill').style.width, '50%');
  app.click('#gift-go');
  assert.equal(app.B.currentScreen(), 'checkin', 'first break check-in, no paywall');
  assert.equal(app.visible('#shop-sheet'), false, 'shop is not shown');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT3 gift is only granted once, even after a reload', () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  const saved = app.window.localStorage.getItem('loosenup.v1');
  const again = makeApp({ state: JSON.parse(saved), now: day(1) });
  assert.equal(again.B.state().seeds, 5);
  assert.equal(again.B.currentScreen(), 'today');
});

test('AT4 full loop: Seed decrements, Calm gain is correct, streak 1, XP 45', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.setValue('#calm-before', 3);
  app.click('[data-context="Hard to focus"]');
  app.click('#checkin-next');
  assert.equal(app.B.currentScreen(), 'pick');
  assert.ok(app.$('#pick-name').textContent.trim().length > 0, 'technique picked');
  assert.ok(app.$('#pick-reason').textContent.trim().length > 0, 'reason shown');
  app.click('#pick-begin');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.B.state().seeds, 4, 'one Seed used on start');
  app.click('#session-finish');
  assert.equal(app.B.currentScreen(), 'after');
  app.setValue('#calm-after', 8);
  app.click('#after-next');
  assert.equal(app.B.currentScreen(), 'result');
  assert.equal(app.$('#result-gain').textContent.trim(), '+5');
  const s = app.B.state();
  assert.equal(s.streak.count, 1);
  assert.equal(s.xp, 45, 'XP = 25 gift + 10 + 2 x 5');
  assert.equal(s.seeds, 4);
  assert.equal(s.sessions.length, 1);
  assert.match(app.$('#result-seeds').textContent, /4/);
  assert.match(app.$('#result-streak').textContent, /1/);
  assert.match(app.$('#result-level').textContent, /90%/);
  assert.match(app.$('#result-garden').textContent, /\+1 flower/);
  assert.ok(app.$('#result-note').textContent.trim().length > 0, 'kind note');
  assert.ok(app.$('#result-sun'), 'rising sun element');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT4 a lower after score is framed positively and earns a Seed', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  runBreak(app, { before: 7, after: 5 });
  assert.equal(app.$('#result-gain').textContent.trim(), '+0');
  assert.match(app.$('#screen-result').textContent, /You showed up/);
  const s = app.B.state();
  assert.equal(s.seeds, 5, '5 - 1 used + 1 showed-up Seed');
  assert.equal(s.xp, 35, 'XP = 25 + 10 + 0');
});

test('AT4 the garden grows by one flower per break and never shrinks', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  runBreak(app, { before: 4, after: 6 });
  app.click('#result-done');
  app.click('#start-break');
  runBreak(app, { before: 6, after: 4 });
  app.click('#result-done');
  app.click('[data-tab="garden"]');
  assert.equal(app.document.querySelectorAll('#garden-svg .flower').length, 2);
});
