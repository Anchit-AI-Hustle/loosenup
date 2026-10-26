// AT53: five more calm games (Colour Sort, Zen Sand, Star Connect, Gentle Stack, Kind Notes). Each one is
// played the way a person would, ends kindly, links to the next game, and fits the feelings it suits.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = (now = day(1)) => { const app = makeApp({ now, rng: () => 0.42 }); onboard(app); app.B.go('today'); return app; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const doneTitle = (app) => app.$('#game-done-title').textContent;

test('AT53 Colour Sort: a stone tapped into another bowl stays in your hand, the right bowl takes it', async () => {
  const app = ready();
  app.B.openGame('sort');
  assert.equal(app.document.querySelectorAll('#sort-tray .stone').length, 12);
  assert.equal(app.document.querySelectorAll('.sort-bowl').length, 3);
  const g = app.B.game();
  const first = g.stones[0].kind;
  app.click('.stone[data-stone="0"]');
  assert.equal(app.$('.stone[data-stone="0"]').getAttribute('aria-pressed'), 'true', 'picked up');
  app.click(`.sort-bowl[data-bowl="${(first + 1) % 3}"]`);
  assert.equal(app.B.game().sorted, 0);
  assert.equal(app.$('.stone[data-stone="0"]').getAttribute('aria-pressed'), 'true', 'still in your hand');
  app.click(`.sort-bowl[data-bowl="${first}"]`);
  assert.equal(app.B.game().sorted, 1);
  assert.equal(app.$('#game-score').textContent, '1 of 12 sorted');
  assert.equal(app.$(`.sort-bowl[data-bowl="${first}"] .bowl-pile`).children.length, 1);
  app.B.game().stones.forEach((s, i) => { if (!s.done) { app.click(`.stone[data-stone="${i}"]`); app.click(`.sort-bowl[data-bowl="${s.kind}"]`); } });
  await wait(500);
  assert.equal(doneTitle(app), 'Everything in its place');
  assert.equal(app.$('#game-bar-fill').style.width, '100%');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT53 Zen Sand: ten slow strokes with the rake, finger or pebble, and short taps do not count', async () => {
  const app = ready();
  app.B.openGame('sand');
  assert.ok(app.$('#sand-canvas'));
  assert.equal(app.B.sandStroke([{ x: 10, y: 10 }, { x: 14, y: 12 }]), false, 'a tiny scribble is not a line');
  const line = (y) => [{ x: 40, y }, { x: 200, y: y + 10 }, { x: 380, y }];
  for (let i = 0; i < 4; i++) app.B.sandStroke(line(40 + i * 30));
  app.click('[data-sand-tool="line"]');
  assert.equal(app.$('[data-sand-tool="line"]').getAttribute('aria-pressed'), 'true');
  for (let i = 0; i < 3; i++) app.B.sandStroke(line(200 + i * 30));
  app.click('[data-sand-tool="stone"]');
  assert.equal(app.$('#game-score').textContent, '7 of 10 lines');
  for (let i = 0; i < 3; i++) app.B.sandStroke([{ x: 100 + i * 120, y: 380 }]);
  app.click('#sand-smooth');
  await wait(800);
  assert.equal(doneTitle(app), 'Smooth and still');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT53 Star Connect: only the glowing star joins, and each picture is named when it is complete', async () => {
  const app = ready();
  app.B.openGame('stars');
  const sky = app.B.skies[0];
  const next = () => app.$('#stars-sky .star.next');
  assert.equal(+next().getAttribute('data-star'), sky.order[0]);
  const other = [...app.document.querySelectorAll('#stars-sky .star')].find((s) => +s.getAttribute('data-star') !== sky.order[0]);
  app.click(other);
  assert.equal(app.B.game().step, 0, 'another star just points you to the glowing one');
  sky.order.forEach((j, n) => { app.click(next()); assert.equal(app.B.game().step, n + 1); void j; });
  assert.equal(app.document.querySelectorAll('#stars-lines line').length, sky.order.length - 1);
  assert.equal(app.$('#stars-name').textContent, 'The Kite');
  await wait(1600);
  assert.equal(app.$('#game-score').textContent, 'Sky 2 of 3');
  app.B.finishCurrentGame();
  assert.equal(doneTitle(app), 'Your sky is full');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT53 Gentle Stack: every block lands, even one set down far off the tower', async () => {
  const app = ready();
  app.B.openGame('stack');
  const g = app.B.game();
  g.moving.x = 100 - g.moving.w; // as far from the tower as it can be
  app.click('#stack-drop');
  const b = app.B.game().blocks;
  assert.equal(b.length, 2);
  assert.ok(b[1].w >= 26, 'it lands at the smallest size');
  assert.ok(b[1].x >= b[0].x && b[1].x + b[1].w <= b[0].x + b[0].w, 'and sits on the block below');
  const g2 = app.B.game();
  g2.moving.x = g2.blocks[g2.blocks.length - 1].x;
  app.click('#stack-drop');
  assert.equal(app.B.game().just, 1, 'a well-placed block is just right');
  for (let i = 0; i < 10; i++) app.click('#stack-drop');
  assert.equal(app.$('#game-score').textContent, '12 of 12 blocks');
  await wait(600);
  assert.equal(doneTitle(app), 'A steady tower');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT53 Kind Notes: three kind words make a note, and it can be kept in the jar', async () => {
  const app = ready();
  app.B.openGame('kind');
  const words = [...app.document.querySelectorAll('#kind-cloud .kind-word')];
  assert.equal(words.length, 6);
  app.click('#kind-other');
  const fresh = [...app.document.querySelectorAll('#kind-cloud .kind-word')].map((w) => w.textContent);
  assert.equal(fresh.length, 6);
  const picked = [];
  for (let i = 0; i < 3; i++) { const w = app.document.querySelectorAll('#kind-cloud .kind-word:not([disabled])')[0]; picked.push(w.textContent); app.click(w); }
  assert.deepEqual([...app.document.querySelectorAll('#kind-lines .kind-line')].map((l) => l.textContent), picked);
  await wait(700);
  assert.equal(doneTitle(app), 'A kind note, from you');
  assert.equal(app.visible('#game-keep'), true);
  const before = app.B.state().goodThings.length;
  app.click('#game-keep');
  const jar = app.B.state().goodThings;
  assert.equal(jar.length, before + 1);
  assert.equal(jar[jar.length - 1].text, picked.join(' '));
  assert.equal(app.visible('#game-keep'), false, 'kept once');
  app.B.openGame('pairs');
  assert.equal(app.visible('#game-keep'), false, 'only Kind Notes offers the jar');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT53 after a game: one tap into another that suits the feeling, and See all opens every game', async () => {
  const app = ready();
  app.click('[data-emotion="overwhelmed"]');
  app.B.openGame('sort');
  app.B.finishCurrentGame();
  await wait(500);
  const nx = app.$('#game-next-game');
  assert.equal(app.visible('#game-next-game'), true);
  const id = nx.getAttribute('data-game') || nx.getAttribute('data-more');
  assert.notEqual(id, 'sort');
  assert.ok(!['catch', 'stack'].includes(id), 'never a game that works against feeling overwhelmed');
  assert.match(nx.textContent, /^Try /);
  app.click(nx);
  assert.equal(app.B.currentScreen(), id === 'trace' ? 'trace' : 'game');
  app.B.go('today');
  app.click('#games-all');
  assert.equal(app.B.currentScreen(), 'play');
  assert.equal(app.visible('#panel-games'), true);
  assert.equal(app.document.querySelectorAll('#panel-games .game-card').length, 10);
});

test('AT53 feelings: the new games show where they help and stay away where they do not', () => {
  const app = ready(new Date('2026-10-20T11:00:00'));
  const shown = () => [...app.document.querySelectorAll('#screen-today .game-tile:not([hidden])')].map((b) => b.getAttribute('data-game') || b.getAttribute('data-more'));
  app.click('[data-emotion="harsh"]');
  assert.equal(shown()[0], 'kind', 'kind words first when you are hard on yourself');
  app.click('#for-you-alt');
  assert.ok(app.B.feelPlan().steps.some((s) => s[0] === 'game:kind'));
  const fresh = ready(new Date('2026-10-20T11:00:00'));
  fresh.click('[data-emotion="overwhelmed"]');
  assert.ok(fresh.B.feelPlan().steps.some((s) => s[0] === 'game:sort'), 'sorting stones when there is too much');
  const g = [...fresh.document.querySelectorAll('#screen-today .game-tile:not([hidden])')].map((b) => b.getAttribute('data-game') || b.getAttribute('data-more'));
  assert.ok(!g.includes('stack') && !g.includes('catch'));
  for (const id of ['sort', 'sand', 'stars', 'stack', 'kind']) assert.ok(app.B.stepInfo('game:' + id), id + ' can be a plan step');
});

test('AT53 every new game reads fully in Hindi', async () => {
  const app = ready();
  app.B.setLang('hi');
  for (const id of ['sort', 'sand', 'stars', 'stack', 'kind']) {
    app.B.openGame(id);
    await wait(0);
    assert.doesNotMatch(app.$('#game-help').textContent, /[A-Za-z]{3,}/, id + ' hint');
    assert.doesNotMatch(app.$('#game-score').textContent, /[A-Za-z]{3,}/, id + ' score');
  }
  app.B.openGame('kind');
  await wait(0);
  assert.doesNotMatch(app.$('#kind-cloud').textContent, /[A-Za-z]{3,}/, 'kind words in Hindi');
});
