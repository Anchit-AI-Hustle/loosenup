import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = () => { const app = makeApp({ now: day(1), rng: () => 0.99 }); onboard(app); app.B.go('today'); return app; };

test('AT28 Calm holds breathing exercises, games and sounds as tabs in one screen', () => {
  const app = ready();
  app.click('[data-tab="play"]');
  assert.equal(app.B.currentScreen(), 'play');
  const tabs = [...app.document.querySelectorAll('#screen-play [role="tab"]')].map((t) => t.textContent.trim());
  assert.deepEqual(tabs, ['Breathe', 'Games', 'Sounds']);
  assert.equal(app.visible('#panel-breathe'), true, 'Breathe is open first');
  assert.equal(app.visible('#panel-games'), false);
  app.click('[data-seg="games"]');
  assert.equal(app.visible('#panel-games'), true);
  assert.equal(app.visible('#panel-breathe'), false);
  assert.equal(app.$('#seg-games').getAttribute('aria-selected'), 'true');
  assert.equal(app.$('#screen-play .seg').getAttribute('data-active'), 'games');
  assert.equal(app.document.querySelectorAll('#panel-games [data-game]').length, 3);
  app.click('[data-seg="sounds"]');
  assert.equal(app.visible('#panel-sounds'), true);
  assert.equal(app.document.querySelectorAll('#panel-sounds [data-sound]').length, 4);
  assert.equal(app.$('#tabbar [data-tab="play"]').textContent.trim(), 'Calm');
  app.click('[data-tab="today"]');
  app.click('[data-tab="play"]');
  assert.equal(app.visible('#panel-sounds'), true, 'the last tab is remembered');
});

test('AT28 every exercise has a card; locked ones say when they open', () => {
  const app = ready();
  app.B.go('play');
  const ids = [...app.document.querySelectorAll('#panel-breathe [data-practice]')].map((b) => b.getAttribute('data-practice'));
  assert.deepEqual(ids.sort(), ['breeze', 'cooldown', 'desk', 'here', 'kind', 'letitout', 'pause', 'quick', 'release', 'sigh', 'square', 'warmth']);
  const breath = [...app.document.querySelectorAll('#practice-breath [data-practice]')].map((b) => b.getAttribute('data-practice'));
  assert.deepEqual(breath, ['quick', 'sigh', 'breeze', 'square', 'cooldown']);
  const release = app.$('[data-practice="release"]');
  assert.equal(release.disabled, true);
  assert.match(release.textContent, /Opens in 3 more breaks/);
  assert.match(app.$('[data-practice="quick"]').textContent, /Always free/);
  assert.match(app.$('[data-practice="square"]').textContent, /2 min · Work/);
});

test('AT28 tapping an exercise runs it with before and after ratings, so Calm gain still counts', () => {
  const app = ready();
  app.B.go('play');
  app.click('[data-practice="square"]');
  assert.equal(app.B.currentScreen(), 'checkin', 'asks how calm you feel first');
  app.setValue('#calm-before', 4);
  app.click('#checkin-next');
  assert.equal(app.B.currentScreen(), 'pick');
  assert.equal(app.$('#pick-name').textContent, 'Steady square', 'keeps the exercise you chose');
  assert.match(app.$('#pick-reason').textContent, /picked this one yourself/);
  app.click('#pick-begin');
  assert.equal(app.B.currentScreen(), 'session');
  app.click('#session-finish');
  app.setValue('#calm-after', 7);
  app.click('#after-next');
  const last = app.B.state().sessions.at(-1);
  assert.equal(last.technique, 'square');
  assert.equal(last.gain, 3);
});

test('AT28 Quick breeze from Calm is free, and Back from the check-in returns to Calm', () => {
  const app = ready();
  app.B.go('play');
  app.click('[data-practice="quick"]');
  app.click('#checkin-back');
  assert.equal(app.B.currentScreen(), 'play');
  const seeds = app.B.state().seeds;
  app.click('[data-practice="quick"]');
  app.click('#checkin-next');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.B.state().seeds, seeds, 'Quick breeze never uses a Seed');
});

test('AT28 arrow keys move between the Calm tabs', () => {
  const app = ready();
  app.B.go('play');
  app.B.setSeg('breathe');
  const bar = app.$('#screen-play .seg');
  bar.dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(app.B.calmSeg(), 'games');
  bar.dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(app.B.calmSeg(), 'sounds');
  bar.dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  assert.equal(app.B.calmSeg(), 'games');
});
