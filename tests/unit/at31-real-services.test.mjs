import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day } from '../helpers/app.mjs';

const ready = () => { const app = makeApp({ now: day(1) }); onboard(app); app.B.go('support'); return app; };
const P = () => ready().window.LoosenUpPartners;

test('AT31 the services list is real, checked and well formed', () => {
  const p = P();
  assert.match(p.checked, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(p.online.length >= 8, 'at least 8 online services');
  const cities = new Set(p.offline.map((o) => o.city));
  for (const c of ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi']) assert.ok(cities.has(c), c);
  for (const o of p.online) {
    assert.match(o.url, /^https:\/\//, o.id);
    assert.ok(o.name && o.desc && o.type && o.price, o.id);
  }
  for (const o of p.offline) {
    assert.match(o.url, /^https:\/\//, o.id);
    assert.ok(o.lat > 6 && o.lat < 37 && o.lon > 68 && o.lon < 98, o.id + ' sits inside India');
  }
  assert.ok(p.online.some((o) => o.id === 'tele-manas'), 'Tele MANAS is listed');
});

test('AT31 online services can be filtered, and each links out to book', () => {
  const app = ready();
  const all = app.document.querySelectorAll('#partner-list .partner').length;
  assert.equal(all, app.window.LoosenUpPartners.online.length);
  app.click('[data-pfilter="free"]');
  const free = [...app.document.querySelectorAll('#partner-list .partner')];
  assert.ok(free.length >= 3 && free.length < all);
  assert.ok(free.every((c) => /Free/.test(c.textContent)));
  app.click('[data-pfilter="psychiatry"]');
  assert.ok([...app.document.querySelectorAll('#partner-list .partner')].every((c) => /psychiatry/i.test(c.textContent)));
  app.click('[data-pfilter="hindi"]');
  assert.ok([...app.document.querySelectorAll('#partner-list .partner')].every((c) => /Hindi/.test(c.textContent)));
  const a = app.$('#partner-list .partner a');
  assert.equal(a.getAttribute('target'), '_blank');
  assert.match(app.$('#partner-note').textContent, /not paid by these services/);
});

test('AT31 in person: location picks the nearest listed city and sorts by distance, on the phone only', () => {
  const app = ready();
  let sent = 0;
  app.window.fetch = async () => { sent++; return { ok: true, json: async () => ({}) }; };
  app.B.useLocation({ lat: 12.97, lon: 77.59 });
  assert.match(app.$('#inperson-status').textContent, /Showing Bengaluru/);
  assert.equal(app.$('#inperson-city').value, 'Bengaluru');
  const kms = [...app.document.querySelectorAll('#inperson-list .partner-meta')].map((m) => parseFloat(m.textContent.match(/([\d.]+) km/)[1]));
  assert.ok(kms.length >= 2);
  assert.deepEqual(kms, [...kms].sort((a, b) => a - b), 'nearest first');
  assert.equal(sent, 0, 'location never leaves the phone');
  const dir = app.$('#inperson-list a[href*="dir"], #inperson-list a[href*="daddr"]');
  assert.ok(dir, 'directions link');
  app.B.useLocation({ lat: 51.5, lon: -0.12 });
  assert.match(app.$('#inperson-status').textContent, /No listed city is close by/);
});

test('AT31 choosing a city lists its places with call and directions', () => {
  const app = ready();
  const sel = app.$('#inperson-city');
  sel.value = 'Chandigarh';
  sel.dispatchEvent(new app.window.Event('change'));
  const cards = [...app.document.querySelectorAll('#inperson-list .partner')];
  assert.ok(cards.length >= 2);
  assert.match(cards.map((c) => c.textContent).join(' '), /PGIMER/);
  assert.ok(app.$('#inperson-list a[href^="tel:"]'), 'a call button where a phone is published');
});
