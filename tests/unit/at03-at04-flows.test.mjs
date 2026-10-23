import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, runBreak, day } from '../helpers/app.mjs';

test('AT3 first open shows welcome and asks for a first name', () => {
  const app = makeApp({ now: day(1) });
  assert.equal(app.B.currentScreen(), 'welcome');
  assert.ok(app.$('#name-input'), 'name input');
  assert.equal(app.$('#name-input').getAttribute('autocomplete'), 'given-name');
});

test('AT3 after the name, a short how-it-works screen, then straight into the first break (no paywall)', () => {
  const app = makeApp({ now: day(1) });
  app.setValue('#name-input', 'Asha');
  app.click('#welcome-go');
  assert.equal(app.B.currentScreen(), 'gift');
  const s = app.B.state();
  assert.equal(s.name, 'Asha');
  const t = app.$('#screen-gift').textContent;
  assert.match(t, /Notice how you feel/);
  assert.match(t, /See your Calm gain/);
  assert.match(t, /free, always/);
  assert.doesNotMatch(t, /Seed|XP|garden/i, 'no garden or currency language');
  app.click('#gift-go');
  assert.equal(app.B.currentScreen(), 'checkin', 'first break check-in, no paywall');
  assert.equal(app.visible('#shop-sheet'), false, 'shop is not shown');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT3 onboarding happens once, even after a reload', () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  const saved = app.window.localStorage.getItem('loosenup.v1');
  const again = makeApp({ state: JSON.parse(saved), now: day(1) });
  assert.equal(again.B.currentScreen(), 'today');
});

test('AT4 full loop: every break is free, Calm gain is correct, streak 1, plain outcome stats', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.setValue('#calm-before', 3);
  app.click('[data-context="Hard to focus"]');
  app.click('#checkin-next');
  assert.equal(app.B.currentScreen(), 'pick');
  assert.ok(app.$('#pick-name').textContent.trim().length > 0, 'technique picked');
  assert.ok(app.$('#pick-reason').textContent.trim().length > 0, 'reason shown');
  assert.equal(app.$('#pick-begin').textContent.trim(), 'Begin', 'no price on a break');
  app.click('#pick-begin');
  assert.equal(app.B.currentScreen(), 'session');
  app.click('#session-finish');
  assert.equal(app.B.currentScreen(), 'after');
  app.setValue('#calm-after', 8);
  app.click('#after-next');
  assert.equal(app.B.currentScreen(), 'result');
  assert.equal(app.$('#result-gain').textContent.trim(), '+5');
  assert.match(app.$('#result-change').textContent, /From 3 to 8/);
  const s = app.B.state();
  assert.equal(s.streak.count, 1);
  assert.equal(s.sessions.length, 1);
  assert.match(app.$('#result-streak').textContent, /1 of 3 days/);
  assert.match(app.$('#result-week').textContent, /1 break this week/);
  assert.match(app.$('#result-avg').textContent, /\+5 average Calm gain/);
  assert.doesNotMatch(app.$('#screen-result').textContent, /Seed|XP|flower|garden/i);
  assert.ok(app.$('#result-note').textContent.trim().length > 0, 'kind note');
  assert.ok(app.$('#result-sun'), 'rising sun element');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT4 a lower after score is framed kindly', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  runBreak(app, { before: 7, after: 5 });
  assert.equal(app.$('#result-gain').textContent.trim(), '+0');
  assert.match(app.$('#screen-result').textContent, /You showed up/);
});

test('AT4 breaks never run out: twenty breaks in a row all start', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  for (let i = 0; i < 20; i++) {
    runBreak(app, { before: 4, after: 6 });
    assert.equal(app.B.currentScreen(), 'result');
    app.click('#result-done');
    app.click('#start-break');
  }
  assert.equal(app.B.state().sessions.length, 20);
  app.click('#checkin-back');
  app.click('[data-tab="progress"]');
  assert.equal(app.$('#prog-total').textContent, '20');
});
