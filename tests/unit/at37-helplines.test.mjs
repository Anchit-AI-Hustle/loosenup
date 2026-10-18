// One source for every helpline number: www/helplines.js feeds SOS, Find support, the safety plan
// and install.html, and every number written anywhere else must match it.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { makeApp, onboard, day, read } from '../helpers/app.mjs';

function source() {
  const ctx = { window: {} };
  vm.runInNewContext(read('www/helplines.js'), ctx);
  return ctx.window.LoosenUpHelplines;
}
const HL = source();
const digits = (s) => s.replace(/\D/g, '');
const FILES = ['www/index.html', 'www/install.html', 'www/partners.js', 'www/app.js', 'www/i18n.js', 'README.md'];

test('AT37 the helpline source holds the verified numbers', () => {
  assert.equal(HL.telemanas.number, '14416');
  assert.equal(HL.telemanas.tel, 'tel:14416');
  assert.equal(HL.icall.number, '9152987821');
  assert.equal(HL.icall.tel, 'tel:9152987821');
  assert.equal(HL.vandrevala.display, '+91 9999 666 555');
  assert.equal(HL.vandrevala.tel, 'tel:+919999666555');
  assert.equal(HL.vandrevala.whatsapp, 'https://wa.me/919999666555');
  assert.equal(HL.emergency.number, '112');
  assert.equal(HL.emergency.tel, 'tel:112');
  for (const k of ['telemanas', 'icall', 'vandrevala', 'emergency']) assert.match(HL.safetyPlanText, new RegExp(HL[k].display.replace(/\+/g, '\\+')));
});

test('AT37 every number written next to a helpline name matches the source', () => {
  const allowed = {
    'Tele[- ]MANAS': [HL.telemanas.number, digits(HL.telemanas.tollFree)],
    iCall: [HL.icall.number],
    Vandrevala: [digits(HL.vandrevala.number)],
  };
  const bad = [];
  let checked = 0;
  for (const f of FILES) {
    const text = read(f);
    for (const [name, ok] of Object.entries(allowed)) {
      const re = new RegExp(`${name}[^0-9\\n<]{0,60}?(\\+?\\d[\\d -]{1,16}\\d)`, 'g');
      for (const m of text.matchAll(re)) {
        const d = digits(m[1]);
        if (d.length < 3) continue; // "24x7", "20 languages"
        checked++;
        if (!ok.includes(d)) bad.push(`${f}: ${name} next to ${m[1]}`);
      }
    }
    assert.doesNotMatch(text, /25521111/, `${f} has the old iCall number`);
  }
  assert.deepEqual(bad, []);
  assert.ok(checked >= 10, `checked ${checked} numbers across the files`);
});

test('AT37 every phone, WhatsApp and helpline link in the page and install page comes from the source', () => {
  const known = new Set([HL.telemanas.tel, HL.vandrevala.tel, HL.icall.tel, HL.emergency.tel, HL.vandrevala.whatsapp, 'mailto:' + HL.icall.email, HL.elsewhere]);
  for (const f of ['www/index.html', 'www/install.html']) {
    const html = read(f);
    for (const m of html.matchAll(/href="((?:tel:|https:\/\/wa\.me\/|mailto:)[^"]*)"/g)) assert.ok(known.has(m[1]), `${f}: ${m[1]} is not in helplines.js`);
    for (const m of html.matchAll(/<a\b[^>]*>/g)) {
      const tag = m[0];
      if (/href="(tel:|https:\/\/wa\.me\/)/.test(tag)) assert.match(tag, /data-hl="/, `${f}: ${tag} should read its number from helplines.js`);
    }
  }
  assert.match(read('www/install.html'), /<script src="\/helplines\.js"><\/script>/);
  assert.match(read('www/sw.js'), /'\/helplines\.js'/, 'cached for offline use');
});

test('AT37 SOS, Find support and the safety plan use the source in the running app', () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  assert.equal(app.B.helplines, app.window.LoosenUpHelplines, 'the app reads the shared source');
  const resolve = (path) => {
    const [k, f] = path.split('.');
    if (f === 'mailto') return 'mailto:' + HL[k].email;
    return f ? HL[k][f] : HL[k];
  };
  const linked = [...app.document.querySelectorAll('[data-hl]')];
  assert.ok(linked.length >= 10);
  for (const el of linked) {
    if (el.id === 'sos-alert') continue; // texts the trusted person once one is set
    assert.equal(el.getAttribute('href'), resolve(el.getAttribute('data-hl')), el.outerHTML.slice(0, 80));
  }
  app.B.go('support');
  const help = app.$('#helpline-list').textContent;
  for (const k of ['telemanas', 'emergency']) assert.match(help, new RegExp(HL[k].number));
  app.B.go('safety');
  assert.equal(app.$('#sp-pros').value, HL.safetyPlanText);
  assert.match(app.$('#sp-pros').value, /iCall 9152987821/);
});
