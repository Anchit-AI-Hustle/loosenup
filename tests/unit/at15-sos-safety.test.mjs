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
  for (const s of ['checkin', 'today', 'play', 'progress', 'me']) {
    app.B.go(s);
    assert.ok(app.visible('#sos-btn'), `SOS visible on ${s}`);
  }
});

test('AT15 SOS sheet: three large ranked actions, one grounding line, everything else under More options', () => {
  const app = ready();
  app.click('#sos-btn');
  const sheet = app.$('#support-sheet');
  const actions = [...sheet.children].filter((e) => e.classList.contains('sos-action'));
  assert.deepEqual(actions.map((a) => a.id), ['sos-call', 'sos-alert', 'sos-112'], 'Tele-MANAS, then text, then 112');
  assert.equal(actions[0].getAttribute('href'), 'tel:14416');
  assert.match(actions[0].textContent, /Call Tele-MANAS 14416/);
  assert.equal(actions[1].getAttribute('href'), 'https://wa.me/919999666555', 'no trusted person yet, so text Vandrevala on WhatsApp');
  assert.match(actions[1].textContent, /Text Vandrevala on WhatsApp/);
  assert.equal(actions[2].getAttribute('href'), 'tel:112');
  assert.ok(actions[2].classList.contains('btn-sos'), '112 uses the SOS colour');
  assert.equal(sheet.querySelectorAll('.sos-ground p').length, 1, 'one grounding line');
  const more = app.$('#sos-more');
  assert.equal(more.tagName, 'DETAILS');
  assert.equal(more.open, false, 'More options starts folded');
  for (const sel of ['[data-tool="safety"]', '[data-tool="support"]', 'a[href="https://findahelpline.com"]', '#sos-add-trusted', '#sos-org', '#sos-location']) {
    assert.ok(more.querySelector(sel), sel + ' is folded under More options');
  }
  const loose = [...sheet.querySelectorAll('a, button')].filter((e) => !more.contains(e)).map((e) => e.id);
  assert.deepEqual(loose, ['sos-breathe', 'sos-call', 'sos-alert', 'sos-112', 'support-close'], 'nothing else competes on the first view');
  assert.equal(sheet.querySelector('input'), null, 'no trusted-person form inside the crisis sheet');
  app.click('#sos-breathe');
  assert.equal(app.B.currentScreen(), 'session', 'Breathe now starts straight away');
  assert.equal(app.visible('#support-sheet'), false);
});

test('AT15 the trusted person is set up in Me, then SOS texts them in one tap', () => {
  const app = ready();
  app.click('#sos-btn');
  app.click('#sos-add-trusted');
  assert.equal(app.B.currentScreen(), 'me');
  assert.equal(app.visible('#support-sheet'), false);
  assert.equal(app.$('#screen-me article').id, 'trusted-card', 'the trusted person is the first card in Me');
  app.setValue('#trusted-name', 'Meera');
  app.setValue('#trusted-phone', '+91 98765 43210');
  app.click('#trusted-save');
  const s = app.B.state();
  assert.deepEqual(JSON.parse(JSON.stringify(s.trusted)), { name: 'Meera', phone: '+919876543210' });
  assert.equal(app.visible('#trusted-setup'), false);
  assert.match(app.$('#me-trusted').textContent, /Meera/);
  app.click('#sos-btn');
  const a = app.$('#sos-alert');
  assert.match(a.textContent, /Text Meera now/);
  const href = a.getAttribute('href');
  assert.match(href, /^sms:\+919876543210\?&body=/);
  const body = decodeURIComponent(href.split('body=')[1]);
  assert.match(body, /could really use you right now/);
  assert.match(body, /call me/i);
  assert.equal(app.$('#sos-whatsapp').hidden, false, 'Vandrevala WhatsApp stays one fold away');
  assert.equal(app.$('#sos-add-trusted').hidden, true);
  app.click('#trusted-edit');
  assert.equal(app.visible('#trusted-setup'), true);
  assert.equal(app.$('#trusted-name').value, 'Meera');
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
