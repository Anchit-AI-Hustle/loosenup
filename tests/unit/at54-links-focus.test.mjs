// AT54: links that open straight into a break or game (shared by friends, reminder buttons, home-screen
// shortcuts), Send to a friend, and the first-run "What brings you here?" that shapes For you.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day, read } from '../helpers/app.mjs';

const ready = (now = day(1)) => { const app = makeApp({ now, rng: () => 0.42 }); onboard(app); app.B.go('today'); return app; };
const openLink = (app, search) => { app.window.history.replaceState(null, '', '/' + search); app.B.openFromLink(); };

test('AT54 a link opens straight into a game, an exercise, a breath, the check-in or SOS, then tidies the address', () => {
  const app = ready();
  openLink(app, '?go=game:pop');
  assert.equal(app.B.currentScreen(), 'game');
  assert.equal(app.B.game().id, 'pop');
  assert.equal(app.window.location.search, '', 'the link does not run again on reload');
  openLink(app, '?app=webclip&go=ex:sigh');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.window.location.search, '?app=webclip', 'other parts of the address stay');
  app.B.go('today');
  openLink(app, '?go=breathe');
  assert.equal(app.B.currentScreen(), 'session');
  app.B.go('today');
  app.B.goTarget('checkin');
  assert.equal(app.B.currentScreen(), 'today');
  assert.ok(app.$('#mood-card').classList.contains('glow'), 'the mood check-in glows');
  app.B.goTarget('sos');
  assert.equal(app.visible('#support-sheet'), true, 'SOS opens');
  assert.equal(app.B.goTarget('game:nothing'), false, 'an unknown link does nothing');
  assert.equal(app.B.linkTarget('loosenup://go/breathe'), 'breathe', 'Android shortcuts use loosenup://go/...');
  assert.equal(app.errors.length, 0, app.errors.join('\n'));
});

test('AT54 someone new from a shared link meets the welcome, then lands on what was shared', () => {
  const app = makeApp({ now: day(1), rng: () => 0.42 });
  openLink(app, '?go=game:sort');
  assert.equal(app.B.currentScreen(), 'welcome');
  app.setValue('#name-input', 'Ravi');
  app.click('#welcome-go');
  assert.equal(app.$('#gift-go').textContent, 'Try Colour Sort');
  app.click('#gift-go');
  assert.equal(app.B.currentScreen(), 'game');
  assert.equal(app.B.game().id, 'sort');
  assert.equal(app.B.state().pendingGo, null);
});

test('AT54 Send to a friend shares a link that opens that exact game or exercise', async () => {
  const app = ready();
  const sent = [];
  app.window.navigator.share = (d) => { sent.push(d); return Promise.resolve(); };
  app.B.openGame('stars');
  app.B.finishCurrentGame();
  app.click('#game-send');
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(sent[0].url, 'https://loosenup.anchit-tandon.com/?go=game%3Astars');
  assert.match(sent[0].text, /Star Connect/);
  await app.B.shareBreak('ex:wave');
  assert.equal(sent[1].url, 'https://loosenup.anchit-tandon.com/?go=ex%3Awave');
  assert.equal(await app.B.shareBreak('ex:nothing'), false);
});

test('AT54 What brings you here: chips on first open and in Me shape For you', () => {
  const app = makeApp({ now: new Date('2026-10-20T11:00:00'), rng: () => 0.42 });
  app.setValue('#name-input', 'Asha');
  app.click('#welcome-go');
  const chips = [...app.document.querySelectorAll('#screen-gift [data-focus]')];
  assert.equal(chips.length, 8);
  assert.equal(app.$('#gift-go').textContent, 'Start my first break', 'choosing is optional');
  app.click('#screen-gift [data-focus="exams"]');
  assert.equal(app.$('#screen-gift [data-focus="exams"]').getAttribute('aria-pressed'), 'true');
  assert.deepEqual([...app.B.state().focus], ['exams']);
  app.click('#gift-go');
  app.B.go('today');
  assert.deepEqual([...app.B.feelPlan().steps.map((s) => s[0])], ['tech:square', 'game:sort'], 'For you follows the focus');
  app.click('[data-emotion="angry"]');
  assert.equal(app.B.feelPlan().key, 'angry', 'a feeling still comes first');
  app.B.go('me');
  assert.equal(app.$('#screen-me [data-focus="exams"]').getAttribute('aria-pressed'), 'true', 'Me shows the same choices');
  app.click('#screen-me [data-focus="exams"]');
  assert.equal(app.B.state().focus.length, 0);
});

test('AT54 reminders carry Breathe now and How are you? buttons, and Android has home-screen shortcuts', () => {
  const sw = read('www/sw.js');
  assert.match(sw, /\['breathe', 'Breathe now'\], \['checkin', 'How are you\?'\]/);
  assert.match(sw, /url = '\/\?go=' \+ event\.action/);
  assert.match(read('api/push.js'), /lang: r\.lang === 'hi'/);
  const app = read('www/app.js');
  assert.match(app, /actionTypeId: 'LU_DAILY'/);
  const m = JSON.parse(read('www/manifest.json'));
  assert.deepEqual(m.shortcuts.map((s) => s.url), ['/?go=breathe', '/?go=checkin', '/?go=sos']);
  const xml = read('android/app/src/main/res/xml/shortcuts.xml');
  for (const t of ['breathe', 'checkin', 'sos']) assert.match(xml, new RegExp(`loosenup://go/${t}`));
  const man = read('android/app/src/main/AndroidManifest.xml');
  assert.match(man, /android:scheme="loosenup"/);
  assert.match(man, /android\.app\.shortcuts/);
  assert.match(read('android/app/src/main/res/values-hi/strings.xml'), /अभी साँस लें/);
});

test('AT54 the new words read in Hindi', async () => {
  const app = makeApp({ now: day(1), rng: () => 0.42 });
  app.B.setLang('hi');
  app.setValue('#name-input', 'Asha');
  app.click('#welcome-go');
  await new Promise((r) => setTimeout(r, 0));
  assert.doesNotMatch(app.$('#screen-gift .focus-pick').textContent, /[A-Za-z]{3,}/);
});
