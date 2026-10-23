import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = () => { const app = makeApp({ now: day(1), rng: () => 0.99 }); onboard(app); app.B.go('today'); return app; };

test('AT42 the journal saves only on Save, stays on the phone, can be deleted, and still opens SOS for crisis words', () => {
  const app = ready();
  app.click('#screen-today [data-more="journal"]');
  assert.equal(app.B.currentScreen(), 'journal');
  assert.ok(app.$('#journal-prompt').textContent.length > 10);
  app.setValue('#journal-text', 'Work felt heavy but the walk helped.');
  assert.equal((app.B.state().journal || []).length, 0, 'nothing saved while typing');
  app.click('#journal-save');
  assert.equal(app.B.state().journal.length, 1);
  assert.match(app.$('#journal-list').textContent, /the walk helped/);
  app.click('[data-jdel]');
  assert.equal(app.B.state().journal.length, 0);
  app.setValue('#journal-text', 'I want to end my life');
  app.click('#journal-save');
  assert.equal(app.visible('#support-sheet'), true, 'SOS opens');
});

test('AT42 Support a friend: notice, listen, ask directly, get help together, with one-tap sharing', async () => {
  const app = ready();
  let shared = '';
  app.window.navigator.share = (d) => { shared = d.text; return Promise.resolve(); };
  app.click('#screen-today [data-more="friend"]');
  const t = app.$('#screen-friend').textContent;
  for (const s of ['Notice', 'Listen without fixing', 'Ask directly', 'Get help together', '14416', '112']) assert.ok(t.includes(s), s);
  app.click('#friend-share');
  await new Promise((r) => setTimeout(r, 10));
  assert.match(shared, /Tele-MANAS 14416/);
  assert.match(shared, /9152987821/);
});

test('AT42 seasonal packs: the in-season pack is highlighted and on Today, and each item opens', () => {
  const app = ready();
  const M = app.window.LoosenUpMore;
  assert.equal(M.inSeason().id, 'festivals', 'October is festival season');
  assert.ok(app.$('#screen-today .season-card'), 'season card on Today');
  app.click('#screen-today .season-card');
  assert.equal(app.B.currentScreen(), 'packs');
  assert.equal(app.document.querySelectorAll('#pack-list .pack-card').length, 4);
  assert.ok(app.$('#pack-list .pack-card.now'));
  app.click('#pack-list .pack-card.now [data-pack-item="practice:cooldown"]');
  assert.equal(app.B.currentScreen(), 'checkin');
});
