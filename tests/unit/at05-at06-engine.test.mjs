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

test('AT5 a Rain day bridges a 2-day gap once per week and the 3-day milestone grants a Seed', () => {
  const app = fresh(day(1));
  const brk = () => app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 5, after: 7 });
  brk();
  app.B.setNow(day(2)); brk();
  const seedsBefore = app.B.state().seeds;
  app.B.setNow(day(4)); // day 3 skipped
  const r = brk();
  const s = app.B.state();
  assert.equal(s.streak.count, 3, 'Rain day kept the run going');
  assert.equal(r.rainDayUsed, true);
  assert.equal(s.rainDayWeek, app.B.weekKey(day(4)));
  assert.ok(s.milestones.includes(3), '3-day milestone recorded');
  assert.equal(s.seeds, seedsBefore + 1, 'milestone Seed granted');
  assert.equal(s.rewardSeeds.count, 1);
  // A second gap in the same week starts a fresh run instead of a second Rain day.
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

test('AT5 milestone Seed respects the weekly free Seed cap of 2', () => {
  const app = fresh(day(1));
  const wk = app.B.weekKey(day(3));
  app.B.setState({
    streak: { count: 2, lastDay: app.B.dayKey(day(2)), best: 2 },
    rewardSeeds: { week: wk, count: 2 },
  });
  app.B.setNow(day(3));
  const seeds = app.B.state().seeds;
  const r = app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 5, after: 7 });
  const s = app.B.state();
  assert.equal(s.streak.count, 3);
  assert.ok(s.milestones.includes(3), 'milestone still celebrated');
  assert.equal(s.seeds, seeds, 'no Seed beyond the weekly cap');
  assert.equal(s.rewardSeeds.count, 2);
  assert.equal(r.milestoneSeed, false);
});

test('AT5 free reward Seeds never exceed 2 in a week across all sources', () => {
  const app = makeApp({ now: day(1), rng: () => 0.01 }); // Sunbeam surprise always rolls
  onboard(app);
  for (let i = 0; i < 6; i++) {
    app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 8, after: 5 }); // showed-up Seed
  }
  assert.equal(app.B.state().rewardSeeds.count, 2);
  assert.equal(app.B.state().seeds, 5 + 2, 'gift 5 + 2 capped reward Seeds (engine calls do not spend)');
  // Next ISO week resets the cap: showed-up Seed + that day's Sunbeam Seed.
  app.B.setNow(day(8));
  app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 8, after: 5 });
  assert.equal(app.B.state().rewardSeeds.count, 2);
  assert.equal(app.B.state().rewardSeeds.week, app.B.weekKey(day(8)));
  app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 8, after: 5 });
  assert.equal(app.B.state().rewardSeeds.count, 2, 'still capped at 2');
});

test('AT5 Sunbeam surprise rolls at most once per day', () => {
  let calls = 0;
  const app = makeApp({ now: day(1), rng: () => { calls++; return 0.01; } });
  onboard(app);
  const a = app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 4, after: 6 });
  const b = app.B.completeSession({ technique: 'sigh', context: 'Big moment ahead', before: 4, after: 6 });
  assert.equal(a.sunbeam, true);
  assert.equal(b.sunbeam, false);
});

const S = (technique, context, gain, i) => ({
  ts: day(1).getTime() + i * 60000, day: '2026-10-05', technique, context, before: 3, after: 3 + gain, gain,
});

test('AT6 day one recommendation is rule based by context', () => {
  const app = fresh(day(1));
  assert.equal(app.B.recommend('Hard to focus').id, 'breeze');
  assert.equal(app.B.recommend('Big moment ahead').id, 'sigh');
  assert.equal(app.B.recommend('Busy mind').id, 'here');
  assert.equal(app.B.recommend('Tight shoulders').id, 'sigh', 'Soft release still locked');
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

test('AT6 locked techniques are excluded even with great history', () => {
  const app = fresh(day(1));
  const four = [
    S('sigh', 'Busy mind', 3, 1), S('sigh', 'Busy mind', 3, 2),
    S('letitout', 'Busy mind', 9, 3), S('letitout', 'Busy mind', 9, 4),
  ];
  app.B.setState({ sessions: four });
  assert.equal(app.B.isUnlocked('release'), true, 'Soft release unlocks after 3 breaks');
  assert.equal(app.B.isUnlocked('letitout'), false, 'Let it out needs 5 breaks');
  assert.equal(app.B.recommend('Busy mind').id, 'sigh');
  app.B.setState({ sessions: [...four, S('here', 'Winding down', 1, 5)] });
  assert.equal(app.B.isUnlocked('letitout'), true);
  assert.equal(app.B.recommend('Busy mind').id, 'letitout');
});

test('AT6 unlock thresholds: Soft release after 3 breaks, Let it out after 5', () => {
  const app = fresh(day(1));
  const brk = () => app.B.completeSession({ technique: 'sigh', context: 'Busy mind', before: 4, after: 6 });
  brk(); brk();
  assert.equal(app.B.isUnlocked('release'), false);
  brk();
  assert.equal(app.B.isUnlocked('release'), true);
  brk();
  assert.equal(app.B.isUnlocked('letitout'), false);
  brk();
  assert.equal(app.B.isUnlocked('letitout'), true);
});

test('AT5 XP rule: 10 + 2 x positive gain', () => {
  const app = fresh(day(1));
  app.B.completeSession({ technique: 'sigh', context: 'Busy mind', before: 2, after: 9 });
  assert.equal(app.B.state().xp, 25 + 10 + 14);
  app.B.completeSession({ technique: 'sigh', context: 'Busy mind', before: 9, after: 2 });
  assert.equal(app.B.state().xp, 25 + 10 + 14 + 10);
});
