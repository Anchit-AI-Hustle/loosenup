import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const start = (id) => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  app.B.go('play');
  app.click(`[data-practice="${id}"]`);
  app.setValue('#calm-before', 4);
  app.click('#checkin-next');
  if (id !== 'quick') app.click('#pick-begin');
  return app;
};
const text = (app, sel) => app.$(sel).textContent.trim();
const ticks = (app, n) => { for (let i = 0; i < n; i++) app.B.sessionTick(); };

test('AT33 breathing: a get-ready countdown and how-to tips, then timed phases with a live countdown', () => {
  const app = start('square');
  assert.equal(app.B.currentScreen(), 'session');
  assert.deepEqual([...app.document.querySelectorAll('#pattern-strip .pchip')].map((c) => c.textContent), ['In 4s', 'Hold 4s', 'Out 4s', 'Rest 4s']);
  assert.equal(app.document.querySelectorAll('#how-list li').length, 3, 'three how-to tips');
  assert.equal(text(app, '#cue'), 'Get ready');
  assert.equal(text(app, '#orb-count'), '3');
  ticks(app, 3);
  assert.equal(text(app, '#cue'), 'Breathe in');
  assert.equal(text(app, '#orb-count'), '4');
  assert.equal(text(app, '#round-count'), 'Round 1 of 8');
  assert.ok(app.$('#pattern-strip .pchip').classList.contains('on'), 'the live phase is lit');
  ticks(app, 1);
  assert.equal(text(app, '#orb-count'), '3', 'counts down each second');
  ticks(app, 3);
  assert.equal(text(app, '#cue'), 'Hold gently');
  ticks(app, 12);
  assert.equal(text(app, '#round-count'), 'Round 2 of 8', 'rounds advance after a full cycle');
  assert.equal(app.B.run().left, 120 - 16, 'the 2 minutes start after get ready');
});

test('AT33 every breathing exercise and every step exercise has a follow-along guide', () => {
  const app = start('sigh');
  const T = app.B.techniques;
  for (const id of Object.keys(T)) {
    if (T[id].kind === 'journal') continue;
    for (const ph of T[id].pattern || []) assert.ok(ph[1] >= 1 && ph[1] <= 10, `${id}: phase timing in seconds`);
  }
  for (const id of ['here', 'release', 'kind', 'desk', 'pause', 'warmth']) assert.equal(T[id].steps.length, 5, id);
});

test('AT33 Here and now: tap a dot for each thing you notice; all five move you on', async () => {
  const app = start('here');
  ticks(app, 3);
  assert.equal(text(app, '#step-icon'), '👀');
  const dots = app.document.querySelectorAll('#step-dots .sdot');
  assert.equal(dots.length, 5);
  for (let i = 0; i < 5; i++) app.click(`#step-dots [data-dot="${i}"]`);
  assert.equal(app.$('#step-dots [data-dot="4"]').getAttribute('aria-pressed'), 'true');
  await new Promise((r) => setTimeout(r, 800));
  assert.equal(text(app, '#step-count'), 'Step 2 of 5');
  assert.equal(app.document.querySelectorAll('#step-dots .sdot').length, 4, 'four things you can feel');
});

test('AT33 Soft release: tense, then let go, with a countdown for each part and each step', () => {
  const app = start('release');
  ticks(app, 3);
  assert.equal(text(app, '#step-sub'), 'Tense · 5');
  assert.equal(text(app, '#step-left'), '24');
  ticks(app, 5);
  assert.equal(text(app, '#step-sub'), 'Let go · 7');
  ticks(app, 19);
  assert.equal(text(app, '#step-count'), 'Step 2 of 5', 'each step lasts 24 seconds');
  assert.equal(text(app, '#step-sub'), 'Squeeze · 5');
});
