import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = (d = day(1)) => { const app = makeApp({ now: d, rng: () => 0.99 }); onboard(app); app.B.go('today'); return app; };

test('AT41 exercise length: 1, 2, 3, 5 or 10 minutes, remembered, and used by the session', () => {
  const app = ready();
  app.B.go('play');
  const chips = [...app.document.querySelectorAll('[data-length]')].map((b) => b.textContent);
  assert.deepEqual(chips, ['1 min', '2 min', '3 min', '5 min', '10 min']);
  app.click('[data-length="5"]');
  assert.equal(app.B.state().lengthMin, 5);
  app.click('[data-practice="breeze"]');
  app.click('#checkin-next');
  if (app.B.currentScreen() === 'pick') app.click('#pick-begin');
  for (let i = 0; i < 3; i++) app.B.sessionTick();
  assert.equal(app.B.run().left, 300, 'five minutes once get ready is done');
  assert.equal(app.B.run().rounds, 30);
});

test('AT41 a gentle weekly goal replaces the streak: days you made time this week, against a goal you choose', () => {
  const app = ready(day(3));
  for (const d of [1, 3]) { app.B.setNow(day(d)); app.B.completeSession({ technique: 'breeze', context: 'Busy mind', before: 4, after: 6 }); }
  app.B.go('progress');
  assert.match(app.$('#goal-line').textContent, /2 of 3 days this week/);
  assert.equal(app.document.querySelectorAll('#goal-days .gday.on').length, 2);
  app.click('[data-goal="2"]');
  assert.match(app.$('#goal-line').textContent, /Goal met: 2 of 2 days/);
  assert.equal(app.B.state().weeklyGoal, 2);
  assert.ok(app.document.querySelectorAll('#reflect-list li').length >= 2, 'weekly reflection');
  assert.match(app.$('#reflect-list').textContent, /What helped most: Slow breeze/);
  app.B.go('today');
  assert.doesNotMatch(app.$('#screen-today').textContent, /days? in a row/, 'no streak language on Today');
});

test('AT41 larger text and breathing vibration are settings in Me', () => {
  const app = ready();
  const pulses = [];
  app.window.navigator.vibrate = (p) => { pulses.push(p); return true; };
  app.B.go('me');
  app.click('[data-textsize="larger"]');
  assert.ok(app.document.documentElement.classList.contains('text-larger'));
  app.click('#haptic-toggle');
  assert.equal(app.B.state().hapticBreath, true);
  assert.match(app.$('#haptic-toggle').textContent, /on/);
  pulses.length = 0;
  app.window.LoosenUpMore.onPhase({ detail: { kind: 'in', secs: 4 } });
  assert.ok(Array.isArray(pulses[0]) && pulses[0].length >= 6, 'rising pulses on the breath in');
  app.window.LoosenUpMore.onPhase({ detail: { kind: 'out', secs: 6 } });
  assert.deepEqual([...pulses[1]], [180], 'one long pulse on the breath out');
});
