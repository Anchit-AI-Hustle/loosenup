import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = (d = day(3)) => { const app = makeApp({ now: d, rng: () => 0.99 }); onboard(app); app.B.go('today'); return app; };

test('AT34 every kind of emotion can be logged, with an intensity of 1 to 3', () => {
  const app = ready();
  const names = [...app.document.querySelectorAll('#emotions .emo-name')].map((e) => e.textContent);
  for (const n of ['Angry', 'Worried', 'Sad', 'Tired', 'Lonely', 'Overwhelmed', 'Frustrated', 'Restless', 'Calm', 'Happy', 'Grateful', 'Hopeful', 'Loved', 'Energetic']) assert.ok(names.includes(n), n);
  app.click('[data-emotion="angry"]');
  app.click('[data-emotion="angry"]');
  const b = app.$('[data-emotion="angry"]');
  assert.equal(b.getAttribute('data-level'), '2');
  assert.equal(b.getAttribute('aria-label'), 'Angry, quite');
  assert.equal(b.querySelectorAll('.emo-dots i.on').length, 2);
  app.click('[data-emotion="angry"]'); app.click('[data-emotion="angry"]');
  assert.equal(app.$('[data-emotion="angry"]').getAttribute('data-level'), '0', 'a fourth tap clears it');
});

test('AT34 the strongest difficult emotion suggests a matching exercise in one tap', () => {
  const app = ready();
  app.click('[data-emotion="happy"]');
  assert.equal(app.visible('#emo-suggest'), false, 'positive emotions need no fix');
  app.click('[data-emotion="worried"]');
  app.click('[data-emotion="angry"]'); app.click('[data-emotion="angry"]');
  assert.equal(app.visible('#emo-suggest'), true);
  assert.equal(app.$('#emo-suggest-btn').textContent, 'Try Cool down');
  app.click('#emo-suggest-btn');
  assert.equal(app.B.currentScreen(), 'checkin');
  app.click('#checkin-next');
  assert.equal(app.$('#pick-name').textContent, 'Cool down');
});

test('AT34 Progress shows each emotion over the week, with a trend against the week before', () => {
  const app = ready(day(10));
  app.B.setState({ emotions: [
    { day: '2026-10-06', e: { angry: 3, happy: 1 } }, { day: '2026-10-07', e: { angry: 3 } },
    { day: '2026-10-11', e: { angry: 1, happy: 2 } }, { day: '2026-10-13', e: { happy: 3, worried: 1 } },
  ] });
  app.B.go('progress');
  const rows = [...app.document.querySelectorAll('#emo-stats .emo-row')].map((r) => r.textContent);
  assert.match(rows[0], /Happy/);
  assert.match(rows.join(' '), /Angry.*1 day · easing/);
  assert.match(rows.join(' '), /Happy.*2 days · more/);
  assert.equal(app.visible('#emo-empty'), false);
});
