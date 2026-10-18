import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = (d = day(1)) => { const app = makeApp({ now: d, rng: () => 0.99 }); onboard(app); app.B.go('today'); return app; };
const doDay = (app, before = 4, after = 7) => {
  app.click('#program-start');
  app.setValue('#calm-before', before);
  app.click('#checkin-next');
  app.click('#pick-begin');
  app.click('#session-finish');
  app.setValue('#calm-after', after);
  app.click('#after-next');
};

test('AT29 three guided programmes are listed from the Calm tab', () => {
  const app = ready();
  app.click('[data-tab="play"]');
  app.click('#panel-breathe [data-tool="programs"]');
  assert.equal(app.B.currentScreen(), 'programs');
  const cards = [...app.document.querySelectorAll('#program-list [data-program]')];
  assert.deepEqual(cards.map((c) => c.getAttribute('data-program')), ['sleep', 'exam', 'burnout']);
  assert.match(cards[0].textContent, /Better sleep in 21 days/);
  assert.match(cards[1].textContent, /14 days · first 3 free/);
  const P = app.B.programs;
  assert.equal(P.sleep.days.length, 21);
  assert.equal(P.exam.days.length, 14);
  assert.equal(P.burnout.days.length, 21);
  for (const p of Object.values(P)) for (const d of p.days) assert.ok(app.B.techniques[d[2]], 'every day uses a real exercise: ' + d[2]);
});

test('AT29 one programme day a calendar day: the day runs the paired exercise and counts Calm gain', () => {
  const app = ready();
  app.B.openProgram('sleep');
  assert.match(app.$('#program-day-label').textContent, /Day 1 of 21/);
  assert.match(app.$('#program-day-tech').textContent, /Slow breeze/);
  doDay(app);
  const s = app.B.state();
  assert.equal(s.sessions.at(-1).technique, 'breeze');
  assert.deepEqual(JSON.parse(JSON.stringify(s.programs.sleep.done)), [1]);
  assert.match(app.$('#result-rewards').textContent, /Day 1 of 21 done/);
  app.B.openProgram('sleep');
  assert.equal(app.visible('#program-start'), false, 'day 2 waits for tomorrow');
  assert.match(app.$('#program-wait').textContent, /Day 2 opens tomorrow/);
  app.B.go('today');
  assert.equal(app.visible('#program-today'), true, 'Today shows the active programme');
  assert.match(app.$('#program-today').textContent, /Day 1 of 21 done/);
  app.B.setNow(day(2));
  app.B.openProgram('sleep');
  assert.match(app.$('#program-day-title').textContent, /Dim the last hour/);
});

test('AT29 days 1 to 3 are free; day 4 opens LoosenUp Plus, which unlocks it', () => {
  const app = ready();
  for (let d = 1; d <= 3; d++) { app.B.setNow(day(d)); app.B.openProgram('exam'); doDay(app); }
  app.B.setNow(day(4));
  app.B.openProgram('exam');
  assert.match(app.$('#program-start').textContent, /Unlock with LoosenUp Plus/);
  app.click('#program-start');
  assert.equal(app.visible('#shop-sheet'), true);
  assert.match(app.$('#shop-note').textContent, /Day 4 onwards/);
  app.click('[data-sku="fullbloomYear"]');
  app.click('#checkout-confirm');
  assert.equal(app.B.state().plan, 'fullbloom');
  app.B.openProgram('exam');
  assert.match(app.$('#program-start').textContent, /Start today's practice/);
  assert.match(app.$('#program-day-title').textContent, /Sleep is study time/);
});

test('AT29 LoosenUp Plus is ₹149 a month or ₹799 a year and lists the programmes', () => {
  const app = ready();
  app.B.openShop();
  const t = app.$('#shop-sheet').textContent.replace(/\s+/g, ' ');
  assert.match(t, /₹149\/mo or USD 4\.99\/mo/);
  assert.match(t, /₹799\/yr or USD 34\.99\/yr/);
  assert.match(t, /Exam calm/);
  assert.match(t, /DEMO checkout/);
});

test('AT29 finishing every day of a programme earns the Finisher badge', () => {
  const app = ready();
  app.B.setState({ plan: 'fullbloom' });
  for (let d = 1; d <= 14; d++) { app.B.setNow(day(d)); app.B.openProgram('exam'); doDay(app); }
  const s = app.B.state();
  assert.equal(s.programs.exam.done.length, 14);
  assert.ok(s.badges.includes('programme'));
  app.B.openProgram('exam');
  assert.match(app.$('#program-day-label').textContent, /All 14 days done/);
});
