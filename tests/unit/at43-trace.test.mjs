import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

test('AT43 Trace the square: the dot follows box breathing, four seconds a side, and is one tap from Today and Calm', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.B.go('today');
  assert.ok(app.$('#screen-today .game-row [data-more="trace"]'));
  assert.ok(app.$('#panel-games [data-more="trace"]'));
  const M = app.window.LoosenUpMore;
  assert.deepEqual({ ...M.dotAt(0) }, { x: 30, y: 190, side: 0 });
  assert.deepEqual({ ...M.dotAt(2) }, { x: 30, y: 110, side: 0 }, 'halfway up the first side after 2 seconds');
  assert.equal(M.dotAt(4).side, 1, 'hold across the top');
  assert.equal(M.dotAt(8).side, 2, 'breathe out down the side');
  assert.equal(M.dotAt(12).side, 3, 'rest along the bottom');
  app.click('#screen-today [data-more="trace"]');
  assert.equal(app.B.currentScreen(), 'trace');
  app.click('#trace-start');
  assert.equal(app.$('#trace-phase').textContent, 'Breathe in');
  const pct = M.traceEnd();
  assert.equal(typeof pct, 'number');
  assert.match(app.$('#trace-score').textContent, /You stayed with the dot \d+% of the time/);
});
