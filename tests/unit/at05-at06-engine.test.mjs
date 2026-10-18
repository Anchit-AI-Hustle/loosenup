import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const fresh = (now) => {
  const app = makeApp({ now, rng: () => 0.99 });
  onboard(app);
  return app;
};

test('AT5 Sunny days count once per calendar day', () => {
  const app = fresh(day(1));
  app.B.completeSession({ technique: 'breeze', context: 'Hard to focus', before: 4, after: 6 });
  app.B.completeSession({ technique: 'breeze', context: 'Hard to focus', before: 4, after: 6 });
  assert.equal(app.B.state().streak.count, 1);
  app.B.setNow(day(2));
  app.B.completeSession({ technique: 'breeze', context: 'Hard to focus', before: 4, after: 6 });
  assert.equal(app.B.state().streak.count, 2);
});

test('AT5 one rest day a week bridges a 2-day gap, and the 3-day milestone is recorded', () => {
  const app = fresh(day(1));
  const brk = () => app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 5, after: 7 });
  brk();
  app.B.setNow(day(2)); brk();
  app.B.setNow(day(4)); // day 3 skipped
  const r = brk();
  const s = app.B.state();
  assert.equal(s.streak.count, 3, 'the rest day kept the streak going');
  assert.equal(r.rainDayUsed, true);
  assert.equal(r.milestone, 3);
  assert.ok(s.badges.includes('streak3'));
  // A second gap in the same week starts a fresh streak instead of a second rest day.
  app.B.setNow(day(6)); brk();
  assert.equal(app.B.state().streak.count, 1);
});

test('AT5 a gap longer than one day starts a fresh run', () => {
  const app = fresh(day(1));
  app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 5, after: 7 });
  app.B.setNow(day(5));
  app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 5, after: 7 });
  assert.equal(app.B.state().streak.count, 1);
});

const S = (technique, context, gain, i) => ({
  ts: day(1).getTime() + i * 60000, day: '2026-10-05', technique, context, before: 3, after: 3 + gain, gain,
});

test('AT6 day one recommendation is rule based by context', () => {
  const app = fresh(day(1));
  assert.equal(app.B.recommend('Hard to focus').id, 'breeze');
  assert.equal(app.B.recommend('Big moment ahead').id, 'sigh');
  assert.equal(app.B.recommend('Busy mind').id, 'letitout');
  assert.equal(app.B.recommend('Tight shoulders').id, 'release', 'every exercise is open from day one');
  assert.ok(app.B.recommend('Winding down').reason.length > 0);
});

test('AT6 switches to the best average gain after 2 or more tries in that context', () => {
  const app = fresh(day(1));
  app.B.setState({ sessions: [
    S('breeze', 'Hard to focus', 1, 1), S('breeze', 'Hard to focus', 1, 2),
    S('sigh', 'Hard to focus', 4, 3),
  ] });
  assert.equal(app.B.recommend('Hard to focus').id, 'breeze', 'sigh has only 1 try');
  app.B.setState({ sessions: [
    S('breeze', 'Hard to focus', 1, 1), S('breeze', 'Hard to focus', 1, 2),
    S('sigh', 'Hard to focus', 4, 3), S('sigh', 'Hard to focus', 3, 4),
  ] });
  const r = app.B.recommend('Hard to focus');
  assert.equal(r.id, 'sigh');
  assert.match(r.reason, /\+3\.5/);
  assert.equal(app.B.recommend('Big moment ahead').id, 'sigh', 'other contexts keep rules');
});

test('AT6 every exercise is open from the first day, and a break never costs anything', () => {
  const app = fresh(day(1));
  for (const id of Object.keys(app.B.techniques)) assert.equal(app.B.techniques[id].unlockAt, 0, id);
  const r = app.B.completeSession({ technique: 'release', context: 'Tight shoulders', before: 3, after: 8 });
  assert.equal(r.gain, 5);
  assert.ok(!('xpGained' in r) && !('sunbeam' in r), 'no XP or surprise rewards');
  assert.ok(app.B.state().badges.includes('bigLift'));
});
