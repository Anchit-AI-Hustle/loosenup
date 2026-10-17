import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app); // lands on the check-in screen
  return app;
};
const pressed = (app) => [...app.document.querySelectorAll('[data-context][aria-pressed="true"]')].map((c) => c.getAttribute('data-context'));

test('AT20 several feelings can be picked at once, and tapping again unpicks', () => {
  const app = ready();
  assert.match(app.$('#context-hint').textContent, /Pick all that apply/);
  app.click('[data-context="Work pile-up"]');
  app.click('[data-context="Tight shoulders"]');
  app.click('[data-context="Feeling low"]');
  assert.deepEqual(pressed(app), ['Tight shoulders', 'Work pile-up', 'Feeling low']);
  assert.match(app.$('#context-count').textContent, /3 picked/);
  const tray = [...app.document.querySelectorAll('[data-unpick]')].map((b) => b.getAttribute('data-unpick'));
  assert.deepEqual(tray, ['Work pile-up', 'Tight shoulders', 'Feeling low'], 'picked tray lists choices in order');
  assert.match(app.$('[data-space-tab="work"]').textContent, /Work \u00b7 1/);
  app.click('[data-unpick="Feeling low"]');
  assert.equal(app.$('[data-context="Feeling low"]').getAttribute('aria-pressed'), 'false', 'tray chip unpicks');
  app.click('[data-context="Feeling low"]');
  app.click('[data-context="Tight shoulders"]');
  assert.deepEqual(pressed(app), ['Work pile-up', 'Feeling low']);
});

test('AT20 the recommendation weighs every picked feeling', () => {
  const app = ready();
  const r = app.B.recommendFor(['Big moment ahead', 'Just a quick lift', 'Hard to focus']);
  assert.equal(r.id, 'sigh', 'two of three feelings point to Sigh of relief');
  assert.match(r.reason, /Picked for Big moment ahead, Just a quick lift and Hard to focus/);
  assert.equal(app.B.recommendFor(['Hard to focus']).id, app.B.recommend('Hard to focus').id, 'one feeling behaves as before');
});

test('AT20 picks from every space are offered when feelings span spaces', () => {
  const app = ready();
  app.click('[data-context="Work pile-up"]');
  app.click('[data-context="After a disagreement"]');
  app.click('#checkin-next');
  const picks = [...app.document.querySelectorAll('[data-pick]')].map((c) => c.getAttribute('data-pick'));
  assert.ok(picks.includes('desk') && picks.includes('square'), 'work breaks');
  assert.ok(picks.includes('pause') && picks.includes('cooldown'), 'relationship breaks');
});

test('AT20 a break remembers every feeling and learning counts it for each', () => {
  const app = ready();
  app.setValue('#calm-before', 3);
  app.click('[data-context="Work pile-up"]');
  app.click('[data-context="Tight shoulders"]');
  app.click('#checkin-next');
  app.click('#pick-begin');
  app.click('#session-finish');
  app.setValue('#calm-after', 7);
  app.click('#after-next');
  const s = app.B.state().sessions.at(-1);
  assert.equal(s.context, 'Work pile-up');
  assert.deepEqual(JSON.parse(JSON.stringify(s.contexts)), ['Work pile-up', 'Tight shoulders']);
  app.click('#result-done');
  assert.match(app.$('#today-recent').textContent, /Work pile-up \+ Tight shoulders/);
});
