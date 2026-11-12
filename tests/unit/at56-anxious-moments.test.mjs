// AT56: help for anxious moments. Breathe before any setup, Ride the wave for sudden panic, a body-first
// pick when calm is very low, "anxious" in check-in, feelings and focus, and a kind next step when a break
// did not help.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = () => { const app = makeApp({ now: day(1, 14), rng: () => 0.42 }); onboard(app); app.B.go('today'); return app; };
const finish = (app, after) => { app.click('#session-finish'); app.setValue('#calm-after', after); app.click('#after-next'); };

test('AT56 someone new can breathe first, before giving a name, and comes back to the welcome', () => {
  const app = makeApp({ now: day(1), rng: () => 0.42 });
  assert.equal(app.B.currentScreen(), 'welcome');
  assert.match(app.$('#welcome-breathe').textContent, /Anxious right now\? Breathe first/);
  app.click('#welcome-breathe');
  assert.equal(app.B.currentScreen(), 'session');
  finish(app, 6);
  assert.equal(app.B.currentScreen(), 'result');
  app.click('#result-done');
  assert.equal(app.B.currentScreen(), 'welcome', 'setup is still waiting, never forced');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT56 Ride the wave: five steps for sudden panic, featured in Calm, in SOS and in a lesson', () => {
  const app = ready();
  const t = app.B.techniques.panic;
  assert.equal(t.name, 'Ride the wave');
  assert.equal(t.steps.length, 5);
  assert.match(t.steps[0], /rises, peaks and passes/);
  app.B.go('play');
  assert.ok(app.$('#practice-breath [data-practice="panic"]').classList.contains('featured'));
  app.B.go('today');
  app.click('#sos-btn');
  app.$('#sos-more').open = true;
  app.click('#sos-panic');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.$('#session-title').textContent, 'Ride the wave');
  app.B.go('learn');
  assert.ok(app.$('[data-lesson="anxious"]'), 'a lesson on what an anxious body is doing');
});

test('AT56 when calm is 3 or lower, the body comes first: a long breath out, not writing', () => {
  const app = ready();
  app.click('#start-break');
  app.setValue('#calm-before', 2);
  app.click('[data-context="Busy mind"]');
  app.click('#checkin-next');
  assert.equal(app.$('#pick-name').textContent, 'Sigh of relief');
  assert.match(app.$('#pick-reason').textContent, /the body comes first/);
  app.B.go('today');
  app.click('#start-break');
  app.setValue('#calm-before', 6);
  app.click('[data-context="Busy mind"]');
  app.click('#checkin-next');
  assert.equal(app.$('#pick-name').textContent, 'Let it out', 'a calmer moment keeps the usual pick');
});

test('AT56 "anxious" is a word you can choose: check-in, feelings and first-open focus', () => {
  const app = ready();
  app.click('#start-break');
  assert.ok(app.$('[data-context="Feeling anxious"]'));
  app.click('[data-context="Feeling anxious"]');
  app.click('#checkin-next');
  assert.equal(app.$('#pick-name').textContent, 'Sigh of relief');
  app.B.go('today');
  assert.match(app.$('[data-emotion="worried"]').textContent, /Anxious/);
  app.B.go('me');
  app.click('#screen-me [data-focus="panic"]');
  app.B.go('today');
  assert.equal(app.B.feelPlan().steps[0][0], 'tech:panic');
});

test('AT56 still feeling it: low calm after a break offers something different and someone to talk to', () => {
  const app = ready();
  app.click('#breathe-now');
  finish(app, 2);
  assert.equal(app.visible('#still-feeling'), true);
  assert.equal(app.$('#still-try').textContent, 'Try Ride the wave');
  app.click('#still-talk');
  assert.equal(app.visible('#support-sheet'), true);
  app.click('#support-close');
  app.click('#still-try');
  assert.equal(app.$('#session-title').textContent, 'Ride the wave');
  finish(app, 3);
  assert.equal(app.$('#still-try').textContent, 'Try Sigh of relief', 'after Ride the wave, something else');
  app.click('#result-done');
  app.click('#breathe-now');
  finish(app, 8);
  assert.equal(app.visible('#still-feeling'), false, 'a calmer finish needs nothing more');
});

test('AT56 Ride the wave and the new words read in Hindi', async () => {
  const app = ready();
  app.B.setLang('hi');
  app.B.startNow('panic');
  await new Promise((r) => setTimeout(r, 0));
  for (const s of app.B.techniques.panic.steps) assert.match(app.window.LoosenUpI18n.tr(s), /^[^A-Za-z]*$/, s);
  assert.equal(app.window.LoosenUpI18n.tr('Anxious right now? Breathe first'), 'अभी घबराहट हो रही है? पहले साँस लें');
});
