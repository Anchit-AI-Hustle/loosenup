// AT55: eight more calm games, six more exercises, Today's game with a streak, the game shelf,
// and extra designs in three games that LoosenUp Plus opens (two of each are always free).
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = (now = day(1), state) => { const app = makeApp({ now, rng: () => 0.42, state }); onboard(app); app.B.go('today'); return app; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const doneTitle = (app) => app.$('#game-done-title').textContent;
const PAY_ON = { payConfig: { enabled: true, provider: 'razorpay', currency: 'INR', prices: { monthly: '₹149', yearly: '₹799' } } };

test('AT55 Rangoli Colours: pick a colour, tap each ring, and the rangoli is ready', async () => {
  const app = ready();
  app.B.openGame('rangoli');
  const rings = app.document.querySelectorAll('#rangoli-art .rangoli-ring');
  assert.ok(rings.length >= 4);
  app.click('.rangoli-palette [data-colour="3"]');
  assert.equal(app.$('.rangoli-palette [data-colour="3"]').getAttribute('aria-pressed'), 'true');
  app.B.colourRing(0);
  assert.equal(app.$('#rangoli-art [data-ring="0"]').style.fill, 'rgb(79, 166, 124)');
  app.B.colourRing(0);
  assert.match(app.$('#game-score').textContent, /^1 of \d+ rings$/, 'colouring a ring again changes it, not the count');
  for (let i = 1; i < rings.length; i++) app.B.colourRing(i);
  await wait(800);
  assert.equal(doneTitle(app), 'Your rangoli is ready');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT55 Picture Tiles: swap tiles until the picture is whole; Peek shows it for a moment', async () => {
  const app = ready();
  app.B.openGame('tiles');
  assert.equal(app.document.querySelectorAll('#tiles-grid .tile').length, 9);
  const g = app.B.game();
  assert.ok(g.order.filter((p, i) => p !== i).length >= 6, 'starts well mixed');
  app.B.peekTiles();
  assert.ok(app.$('.tiles-peek-pic'));
  for (let i = 0; i < 9; i++) {
    if (g.order[i] === i) continue;
    app.click(`#tiles-grid [data-tile="${i}"]`);
    assert.equal(app.$(`#tiles-grid [data-tile="${i}"]`).getAttribute('aria-pressed'), 'true');
    app.click(`#tiles-grid [data-tile="${g.order.indexOf(i)}"]`);
  }
  assert.equal(app.$('#game-score').textContent, '9 of 9 in place');
  await wait(700);
  assert.equal(doneTitle(app), 'The picture is whole');
  assert.match(app.$('#game-done-text').textContent, /swaps?/);
});

test('AT55 Wind Chimes: tap the tune back; a slip plays it again, and each round adds a note', async () => {
  const app = ready();
  app.B.openGame('chimes');
  const tune = app.B.game().tune;
  assert.equal(app.document.querySelectorAll('#chimes .chime').length, 5);
  app.B.tapChime((tune[0] + 1) % 5);
  assert.equal(app.$('#chimes-say').textContent, 'Close. Listen once more.');
  assert.equal(app.B.game().round, 0, 'nothing is taken away');
  for (const n of [3, 4, 5]) { for (let k = 0; k < n; k++) app.B.tapChime(tune[k]); }
  await wait(1000);
  assert.equal(doneTitle(app), 'A tune of your own');
});

test('AT55 Spot the Odd One: other shapes just fade; eight rounds of finding the one', async () => {
  const app = ready();
  app.B.openGame('spot');
  assert.equal(app.document.querySelectorAll('#spot-grid .spot').length, 9);
  const other = (app.B.game().odd + 1) % 9;
  assert.equal(app.B.tapSpot(other), false);
  assert.ok(app.$(`#spot-grid [data-spot="${other}"]`).classList.contains('faded'));
  for (let r = 0; r < 8; r++) { app.B.tapSpot(app.B.game().odd); await wait(600); }
  assert.equal(doneTitle(app), 'Well spotted');
});

test('AT55 Calm Count: numbers in order, a different number just wobbles, and the time is kept', async () => {
  const app = ready();
  app.B.openGame('count');
  assert.equal(app.document.querySelectorAll('#count-grid .count-num').length, 16);
  assert.equal(app.$('#game-score').textContent, 'Find 1');
  assert.equal(app.B.tapCount(5), false);
  for (let n = 1; n <= 16; n++) app.B.tapCount(n);
  await wait(500);
  assert.equal(doneTitle(app), 'All sixteen, in order');
  assert.ok(app.B.state().gameBest.count >= 1);
});

test('AT55 Sky Lanterns: hold until fully lit and it rises; letting go early lets it dim', async () => {
  const app = ready();
  app.B.openGame('lantern');
  assert.equal(app.document.querySelectorAll('#lantern-sky .lantern').length, 6);
  app.B.holdLantern(0);
  await wait(400);
  app.B.letLantern(0);
  assert.equal(app.B.game().lit, 0, 'a short press does not send it off');
  for (let i = 0; i < 6; i++) app.B.releaseLantern(i);
  assert.equal(app.$('#game-score').textContent, '6 of 6 released');
  await wait(1300);
  assert.equal(doneTitle(app), 'The sky holds them now');
});

test('AT55 Ripple Pond and Mirror Mandala finish after fifteen ripples and eight lines', async () => {
  const app = ready();
  app.B.openGame('pond');
  for (let i = 0; i < 15; i++) app.B.rippleAt(20 + i * 4, 50);
  assert.equal(app.$('#game-score').textContent, '15 of 15 ripples');
  await wait(1600);
  assert.equal(doneTitle(app), 'Still water');
  app.B.openGame('mandala');
  assert.equal(app.B.mandalaStroke([{ x: 100, y: 100 }, { x: 104, y: 102 }]), false, 'a tap is not a line');
  for (let i = 0; i < 8; i++) app.B.mandalaStroke([{ x: 180, y: 180 }, { x: 260, y: 200 + i * 10 }]);
  await wait(700);
  assert.equal(doneTitle(app), 'A mandala of your own');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test("AT55 Today's game: one for everyone each day, a count of days played that never resets, and a badge at seven", async () => {
  let state;
  for (let d = 1; d <= 7; d++) {
    const app = ready(day(d), state);
    const pick = app.B.dailyGame();
    assert.ok(app.$('#daily-name').textContent.length > 3);
    app.click('#daily-play');
    assert.equal(app.B.currentScreen(), 'game');
    assert.equal(app.B.game().id, pick.id);
    assert.equal(app.$('#game-kicker').textContent, "Today's game");
    app.B.finishCurrentGame();
    await wait(1700);
    app.B.go('today');
    assert.equal(app.$('#daily-streak').textContent, d === 1 ? '1 day played so far' : d + ' days played so far');
    assert.match(app.$('#daily-sub').textContent, /Done for today/);
    state = app.B.state();
  }
  assert.ok(state.badges.includes('daily7'));
  const later = ready(day(12), state);
  assert.equal(later.$('#daily-streak').textContent, '7 days played so far', 'quiet days take nothing away');
  assert.equal(ready(day(1)).$('#daily-streak').textContent, 'A new game every day');
  assert.notEqual(ready(day(1)).B.dailyGame().id, ready(day(2)).B.dailyGame().id, 'a different game each day');
});

test('AT55 the game shelf counts what you played, and New tags fade once played', async () => {
  const app = ready();
  app.B.go('progress');
  assert.equal(app.$('#shelf-count').textContent, '0 of 17 games played');
  assert.equal(app.document.querySelectorAll('#shelf-grid .shelf-item.fresh').length, 17);
  app.B.go('play');
  assert.ok(app.$('#panel-games [data-game="pond"] .new-tag'));
  app.B.openGame('pond');
  app.B.finishCurrentGame();
  await wait(1600);
  app.B.go('progress');
  assert.equal(app.$('#shelf-count').textContent, '1 of 17 games played');
  assert.equal(app.$('#shelf-grid [data-game="pond"] span').textContent, 'Played once');
  app.B.go('play');
  assert.equal(app.$('#panel-games [data-game="pond"] .new-tag'), null);
});

test('AT55 Plus: two designs of each are free and repeat; the rest open with Plus; Today can offer one free', async () => {
  const app = ready(day(1), PAY_ON);
  assert.equal(app.B.plusRequired(), true);
  const sets = [];
  for (let i = 0; i < 3; i++) { app.B.openGame('rangoli'); sets.push(app.B.game().set); app.B.finishCurrentGame(); await wait(800); }
  assert.deepEqual(sets, [0, 1, 0], 'free designs take turns');
  assert.equal(app.visible('#game-plus'), true);
  assert.equal(app.$('#game-plus').textContent, '4 more designs with LoosenUp Plus');
  app.click('#game-plus');
  assert.equal(app.visible('#shop-sheet'), true);
  assert.match(app.$('#shop-note').textContent, /rangoli designs, picture puzzles and chime tunes/);
  assert.match(app.$('#shop-sheet').textContent, /Every rangoli design, picture puzzle and chime tune/);
  // Find a day whose game is a Plus design: it plays, free, that day.
  let d = 1;
  while (!ready(day(d), PAY_ON).B.dailyGame().plusTaste) d++;
  const taste = ready(day(d), PAY_ON);
  assert.match(taste.$('#daily-sub').textContent, /^A Plus (design|picture|tune), free for you today\.$/);
  taste.click('#daily-play');
  assert.ok(taste.B.game().set >= 2);
  const plus = ready(day(1), { ...PAY_ON, plus: { key: 'LUtest', active: true, until: null } });
  assert.equal(plus.B.plusRequired(), false);
  plus.B.openGame('tiles'); plus.B.finishCurrentGame(); await wait(800);
  plus.B.openGame('tiles'); plus.B.finishCurrentGame(); await wait(800);
  plus.B.openGame('tiles');
  assert.equal(plus.B.game().set, 2, 'with Plus the third picture comes next');
  assert.equal(plus.visible('#game-plus'), false);
});

test('AT55 six new exercises sit in Calm, and focus plans use them', () => {
  const app = ready();
  app.B.go('play');
  for (const id of ['hum', 'nadi', 'night']) assert.ok(app.$(`#practice-breath [data-practice="${id}"]`), id);
  for (const id of ['eyes', 'chai', 'stretch']) assert.ok(app.$(`#practice-mind [data-practice="${id}"]`), id);
  assert.match(app.$('[data-practice="night"]').textContent, /2 min · Sleep/);
  app.B.toggleFocus('sleep');
  assert.equal(app.B.feelPlan().steps[0][0], 'tech:night');
});

test('AT55 the new games and exercises read in Hindi', async () => {
  const app = ready();
  app.B.setLang('hi');
  for (const id of ['rangoli', 'tiles', 'chimes', 'spot', 'count', 'lantern', 'pond', 'mandala']) {
    app.B.openGame(id);
    await wait(0);
    assert.doesNotMatch(app.$('#game-help').textContent, /[A-Za-z]{3,}/, id + ' hint');
    assert.doesNotMatch(app.$('#game-score').textContent, /[A-Za-z]{3,}/, id + ' score');
  }
  app.B.go('today');
  await wait(0);
  assert.doesNotMatch(app.$('#daily-sub').textContent + app.$('#daily-streak').textContent, /[A-Za-z]{3,}/);
});
