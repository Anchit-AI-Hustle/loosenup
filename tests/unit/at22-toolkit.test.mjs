import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = (opts = {}) => {
  const app = makeApp({ now: day(1), rng: () => 0.99, ...opts });
  onboard(app);
  app.B.go('today');
  return app;
};

test('AT22 Today shows the toolkit and each tool opens its screen with a way back', () => {
  const app = ready();
  for (const t of ['support', 'safety', 'reframe', 'wellbeing']) {
    app.click(`#screen-today [data-tool="${t}"]`);
    assert.equal(app.B.currentScreen(), t);
    app.click(`#screen-${t} [data-back]`);
    assert.equal(app.B.currentScreen(), 'today');
  }
  app.click('#screen-today [data-tool="sounds"]');
  assert.equal(app.B.currentScreen(), 'play', 'Calm sounds opens the Sounds tab of Calm');
  assert.equal(app.visible('#panel-sounds'), true);
});

test('AT22 Find support lists verified helplines with working links', () => {
  const app = ready();
  app.B.go('support');
  const html = app.$('#screen-support').innerHTML;
  for (const href of ['tel:14416', 'tel:+919999666555', 'https://wa.me/919999666555', 'tel:02225521111', 'mailto:icall@tiss.edu', 'tel:112']) {
    assert.ok(html.includes(`href="${href}"`), href);
  }
  assert.match(app.$('#screen-support').textContent, /Psychiatrist[\s\S]*Clinical psychologist[\s\S]*Counsellor/);
});

test('AT22 near-me finder opens Apple Maps on iPhone and Google Maps elsewhere', () => {
  const iphone = ready({ ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1' });
  iphone.B.go('support');
  assert.equal(iphone.$('[data-near="psychiatrist"]').getAttribute('href'), 'https://maps.apple.com/?q=psychiatrist%20near%20me');
  const other = ready();
  other.B.go('support');
  assert.equal(other.$('[data-near="psychiatrist"]').getAttribute('href'), 'https://www.google.com/maps/search/psychiatrist+near+me');
});

test('AT22 my care team is saved on device with a call button', () => {
  const app = ready();
  app.B.go('support');
  app.setValue('#care-name-input', 'Dr. Rao');
  app.$('#care-role-input').value = 'Psychiatrist';
  app.setValue('#care-phone-input', '+91 98450 12345');
  app.setValue('#care-next-input', '2026-10-09T17:30');
  app.click('#care-save');
  const c = JSON.parse(JSON.stringify(app.B.state().careTeam));
  assert.deepEqual(c, { name: 'Dr. Rao', role: 'Psychiatrist', phone: '+919845012345', next: '2026-10-09T17:30' });
  assert.equal(app.visible('#care-view'), true);
  assert.equal(app.$('#care-call').getAttribute('href'), 'tel:+919845012345');
  assert.match(app.$('#care-next').textContent, /Next session/);
});

test('AT22 safety plan: prefilled helplines, saved on device, reachable from SOS', () => {
  const app = ready();
  app.click('#sos-btn');
  app.click('#support-sheet [data-tool="safety"]');
  assert.equal(app.B.currentScreen(), 'safety');
  assert.equal(app.visible('#support-sheet'), false);
  assert.match(app.$('#sp-pros').value, /Tele-MANAS 14416/);
  app.setValue('#sp-signs', 'Not sleeping, skipping meals');
  app.setValue('#sp-people', 'Meera +91 98765 43210');
  app.click('#sp-save');
  const plan = app.B.state().safetyPlan;
  assert.equal(plan.signs, 'Not sleeping, skipping meals');
  assert.equal(plan.people, 'Meera +91 98765 43210');
  app.B.go('today'); app.B.go('safety');
  assert.equal(app.$('#sp-signs').value, 'Not sleeping, skipping meals', 'plan reloads');
});

test('AT22 reframe: five steps, only the kinder thought can be kept', () => {
  const app = ready();
  app.B.go('reframe');
  app.setValue('#rf-situation', 'Missed a deadline at work zz-private');
  app.click('#rf-next');
  app.setValue('#rf-thought', 'I always mess things up zz-private');
  app.click('#rf-next');
  app.setValue('#rf-before', 8);
  app.click('#rf-next');
  app.setValue('#rf-friend', 'One slip does not define you');
  app.click('#rf-next');
  app.setValue('#rf-kinder', 'I slipped once and I handle most things well');
  app.setValue('#rf-after', 4);
  app.click('#rf-next');
  assert.match(app.$('#rf-result').textContent, /From 8 to 4/);
  app.click('#rf-keep');
  const s = app.B.state();
  assert.equal(s.goodThings.at(-1).text, 'Kinder thought: I slipped once and I handle most things well');
  assert.ok(!JSON.stringify(s).includes('zz-private'), 'situation and thought are never stored');
  assert.equal(s.reframes, 1);
});

test('AT22 reframe checks for crisis phrases and opens SOS', () => {
  const app = ready();
  app.B.go('reframe');
  app.setValue('#rf-situation', 'I want to end my life');
  assert.equal(app.visible('#support-sheet'), true);
  assert.equal(app.$('#rf-situation').value, '');
});

test('AT22 wellbeing check scores WHO-5 out of 100 and points to support when low', () => {
  const app = ready();
  app.B.go('wellbeing');
  assert.equal(app.document.querySelectorAll('.wb-item').length, 5);
  for (let q = 0; q < 5; q++) app.click(`[data-wb="${q}:2"]`);
  app.click('#wb-submit');
  assert.equal(app.$('#wb-score').textContent, '40');
  assert.match(app.$('#wb-note').textContent, /professional/);
  assert.equal(app.visible('#wb-support'), true);
  assert.equal(app.B.state().wellbeing.at(-1).score, 40);
  assert.match(app.$('#wb-trend').textContent, /40 \/ 100/);
});

test('AT22 a very low wellbeing score opens SOS; a bright one does not', () => {
  const low = ready();
  low.B.go('wellbeing');
  for (let q = 0; q < 5; q++) low.click(`[data-wb="${q}:1"]`);
  low.click('#wb-submit');
  assert.equal(low.$('#wb-score').textContent, '20');
  assert.equal(low.visible('#support-sheet'), true);
  const high = ready();
  high.B.go('wellbeing');
  for (let q = 0; q < 5; q++) high.click(`[data-wb="${q}:5"]`);
  high.click('#wb-submit');
  assert.equal(high.$('#wb-score').textContent, '100');
  assert.equal(high.visible('#wb-support'), false);
  assert.equal(high.visible('#support-sheet'), false);
});

test('AT22 the two-week check card shows when due', () => {
  const app = ready();
  app.B.setState({ sessions: [{ ts: 1, day: '2026-10-01', technique: 'sigh', context: 'Busy mind', before: 4, after: 6, gain: 2 }, { ts: 2, day: '2026-10-02', technique: 'sigh', context: 'Busy mind', before: 4, after: 6, gain: 2 }] });
  app.B.go('today');
  assert.equal(app.visible('#check-due'), true);
  app.B.setState({ wellbeing: [{ day: '2026-10-04', score: 64 }] });
  app.B.go('today');
  assert.equal(app.visible('#check-due'), false);
});

test('AT22 backup restores a LoosenUp file and rejects anything else', () => {
  const app = ready();
  const backup = JSON.stringify({ app: 'LoosenUp', version: '1.7.0', state: { name: 'Riya', seeds: 42, xp: 300, sessions: [], onboarded: true } });
  assert.equal(app.B.restoreBackup('{"hello":1}'), false);
  assert.match(app.$('#backup-status').textContent, /not a LoosenUp backup/);
  assert.equal(app.B.restoreBackup(backup), true);
  const s = app.B.state();
  assert.equal(s.name, 'Riya');
  assert.equal(s.seeds, 42);
  assert.ok(app.window.localStorage.getItem('loosenup.v1.before-restore'), 'previous data kept for undo');
});

test('AT22 sounds degrade kindly when audio is unavailable', () => {
  const app = ready();
  app.B.go('sounds');
  assert.equal(app.B.playSound('rain'), false);
  assert.match(app.$('#sound-status').textContent, /not available/);
});
