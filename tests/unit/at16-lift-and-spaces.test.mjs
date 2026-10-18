import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, runBreak, day } from '../helpers/app.mjs';

const ready = (now = day(1)) => {
  const app = makeApp({ now, rng: () => 0.99 });
  onboard(app);
  app.B.go('today');
  return app;
};

test('AT16 mood check-in saves one mood per day', () => {
  const app = ready();
  assert.equal(app.visible('#mood-card'), true);
  app.click('[data-mood="4"]');
  app.click('[data-mood="5"]');
  const s = app.B.state();
  assert.deepEqual(JSON.parse(JSON.stringify(s.moods)), [{ day: '2026-10-05', mood: 5 }]);
  assert.match(app.$("#mood-done").textContent, /Happy today/);
});

test('AT16 mood trend appears on Progress with a kind insight', () => {
  const app = ready(day(5));
  app.B.setState({ moods: [
    { day: '2026-10-05', mood: 2 }, { day: '2026-10-06', mood: 2 }, { day: '2026-10-07', mood: 3 },
    { day: '2026-10-08', mood: 4 }, { day: '2026-10-09', mood: 4 },
  ] });
  app.click('[data-tab="progress"]');
  assert.equal(app.document.querySelectorAll('#week-chart .mood-dot').length, 5);
  assert.match(app.$('#insight-mood').textContent, /lighter/);
});

test('AT16 Small steps: each completed step is counted, with a fresh idea each time', () => {
  const app = ready();
  assert.ok(app.$('#step-idea').textContent.length > 5);
  const first = app.$('#step-idea').textContent;
  app.click('#step-another');
  assert.notEqual(app.$('#step-idea').textContent, first, 'another idea');
  for (let i = 0; i < 4; i++) app.click('#step-done');
  assert.equal(app.B.state().smallSteps.length, 4);
  assert.match(app.$('#steps-note').textContent, /4 small steps today/);
});

test('AT16 Good things jar saves only when asked and resurfaces on heavy days', () => {
  const app = ready();
  app.click('#jar-add');
  app.setValue('#good-text', 'Chai with Amma on the balcony');
  app.click('#good-close');
  assert.equal(app.B.state().goodThings.length, 0, 'closing does not save');
  app.click('#jar-add');
  app.setValue('#good-text', 'Chai with Amma on the balcony');
  app.click('#good-save');
  assert.equal(app.B.state().goodThings.length, 1);
  assert.match(app.$('#jar-count').textContent, /1 good thing/);
  app.click('[data-mood="2"]');
  assert.match(app.$('#jar-memory').textContent, /Chai with Amma/);
});

test('AT16 Kind words is a guided break recommended for low days', () => {
  const app = ready();
  assert.equal(app.B.recommend('Feeling low').id, 'kind');
  assert.equal(app.B.recommend('Hard on myself').id, 'kind');
  assert.equal(app.B.techniques.kind.name, 'Kind words');
  assert.equal(app.B.techniques.kind.kind, 'steps');
});

test('AT17 Work space: contexts and breaks for the workday', () => {
  const app = ready();
  app.click('[data-space="work"]');
  assert.equal(app.B.currentScreen(), 'checkin');
  const chips = [...app.document.querySelectorAll('#context-chips .context-group:not([hidden]) [data-context]')].map((c) => c.getAttribute('data-context'));
  assert.deepEqual(chips, ['Work pile-up', 'Before a meeting', 'After a tough call', 'Hard to switch off']);
  assert.equal(app.B.recommend('Work pile-up').id, 'square');
  assert.equal(app.B.recommend('After a tough call').id, 'desk');
  app.click('[data-context="Work pile-up"]');
  app.click('#checkin-next');
  const picks = [...app.document.querySelectorAll('[data-pick]')].map((c) => c.getAttribute('data-pick'));
  assert.ok(picks.includes('desk') && picks.includes('square'), 'work breaks offered');
  app.click('#pick-begin');
  assert.equal(app.B.currentScreen(), 'session');
  assert.match(app.$('#cue').textContent, /Get ready/);
  for (let i = 0; i < 3; i++) app.B.sessionTick();
  assert.match(app.$('#cue').textContent, /Breathe in/);
});

test('AT17 Relationships space: pause, cool down and warm wishes', () => {
  const app = ready();
  app.click('[data-space="relationships"]');
  const chips = [...app.document.querySelectorAll('#context-chips .context-group:not([hidden]) [data-context]')].map((c) => c.getAttribute('data-context'));
  assert.deepEqual(chips, ['Tense with someone', 'After a disagreement', 'Before a hard talk', 'Feeling disconnected']);
  assert.equal(app.B.recommend('Tense with someone').id, 'pause');
  assert.equal(app.B.recommend('After a disagreement').id, 'cooldown');
  assert.equal(app.B.recommend('Feeling disconnected').id, 'warmth');
  // Every space has a tab; switching tabs shows that space's feelings.
  assert.equal(app.document.querySelectorAll('[data-space-tab]').length, 5);
  assert.ok(app.document.querySelectorAll('[data-context]').length >= 18, 'all feelings stay pickable');
  app.click('[data-space-tab="lowdays"]');
  const shown = [...app.document.querySelectorAll('#context-chips .context-group:not([hidden]) [data-context]')].map((c) => c.getAttribute('data-context'));
  assert.deepEqual(shown, ['Feeling low', 'Low energy', 'Hard on myself']);
});

test('AT17 a full Relationships break completes and counts toward the garden', () => {
  const app = ready();
  app.click('[data-space="relationships"]');
  runBreak(app, { before: 3, after: 6, context: 'After a disagreement' });
  assert.equal(app.B.currentScreen(), 'result');
  assert.equal(app.$('#result-gain').textContent, '+3');
  assert.equal(app.B.state().sessions.at(-1).technique, 'cooldown');
});

test('AT17 Low days and Sleep spaces exist with their own feelings', () => {
  const app = ready();
  app.click('[data-space="lowdays"]');
  let chips = [...app.document.querySelectorAll('#context-chips .context-group:not([hidden]) [data-context]')].map((c) => c.getAttribute('data-context'));
  assert.deepEqual(chips, ['Feeling low', 'Low energy', 'Hard on myself']);
  app.B.go('today');
  app.click('[data-space="sleep"]');
  chips = [...app.document.querySelectorAll('#context-chips .context-group:not([hidden]) [data-context]')].map((c) => c.getAttribute('data-context'));
  assert.deepEqual(chips, ['Winding down', 'Mind racing at night']);
});
