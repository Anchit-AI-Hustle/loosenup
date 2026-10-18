import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const withVoice = () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  const spoken = [];
  app.window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  app.window.speechSynthesis = { speak: (u) => spoken.push({ text: u.text, lang: u.lang }), cancel: () => {} };
  onboard(app);
  return { app, spoken };
};

test('AT25 the pick screen offers voice, chimes and a background sound, remembered for next time', () => {
  const { app } = withVoice();
  app.click('[data-context="Hard to focus"]');
  app.click('#checkin-next');
  assert.equal(app.$('[data-guide="chime"]').getAttribute('aria-pressed'), 'true', 'chimes on by default');
  app.click('[data-guide="voice"]');
  app.click('[data-bed="rain"]');
  const s = app.B.state();
  assert.equal(s.voice, true);
  assert.equal(s.bed, 'rain');
  assert.equal(app.$('[data-bed="rain"]').getAttribute('aria-pressed'), 'true');
});

test('AT25 voice narration: intro, then each cue, then a kind close', () => {
  const { app, spoken } = withVoice();
  app.click('[data-context="Hard to focus"]');
  app.click('#checkin-next');
  app.click('[data-guide="voice"]');
  const before = app.B.chimesPlayed();
  app.click('#pick-begin');
  assert.match(spoken[0].text, /Let us begin/);
  assert.match(spoken[1].text, /easy breaths in through the nose|Soft, even breathing|Slow, even breathing|Sixty seconds/, 'then the exercise in a sentence');
  assert.equal(spoken[2].text, 'Get ready', 'a short get-ready countdown first');
  for (let i = 0; i < 3; i++) app.B.sessionTick();
  assert.equal(spoken.at(-1).text, 'Breathe in');
  assert.equal(spoken[0].lang, 'en-IN');
  assert.ok(app.B.chimesPlayed() > before, 'a chime marks the breath change');
  app.click('#session-finish');
  assert.match(spoken.at(-1).text, /notice how you feel now/);
});

test('AT25 with voice off nothing is spoken', () => {
  const { app, spoken } = withVoice();
  app.click('[data-context="Hard to focus"]');
  app.click('#checkin-next');
  app.click('#pick-begin');
  assert.equal(spoken.length, 0);
});
