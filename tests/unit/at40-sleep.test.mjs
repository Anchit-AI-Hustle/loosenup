import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = () => { const app = makeApp({ now: day(1), rng: () => 0.99 }); onboard(app); app.B.go('today'); return app; };

test('AT40 four guided sleep sessions, in English and Hindi, reachable from Today and from Calm sounds', () => {
  const app = ready();
  const S = app.window.LoosenUpSleep;
  assert.deepEqual([...S.map((s) => s.id)], ['scan', 'nidra', 'train', 'monsoon']);
  for (const s of S) for (const l of s.lines) assert.ok(l[0] && l[2] && l[1] >= 10, s.id + ': every line has Hindi and a pause');
  assert.ok(app.$('#screen-today [data-more="sleep"]'), 'Sleep tile on Today');
  assert.ok(app.$('#panel-sounds [data-more="sleep"]'), 'Guided sleep in Calm sounds');
  app.click('#screen-today [data-more="sleep"]');
  assert.equal(app.B.currentScreen(), 'sleep');
  assert.equal(app.document.querySelectorAll('#sleep-list [data-sleep]').length, 4);
});

test('AT40 the sleep player speaks line by line with pauses, dims the screen and fades at the end', () => {
  const app = ready();
  const spoken = [];
  app.window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  app.window.speechSynthesis = { speak: (u) => spoken.push(u.text), cancel: () => {} };
  const M = app.window.LoosenUpMore;
  M.sleepStart('scan');
  assert.equal(app.$('#sp-line').textContent, 'Lie down comfortably and let your arms rest by your sides.');
  assert.equal(spoken[0], 'Lie down comfortably and let your arms rest by your sides.', 'voice speaks even when the break voice is off');
  assert.ok(app.document.documentElement.classList.contains('sleep-dim'));
  const total = M.sleepRun().total;
  assert.ok(total >= 480 && total <= 720, 'about 10 minutes: ' + total);
  for (let i = 0; i < total + 2; i++) M.sleepTick();
  assert.equal(M.sleepRun().done, true);
  assert.equal(app.$('#sp-line').textContent, 'Sleep well.');
  M.sleepStop();
  assert.equal(app.document.documentElement.classList.contains('sleep-dim'), false);
});

test('AT40 in Hindi, the sleep story and its voice are Hindi', () => {
  const app = ready();
  const spoken = [];
  app.window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  app.window.speechSynthesis = { speak: (u) => spoken.push({ t: u.text, lang: u.lang }), cancel: () => {} };
  app.B.setLang('hi');
  app.window.LoosenUpMore.sleepStart('monsoon');
  assert.equal(spoken[0].t, 'मानसून की पहली बारिश आज दोपहर आई।');
  assert.equal(spoken[0].lang, 'hi-IN');
  assert.match(app.$('#sp-title').textContent, /बरामदे में मानसून की शाम/);
});
