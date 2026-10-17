import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = (now = day(1)) => {
  const app = makeApp({ now, rng: () => 0.99 });
  onboard(app);
  app.B.go('today');
  return app;
};

test('AT15 SOS button is reachable from every screen, even before onboarding', () => {
  const app = makeApp({ now: day(1) });
  assert.ok(app.visible('#sos-btn'), 'visible on welcome');
  app.click('#sos-btn');
  assert.equal(app.visible('#support-sheet'), true);
  app.click('#support-close');
  onboard(app);
  for (const s of ['checkin', 'today', 'play', 'garden', 'week', 'me']) {
    app.B.go(s);
    assert.ok(app.visible('#sos-btn'), `SOS visible on ${s}`);
  }
});

test('AT15 SOS sheet offers helplines, a breather and trusted-person setup', () => {
  const app = ready();
  app.click('#sos-btn');
  const t = app.$('#support-sheet').textContent;
  assert.match(t, /14416/);
  assert.match(t, /112/);
  assert.match(t, /findahelpline\.com/);
  assert.ok(app.$('#support-sheet a[href="tel:14416"]'));
  assert.ok(app.$('#support-sheet a[href="tel:112"]'));
  assert.equal(app.visible('#trusted-setup'), true, 'no trusted person yet, so setup shows');
  app.click('#sos-breathe');
  assert.equal(app.B.currentScreen(), 'session');
  assert.equal(app.B.state().seeds, 5, 'SOS breather never costs a Seed');
});

test('AT15 trusted person is saved on device and the alert pre-fills a message', () => {
  const app = ready();
  app.click('#sos-btn');
  app.setValue('#trusted-name', 'Meera');
  app.setValue('#trusted-phone', '+91 98765 43210');
  app.click('#trusted-save');
  const s = app.B.state();
  assert.deepEqual(JSON.parse(JSON.stringify(s.trusted)), { name: 'Meera', phone: '+919876543210' });
  assert.equal(app.visible('#trusted-setup'), false);
  const a = app.$('#sos-alert');
  assert.match(a.textContent, /Message Meera/);
  const href = a.getAttribute('href');
  assert.match(href, /^sms:\+919876543210\?&body=/);
  const body = decodeURIComponent(href.split('body=')[1]);
  assert.match(body, /could really use you right now/);
  assert.match(body, /call me/i);
});

test('AT15 SOS alert can include a location link only when asked', () => {
  const app = ready();
  app.B.setState({ trusted: { name: 'Meera', phone: '+919876543210' } });
  const plain = decodeURIComponent(app.B.sosHref(null).split('body=')[1]);
  assert.ok(!/maps/.test(plain));
  const withLoc = decodeURIComponent(app.B.sosHref({ lat: 12.97161, lon: 77.59456 }).split('body=')[1]);
  assert.match(withLoc, /https:\/\/maps\.google\.com\/\?q=12\.97161,77\.59456/);
  assert.ok(!JSON.stringify(app.B.state()).includes('12.97'), 'location is never stored');
});

test('AT15 crisis phrases in the Good things jar open the support sheet and are not saved', () => {
  const app = ready();
  app.click('#jar-add');
  app.setValue('#good-text', 'nothing matters, I want to die');
  assert.equal(app.visible('#support-sheet'), true);
  assert.equal(app.B.state().goodThings.length, 0);
});

test('AT15 lowest mood asks a direct, gentle safety question', () => {
  const app = ready();
  app.click('[data-mood="1"]');
  assert.equal(app.visible('#safety-sheet'), true);
  assert.match(app.$('#safety-sheet').textContent, /thoughts of ending your life or hurting yourself/);
  app.click('#safety-yes');
  assert.equal(app.visible('#support-sheet'), true, 'Yes goes straight to SOS');
});

test('AT15 answering no to the safety question offers gentle next steps', () => {
  const app = ready();
  app.click('[data-mood="1"]');
  app.click('#safety-no');
  assert.equal(app.visible('#safety-sheet'), false);
  assert.match(app.$('#mood-done').textContent, /Kind words|Small step/);
});

test('AT15 three heavy days in a row surface a support card', () => {
  const app = ready(day(3));
  app.B.setState({ moods: [{ day: '2026-10-05', mood: 2 }, { day: '2026-10-06', mood: 1 }, { day: '2026-10-07', mood: 2 }] });
  app.B.go('today');
  assert.equal(app.visible('#support-card'), true);
  assert.match(app.$('#support-card').textContent, /carry/);
  app.click('#support-card-sos');
  assert.equal(app.visible('#support-sheet'), true);
});

test('AT15 lighter days do not show the support card', () => {
  const app = ready(day(3));
  app.B.setState({ moods: [{ day: '2026-10-05', mood: 2 }, { day: '2026-10-06', mood: 4 }, { day: '2026-10-07', mood: 2 }] });
  app.B.go('today');
  assert.equal(app.visible('#support-card'), false);
});
