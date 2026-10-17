import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const BANNED = /\b(stress|anxiety|danger|fail|lose|lost|wilt|miss|guilt|pressure|late|bad|wrong)\b/i;
const ready = () => { const app = makeApp({ now: day(1), rng: () => 0.99 }); onboard(app); app.B.go('today'); return app; };

test('AT24 Learn lists nine one-minute lessons from the toolkit', () => {
  const app = ready();
  app.click('.toolkit [data-tool="learn"]');
  assert.equal(app.B.currentScreen(), 'learn');
  assert.equal(app.document.querySelectorAll('[data-lesson]').length, 9);
});

test('AT24 lesson copy is kind, free of banned words and makes no medical promises', () => {
  const { B } = makeApp({ now: day(1) });
  for (const l of B.lessons) {
    const all = [l.title, l.takeaway, l.tryLabel, ...l.body].join(' ');
    assert.equal(all.match(BANNED), null, `${l.id}: ${all.match(BANNED)}`);
    assert.ok(!/\b(cure|treat|treatment for|diagnos(e|is) you)\b/i.test(all), `${l.id} avoids medical claims`);
    assert.ok(l.body.length >= 3 && l.takeaway && l.tryLabel);
  }
  const friend = B.lessons.find((l) => l.id === 'friend');
  assert.match(friend.body.join(' '), /Are you thinking about ending your life\?/);
  assert.match(friend.body.join(' '), /14416/);
});

test('AT24 reading a lesson marks it read once and gives XP once', () => {
  const app = ready();
  const xp = app.B.state().xp;
  app.B.go('learn');
  app.click('[data-lesson="breath"]');
  assert.equal(app.B.currentScreen(), 'lesson');
  assert.match(app.$('#lesson-title').textContent, /long breath out/);
  assert.equal(app.document.querySelectorAll('#lesson-body p').length, 3);
  app.click('#lesson-back');
  app.click('[data-lesson="breath"]');
  assert.deepEqual(JSON.parse(JSON.stringify(app.B.state().lessonsDone)), ['breath']);
  assert.equal(app.B.state().xp, xp + 2);
});

test('AT24 Try it opens the matching break, tool or space', () => {
  const app = ready();
  app.B.openLesson('breath');
  app.click('#lesson-try');
  assert.equal(app.B.currentScreen(), 'checkin');
  app.click('#checkin-next');
  assert.equal(app.B.currentScreen(), 'pick');
  assert.equal(app.$('#pick-name').textContent, 'Sigh of relief');
  assert.match(app.$('#pick-reason').textContent, /From your lesson/);
  app.B.openLesson('thoughts');
  app.click('#lesson-try');
  assert.equal(app.B.currentScreen(), 'reframe');
  app.B.openLesson('work');
  app.click('#lesson-try');
  assert.equal(app.B.currentScreen(), 'checkin');
  assert.match(app.$('#checkin-step').textContent, /Work/);
  app.B.openLesson('help');
  app.click('#lesson-try');
  assert.equal(app.B.currentScreen(), 'support');
});
