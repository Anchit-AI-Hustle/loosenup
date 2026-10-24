// AT49: For you understands the feeling first, then offers a short plan that tends to bring relief:
// settle the body (or lift it when energy is low), shift attention, end on a small win.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const at = (h) => `2026-10-20T${h}:00:00`;
const ready = (when = at('11')) => { const app = makeApp({ now: new Date(when), rng: () => 0.5 }); onboard(app); app.B.go('today'); return app; };
const feel = (app, key, taps = 1) => { for (let i = 0; i < taps; i++) app.click(`[data-emotion="${key}"]`); };
const refs = (app) => app.B.feelPlan().steps.map((s) => s[0]);
const shownGames = (app) => [...app.document.querySelectorAll('#screen-today .game-tile:not([hidden])')].map((b) => b.getAttribute('data-game') || b.getAttribute('data-more'));
const finishSession = (app) => { app.click('#session-finish'); app.setValue('#calm-after', 7); app.click('#after-next'); };

test('AT49 every feeling has caring words first and a plan whose steps all exist', () => {
  const app = ready();
  const F = app.window.LoosenUpFeelings;
  for (const [key, f] of Object.entries(F.feelings)) {
    assert.ok(f.hear.length >= 1 && f.hear.length <= 3, key + ' has 1 to 3 caring lines');
    assert.ok(f.close, key + ' has a closing line');
    for (const [ref, why] of [...(f.plan || []), ...(f.alt || [])]) {
      assert.ok(app.B.stepInfo(ref), `${key}: ${ref} exists`);
      assert.ok(why && why.length > 10, `${key}: ${ref} says why`);
    }
    if (f.plan) assert.ok(f.plan.length >= 1 && f.plan.length <= 3, key + ' plan stays short');
    for (const g of f.games) assert.ok(app.B.stepInfo('game:' + g), `${key}: game ${g} exists`);
  }
  for (const steps of Object.values(F.byTime)) for (const [ref] of steps) assert.ok(app.B.stepInfo(ref), ref);
});

test('AT49 the card leads with understanding, then shows the plan and the first step', () => {
  const app = ready();
  feel(app, 'angry', 2);
  assert.match(app.$('#for-you-hear').textContent, /angry|anger|heat/i);
  assert.deepEqual([...app.document.querySelectorAll('#for-you-plan li')].map((l) => l.textContent), ['Cool down, 2 min', 'Soft release, 2 min', 'Calm Pairs, 2 min']);
  assert.equal(app.$('#for-you-plan li.now').textContent, 'Cool down, 2 min');
  assert.equal(app.$('#for-you-btn').getAttribute('data-now'), 'cooldown');
});

test('AT49 high-energy feelings settle the body first and never get a fast game', () => {
  for (const key of ['angry', 'worried', 'overwhelmed', 'frustrated', 'restless']) {
    const app = ready();
    feel(app, key, 3);
    const steps = refs(app);
    assert.match(steps[0], /^tech:(cooldown|sigh|release|shake)$/, `${key} starts in the body: ${steps[0]}`);
    assert.ok(!steps.includes('game:catch'), `${key} plan has no fast game`);
    assert.ok(!shownGames(app).includes('catch'), `${key}: Today hides the fast game`);
  }
});

test('AT49 worry gets long breaths out, never breath holds', () => {
  const app = ready();
  feel(app, 'worried', 3);
  const steps = refs(app);
  assert.equal(steps[0], 'tech:sigh');
  assert.ok(!steps.includes('tech:square'), 'box breathing holds can make a panicky body feel worse');
  assert.deepEqual([...steps], ['tech:sigh', 'tech:name', 'tech:park']);
});

test('AT49 crying: gentle first, no games or scores, and support is close', () => {
  const app = ready();
  app.click('[data-mood="1"]');
  assert.equal(app.B.feelPlan().key, 'crying');
  assert.match(app.$('#for-you-hear').textContent, /cry|here with you|explain/i);
  assert.ok(!refs(app).some((r) => r.startsWith('game:')), 'no game in the plan');
  assert.ok(shownGames(app).every((g) => g === 'bloom' || g === 'trace'), 'only slow breathing games show');
  assert.equal(app.B.feelPlan().steps[0][0], 'tech:wave');
  app.click('#for-you-alt');
  assert.ok(refs(app).includes('sos'), 'Something else offers someone to talk to');
});

test('AT49 low energy is lifted gently, not calmed further', () => {
  const app = ready();
  feel(app, 'flat', 2);
  assert.equal(refs(app)[0], 'tech:lift');
  assert.ok(!refs(app).some((r) => /tech:(sigh|breeze|cooldown|square|wave)/.test(r)), 'no calming breath for a flat mood');
});

test('AT49 tired: rest first, and Something else offers a small lift instead', () => {
  const app = ready();
  feel(app, 'tired');
  assert.equal(refs(app)[0], 'tech:release');
  assert.equal(app.$('#for-you-alt').textContent, 'Something else');
  app.click('#for-you-alt');
  assert.equal(refs(app)[0], 'tech:lift');
  assert.equal(app.$('#for-you-alt').textContent, 'Back to the first idea');
});

test('AT49 good feelings are savoured, not fixed', () => {
  for (const key of ['calm', 'happy', 'loved']) {
    const app = ready();
    feel(app, key, 2);
    assert.equal(refs(app)[0], 'tech:savour', key);
  }
  const app = ready();
  feel(app, 'grateful');
  assert.equal(refs(app)[0], 'jar');
  assert.equal(app.$('#for-you-btn').textContent, 'Add a good thing');
});

test('AT49 a heavier feeling leads over a good one, and the strongest heavy feeling wins', () => {
  const app = ready();
  feel(app, 'happy', 3);
  feel(app, 'lonely', 1);
  assert.equal(app.B.feelPlan().key, 'lonely');
  feel(app, 'harsh', 2);
  assert.equal(app.B.feelPlan().key, 'harsh');
});

test('AT49 at night a worried or restless mind gets the racing-mind plan, and nothing bright', () => {
  const app = ready(at('23'));
  feel(app, 'worried', 2);
  assert.equal(app.B.feelPlan().key, 'racing');
  assert.equal(refs(app)[0], 'tech:tomorrow');
  assert.ok(!shownGames(app).includes('catch'));
  const app2 = ready(at('23'));
  feel(app2, 'energetic', 2);
  assert.ok(!refs(app2).includes('game:catch'), 'no fast game at night, even with energy');
});

test('AT49 each finished step offers the next, and the last one ends with the closing line', () => {
  const app = ready();
  feel(app, 'angry', 2);
  app.click('#for-you-btn');
  assert.equal(app.B.run().id, 'cooldown');
  finishSession(app);
  assert.equal(app.B.currentScreen(), 'result');
  assert.equal(app.visible('#plan-next'), true);
  assert.equal(app.$('#plan-next').textContent, 'Next for you: Soft release');
  app.click('#plan-next');
  assert.equal(app.B.run().id, 'release');
  finishSession(app);
  assert.equal(app.$('#plan-next').textContent, 'Next for you: Calm Pairs');
  app.click('#plan-next');
  assert.equal(app.B.currentScreen(), 'game');
  app.B.finishCurrentGame();
  assert.equal(app.visible('#game-plan-next'), false, 'nothing left to offer');
  assert.match(app.$('#game-done-text').textContent, /You cooled it down yourself/);
  app.B.go('today');
  assert.equal(app.$('#for-you-name').textContent, 'All done for now');
  assert.equal(app.document.querySelectorAll('#for-you-plan li.done').length, 3);
  app.click('#for-you-btn');
  assert.equal(app.$('#for-you-name').textContent, 'Cool down, 2 min', 'Start again begins the plan once more');
});

test('AT49 a Small step in the plan counts when you tap I did it', () => {
  const app = ready();
  feel(app, 'sad');
  app.B.setState({ feelPlan: { day: '2026-10-20', key: 'sad', alt: false, done: ['tech:kind', 'game:bloom'] } });
  assert.equal(app.$('#for-you-btn').textContent, 'I did it');
  assert.match(app.$('#for-you-why').textContent, /^When you are ready, one tiny kind thing for yourself\. \S/);
  app.click('#for-you-btn');
  assert.equal(app.B.feelPlan().next, -1);
  assert.equal(app.B.state().smallSteps.length, 1);
});

test('AT49 Bubble Pop: thirty bubbles, no timer, and popping them all finishes kindly', () => {
  const app = ready();
  app.B.openGame('pop');
  const bubbles = app.document.querySelectorAll('#pop-field .bubble');
  assert.equal(bubbles.length, 30);
  bubbles[0].dispatchEvent(new app.window.Event('pointerdown'));
  bubbles[0].dispatchEvent(new app.window.MouseEvent('click', { bubbles: true }));
  assert.equal(app.$('#game-score').textContent, '1 of 30 popped', 'one tap pops once');
  app.B.finishCurrentGame();
  return new Promise((r) => setTimeout(r, 450)).then(() => {
    assert.equal(app.visible('#game-done'), true);
    assert.equal(app.$('#game-done-title').textContent, 'Every bubble popped');
  });
});

test('AT49 every feelings line has Hindi', () => {
  const app = ready();
  const I = app.window.LoosenUpI18n;
  const F = app.window.LoosenUpFeelings;
  const lines = [];
  for (const f of Object.values(F.feelings)) lines.push(...f.hear, f.close, ...[...(f.plan || []), ...(f.alt || [])].map((x) => x[1]));
  for (const s of Object.values(F.byTime)) lines.push(...s.map((x) => x[1]));
  const missing = [...new Set(lines)].filter((l) => I.tr(l) === l);
  assert.deepEqual(missing, []);
});
