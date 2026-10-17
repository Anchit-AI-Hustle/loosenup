import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day, read } from '../helpers/app.mjs';

const ready = () => { const app = makeApp({ now: day(1), rng: () => 0.99 }); onboard(app); app.B.go('me'); return app; };
const setPin = (app, a, b = a) => {
  app.click('#lock-toggle');
  app.setValue('#pin-new', a);
  app.setValue('#pin-confirm', b);
  app.click('#pin-save');
};

test('AT23 SHA-256 matches the standard test vector', () => {
  const { B } = makeApp({ now: day(1) });
  assert.equal(B.sha256('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(B.sha256(''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
});

test('AT23 a PIN is stored only as a salted hash', () => {
  const app = ready();
  setPin(app, '12', '12');
  assert.equal(app.B.state().lock.enabled, false, 'too short is refused');
  setPin(app, '4826', '4827');
  assert.equal(app.B.state().lock.enabled, false, 'mismatch is refused');
  setPin(app, '4826');
  const lock = app.B.state().lock;
  assert.equal(lock.enabled, true);
  assert.match(lock.salt, /^[0-9a-f]{32}$/);
  assert.match(lock.hash, /^[0-9a-f]{64}$/);
  assert.ok(!app.window.localStorage.getItem('loosenup.v1').includes('4826'), 'PIN never stored in plain text');
});

test('AT23 the app opens locked, unlocks with the right PIN, pauses after 5 wrong tries', () => {
  const first = ready();
  setPin(first, '4826');
  const app = makeApp({ state: JSON.parse(first.window.localStorage.getItem('loosenup.v1')), now: day(1) });
  assert.equal(app.B.isLocked(), true);
  app.setValue('#lock-pin', '0000');
  app.click('#lock-unlock');
  assert.equal(app.B.isLocked(), true);
  assert.match(app.$('#lock-msg').textContent, /did not match/);
  for (let i = 0; i < 4; i++) { app.setValue('#lock-pin', '1111'); app.click('#lock-unlock'); }
  assert.match(app.$('#lock-msg').textContent, /30 seconds/);
  app.setValue('#lock-pin', '4826');
  app.click('#lock-unlock');
  assert.equal(app.B.isLocked(), true, 'still pausing after too many tries');
});

test('AT23 the right PIN unlocks', () => {
  const first = ready();
  setPin(first, '4826');
  const app = makeApp({ state: JSON.parse(first.window.localStorage.getItem('loosenup.v1')), now: day(1) });
  app.setValue('#lock-pin', '4826');
  app.click('#lock-unlock');
  assert.equal(app.B.isLocked(), false);
});

test('AT23 SOS stays reachable on the lock screen, private tools stay hidden', () => {
  const first = ready();
  setPin(first, '4826');
  const app = makeApp({ state: JSON.parse(first.window.localStorage.getItem('loosenup.v1')), now: day(1) });
  app.click('#lock-sos');
  assert.equal(app.visible('#support-sheet'), true);
  assert.ok(app.document.body.classList.contains('lock-sos'), 'sheet raised above the lock');
  assert.ok(app.document.body.classList.contains('locked'));
  assert.match(read('www/styles.css'), /body\.locked #support-sheet \[data-tool\] \{ display: none; \}/);
  assert.ok(app.$('#support-sheet a[href="tel:14416"]'));
});

test('AT23 turning the lock off needs the current PIN', () => {
  const app = ready();
  setPin(app, '4826');
  app.click('#lock-toggle');
  app.setValue('#pin-current', '9999');
  app.click('#pin-off');
  assert.equal(app.B.state().lock.enabled, true);
  app.setValue('#pin-current', '4826');
  app.click('#pin-off');
  assert.equal(app.B.state().lock.enabled, false);
});

test('AT23 theme: Auto, Light and Dark, applied to the page and remembered', () => {
  const app = ready();
  app.click('[data-theme-choice="dark"]');
  assert.equal(app.document.documentElement.getAttribute('data-theme'), 'dark');
  assert.equal(app.window.localStorage.getItem('loosenup.theme'), 'dark');
  assert.equal(app.$('meta[name="theme-color"]').getAttribute('content'), '#0E1626');
  app.click('[data-theme-choice="light"]');
  assert.equal(app.document.documentElement.getAttribute('data-theme'), 'light');
  assert.equal(app.B.state().theme, 'light');
  const css = read('www/styles.css');
  assert.match(css, /html\[data-theme="dark"\] \{[^}]*--ink: #ECF2F7/);
});
