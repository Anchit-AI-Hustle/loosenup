import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day, read } from '../helpers/app.mjs';

const unlockedApp = () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  const sessions = Array.from({ length: 5 }, (_, i) => ({
    ts: day(1).getTime() + i, day: '2026-10-05', technique: 'sigh', context: 'Busy mind', before: 4, after: 6, gain: 2,
  }));
  app.B.setState({ sessions });
  return app;
};

const openLetItOut = (app) => {
  app.setValue('#calm-before', 4);
  app.click('[data-context="Busy mind"]');
  app.click('#checkin-next');
  app.click('[data-pick="letitout"]');
  app.click('#pick-begin');
  assert.equal(app.B.currentScreen(), 'session');
  assert.ok(app.$('#letitout-text'), 'journal box present');
};

test('AT11 crisis phrases are detected', () => {
  const app = makeApp({ now: day(1) });
  const yes = ['I want to die', 'thinking about suicide', 'i might kill myself', 'I just want to end it all',
    'self harm again', 'self-harm', 'Suicidal thoughts', 'no reason to live', 'hurt myself'];
  const no = ['what a lovely day', 'I killed it at work', 'the end of it all went fine', 'die cast model'];
  for (const t of yes) assert.equal(app.B.isCrisis(t), true, t);
  for (const t of no) assert.equal(app.B.isCrisis(t), false, t);
});

test('AT11 typing a crisis phrase in Let it out opens the support sheet with helplines', () => {
  const app = unlockedApp();
  openLetItOut(app);
  assert.equal(app.visible('#support-sheet'), false);
  app.setValue('#letitout-text', 'some days I want to die');
  assert.equal(app.visible('#support-sheet'), true);
  const t = app.$('#support-sheet').textContent;
  assert.match(t, /14416/);
  assert.match(t, /Tele-MANAS/);
  assert.match(t, /findahelpline\.com/);
  assert.match(t, /112/);
  assert.ok(app.$('#support-sheet a[href="tel:14416"]'));
  assert.ok(app.$('#support-sheet a[href="tel:112"]'));
  assert.ok(app.$('#support-sheet a[href="https://findahelpline.com"]'));
});

test('AT11 journal text is never stored', () => {
  const app = unlockedApp();
  openLetItOut(app);
  const secret = 'zebra-marmalade private words';
  app.setValue('#letitout-text', secret);
  app.setValue('#letitout-text', secret + ' I want to end it all');
  app.click('#support-close');
  app.click('#session-finish');
  app.setValue('#calm-after', 6);
  app.click('#after-next');
  const ls = app.window.localStorage;
  for (let i = 0; i < ls.length; i++) {
    const v = ls.getItem(ls.key(i));
    assert.ok(!v.includes('zebra-marmalade'), 'no journal text in localStorage');
    assert.ok(!v.includes('end it all'), 'no crisis text in localStorage');
  }
  assert.equal(app.window.sessionStorage.length, 0);
  assert.equal(app.$('#letitout-text').value, '', 'journal box cleared after the break');
  assert.equal(app.$('#letitout-text').getAttribute('autocomplete'), 'off');
});

test('AT11 support lines are always reachable from Me', () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  app.B.go('today');
  app.click('[data-tab="me"]');
  app.click('#open-support');
  assert.equal(app.visible('#support-sheet'), true);
});

test('AT13 reduced motion, focus ring and 48px targets are defined in CSS', () => {
  const css = read('www/styles.css');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  const rm = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(rm, /animation[^;]*none|animation-duration:\s*0\.01ms/);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px solid/);
  assert.match(css, /--tap:\s*48px/);
  assert.match(css, /min-height:\s*var\(--tap\)/);
});

test('AT13 app honours reduced motion in JS (no orb animation loop)', () => {
  const app = makeApp({ now: day(1) });
  app.window.matchMedia = (q) => ({ matches: /reduce/.test(q), addEventListener() {}, removeEventListener() {} });
  assert.equal(app.B.prefersReducedMotion(), true);
});
