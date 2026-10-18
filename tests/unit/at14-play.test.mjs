import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = () => {
  const app = makeApp({ now: day(1), rng: () => 0.42 });
  onboard(app);
  app.B.go('today');
  return app;
};

const solvePairs = (app) => {
  const deck = app.B.game().deck;
  const byKind = {};
  deck.forEach((c, i) => (byKind[c.kind] = byKind[c.kind] || []).push(i));
  Object.values(byKind).forEach(([a, b]) => { app.click(`[data-card="${a}"]`); app.click(`[data-card="${b}"]`); });
};

test('AT14 Play tab lists three calm games', () => {
  const app = ready();
  app.click('[data-tab="play"]');
  assert.equal(app.B.currentScreen(), 'play');
  const names = [...app.document.querySelectorAll('[data-game]')].map((b) => b.textContent);
  assert.equal(names.length, 3);
  assert.match(names.join(' '), /Calm Pairs/);
  assert.match(names.join(' '), /Sunbeam Catch/);
  assert.match(names.join(' '), /Breathing Ring/);
});

test('AT14 Calm Pairs: 12 cards, matching all pairs finishes kindly and grants game XP', () => {
  const app = ready();
  app.click('[data-tab="play"]');
  app.click('[data-game="pairs"]');
  assert.equal(app.B.currentScreen(), 'game');
  assert.equal(app.document.querySelectorAll('.pcard').length, 12);
  assert.equal(app.visible('#tabbar'), false);
  solvePairs(app);
  assert.equal(app.visible('#game-done'), true);
  assert.match(app.$('#game-done-title').textContent, /All pairs matched/);
  assert.match(app.$('#game-done-text').textContent, /6 pairs in 6 moves/);
  const s = app.B.state();
  assert.ok(s.badges.includes('playful'));
  assert.equal(s.gameBest.pairs, 6);
});

test('AT14 a mismatched pair turns back over without any penalty', async () => {
  const app = ready();
  app.click('[data-tab="play"]');
  app.click('[data-game="pairs"]');
  const deck = app.B.game().deck;
  const a = 0;
  const b = deck.findIndex((c, i) => i > 0 && c.kind !== deck[0].kind);
  app.click(`[data-card="${a}"]`);
  app.click(`[data-card="${b}"]`);
  assert.equal(app.$(`[data-card="${a}"]`).getAttribute('data-open'), 'true');
  await new Promise((r) => setTimeout(r, 1000));
  assert.equal(app.$(`[data-card="${a}"]`).getAttribute('data-open'), 'false');
  assert.equal(app.$('#game-score').textContent, '0 of 6 pairs');
});

test('AT14 games can be played as often as you like, with a kind ending every time', () => {
  const app = ready();
  for (let i = 0; i < 4; i++) {
    app.B.openGame('pairs');
    solvePairs(app);
    assert.equal(app.visible('#game-done'), true);
  }
  assert.doesNotMatch(app.$('#game-done-text').textContent, /XP|garden/);
  app.click('#game-back');
  assert.match(app.$('#play-note').textContent, /nothing to rush/);
});

test('AT14 Sunbeam Catch: tapping a sunbeam fills the jar', () => {
  const app = ready();
  app.B.openGame('catch');
  const beam = app.B.spawnBeam();
  assert.ok(beam, 'a sunbeam appears');
  beam.dispatchEvent(new app.window.MouseEvent('click', { bubbles: true }));
  assert.equal(app.B.game().caught, 1);
  assert.match(app.$('#game-score').textContent, /1 sunbeam/);
  app.B.finishCurrentGame();
  assert.match(app.$('#game-done-text').textContent, /You caught 1 sunbeam/);
  app.click('#game-back');
  assert.equal(app.B.game(), null, 'timers stop when leaving');
});

test('AT14 Breathing Ring: holding starts the breath guide and finishing blooms kindly', () => {
  const app = ready();
  app.B.openGame('bloom');
  const hold = app.$('#bloom-hold');
  hold.dispatchEvent(new app.window.KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  assert.equal(hold.getAttribute('aria-pressed'), 'true');
  assert.equal(app.$('#bloom-cue').textContent, 'Breathe in');
  hold.dispatchEvent(new app.window.KeyboardEvent('keyup', { key: ' ', bubbles: true }));
  assert.equal(hold.getAttribute('aria-pressed'), 'false');
  app.B.finishCurrentGame();
  assert.match(app.$('#game-done-title').textContent, /Six slow breaths/);
  assert.match(app.$('#game-done-text').textContent, /Every breath counted/);
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});
