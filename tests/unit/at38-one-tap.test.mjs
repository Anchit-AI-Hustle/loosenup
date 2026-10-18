// One-tap calm: Breathe now on Today and in SOS starts a guided breath at once. The before
// rating is one optional tap at the end, and audio settings live inside the session.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day, runBreak } from '../helpers/app.mjs';

const ready = () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.B.go('today');
  return app;
};

test('AT38 Breathe now on Today starts a guided breath in one tap, skipping check-in and Pick', () => {
  const app = ready();
  assert.match(app.$('#breathe-now').textContent, /Breathe now/);
  assert.ok(app.$('#breathe-now').classList.contains('btn-hero'), 'the main action on Today');
  app.click('#breathe-now');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.B.run().id, 'quick');
  assert.equal(app.B.run().ready, 3, 'a short get-ready countdown, then the guide');
  assert.equal(app.B.state().sessions.length, 0, 'nothing to rate before the first breath');
});

test('AT38 Breathe now in SOS starts the same guided breath and closes the sheet', () => {
  const app = ready();
  app.click('#sos-btn');
  assert.match(app.$('#sos-breathe').textContent, /Breathe now/);
  app.click('#sos-breathe');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.visible('#support-sheet'), false);
});

test('AT38 the before rating is one optional tap: without it the break counts but has no Calm gain', () => {
  const app = ready();
  runBreak(app, { before: 4, after: 7 });
  app.click('#result-done');
  app.click('#breathe-now');
  app.click('#session-finish');
  assert.equal(app.B.currentScreen(), 'after');
  assert.equal(app.visible('#before-tap'), true, 'one optional before tap');
  assert.equal(app.$('#after-step').hidden, true, 'no "Step 3 of 3" when there were no steps before');
  assert.equal(app.$('#after-next').textContent.trim(), 'Finish');
  app.setValue('#calm-after', 6);
  app.click('#after-next');
  const s = app.B.state().sessions;
  assert.equal(s.length, 2);
  assert.equal(s[1].gain, null, 'no Calm gain without a before rating');
  assert.equal(s[1].before, null);
  assert.equal(s[1].after, 6);
  assert.equal(app.$('.gain').hidden, true, 'the result shows no gain number');
  assert.match(app.$('#result-change').textContent, /Calm now: 6 out of 10/);
  app.click('[data-tab="progress"]');
  assert.equal(app.$('#prog-total').textContent, '2', 'the break still counts');
  assert.equal(app.$('#prog-avg').textContent, '+3', 'the average only uses rated breaks');
});

test('AT38 tapping a before rating gives a real Calm gain', () => {
  const app = ready();
  app.click('#breathe-now');
  app.click('#session-finish');
  app.click('[data-before="4"]');
  assert.equal(app.$('[data-before="4"]').getAttribute('aria-pressed'), 'true');
  assert.equal(app.$('#after-next').textContent.trim(), 'See my Calm gain');
  app.click('[data-before="4"]');
  assert.equal(app.$('[data-before="4"]').getAttribute('aria-pressed'), 'false', 'a second tap clears it');
  app.click('[data-before="2"]');
  app.setValue('#calm-after', 7);
  app.click('#after-next');
  const last = app.B.state().sessions.at(-1);
  assert.equal(last.before, 2);
  assert.equal(last.gain, 5);
  assert.equal(app.$('#result-gain').textContent, '+5');
  assert.equal(app.$('.gain').hidden, false);
});

test('AT38 Choose a calm break keeps the full check-in, with no before tap at the end', () => {
  const app = ready();
  app.click('#start-break');
  assert.equal(app.B.currentScreen(), 'checkin');
  app.setValue('#calm-before', 3);
  app.click('[data-context="Busy mind"]');
  app.click('#checkin-next');
  assert.equal(app.B.currentScreen(), 'pick');
  assert.equal(app.$('#screen-pick [data-guide], #screen-pick [data-bed]'), null, 'no audio settings before Begin');
  app.click('#pick-begin');
  app.click('#session-finish');
  assert.equal(app.$('#before-tap').hidden, true);
  assert.equal(app.$('#after-step').hidden, false);
});

test('AT38 voice, chimes and background sound live behind a Sound button inside the session', () => {
  const app = ready();
  app.click('#breathe-now');
  const btn = app.$('#session-audio');
  assert.equal(app.$('#session-audio-panel').hidden, true, 'folded until asked');
  assert.equal(btn.getAttribute('aria-expanded'), 'false');
  app.click('#session-audio');
  assert.equal(app.visible('#session-audio-panel'), true);
  assert.equal(btn.getAttribute('aria-expanded'), 'true');
  app.click('#session-audio-panel [data-guide="voice"]');
  app.click('#session-audio-panel [data-guide="chime"]');
  app.click('#session-audio-panel [data-bed="rain"]');
  const st = app.B.state();
  assert.equal(st.voice, true);
  assert.equal(st.chime, false);
  assert.equal(st.bed, 'rain');
  assert.equal(app.$('[data-bed="rain"]').getAttribute('aria-pressed'), 'true');
  app.click('#session-finish');
  app.click('#after-next');
  app.click('#result-done');
  app.click('#breathe-now');
  assert.equal(app.$('#session-audio-panel').hidden, true, 'each session starts with the panel folded');
});

test('AT38 Breathe now and the before tap are in Hindi', () => {
  const app = ready();
  app.B.setLang('hi');
  app.B.go('today');
  assert.equal(app.$('#breathe-now').textContent.trim(), 'अभी साँस लें');
  app.click('#breathe-now');
  assert.equal(app.$('#session-audio').textContent.trim(), 'आवाज़');
  app.click('#session-finish');
  assert.match(app.$('#before-tap-title').textContent, /शुरू करने से पहले/);
  app.click('#after-next');
  assert.match(app.$('#result-change').textContent, /अभी का सुकून/);
});
