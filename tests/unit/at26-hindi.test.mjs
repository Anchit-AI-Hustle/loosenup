import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day, read } from '../helpers/app.mjs';
import { walkAll, leftovers } from '../helpers/hindi-walk.mjs';

const textOf = (el) => el.textContent.replace(/\s+/g, ' ').trim();
const pageText = (doc) => { const c = doc.body.cloneNode(true); c.querySelector('#toast')?.remove(); return textOf(c); };

test('AT26 in Hindi, every screen, tool, lesson, game and sheet shows Hindi (brand words stay English)', async () => {
  const { seen, app } = await walkAll({ lang: 'hi' });
  const left = [...seen.keys()].filter(leftovers);
  assert.deepEqual(left, [], 'English left on screen in Hindi mode');
  assert.ok(seen.size > 500, 'walked the whole app');
  assert.deepEqual(app.errors, []);
  assert.equal(app.document.documentElement.getAttribute('lang'), 'hi');
});

test('AT26 Hindi keeps the locked brand words: Calm gain, Seeds, Sunny days, LoosenUp', async () => {
  const { seen } = await walkAll({ lang: 'hi' });
  const all = [...seen.keys()].join('\n');
  for (const w of ['Calm gain', 'Seeds', 'Sunny days', 'LoosenUp', 'Full Bloom', 'Sigh of relief', 'Tele-MANAS']) assert.ok(all.includes(w), w);
  assert.match(all, /[ऀ-ॿ]/, 'Devanagari text is shown');
});

test('AT26 switching back to English restores every word exactly', () => {
  const app = makeApp({ now: day(1), rng: () => 0.01 });
  onboard(app);
  app.B.go('today');
  const en = pageText(app.document);
  app.B.setLang('hi');
  const hi = pageText(app.document);
  assert.notEqual(hi, en);
  assert.match(textOf(app.$('#screen-today')), /शांत ब्रेक/);
  app.B.setLang('en');
  app.B.go('today');
  assert.equal(pageText(app.document), en);
  assert.equal(app.document.documentElement.getAttribute('lang'), 'en');
});

test('AT26 the language choice is on Welcome and Me, and is remembered', () => {
  const app = makeApp({ now: day(1) });
  assert.ok(app.$('#screen-welcome [data-lang-choice="hi"]'), 'Welcome offers Hindi');
  app.click('#screen-welcome [data-lang-choice="hi"]');
  assert.equal(app.B.state().lang, 'hi');
  assert.equal(textOf(app.$('#welcome-title')), 'स्वागत है। एक साँस लें।');
  const again = makeApp({ now: day(1), state: app.B.state() });
  assert.equal(textOf(again.$('#welcome-title')), 'स्वागत है। एक साँस लें।', 'Hindi on next launch');
  onboard(again);
  again.B.go('me');
  assert.equal(again.$('#screen-me [data-lang-choice="hi"]').getAttribute('aria-pressed'), 'true');
  assert.equal(textOf(again.$('#screen-me [data-lang-choice="en"]')), 'English', 'language names are never translated');
});

test('AT26 the voice guide speaks Hindi with a Hindi voice', () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  const spoken = [];
  app.window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  app.window.speechSynthesis = { speak: (u) => spoken.push({ text: u.text, lang: u.lang }), cancel: () => {} };
  onboard(app);
  app.B.setLang('hi');
  app.click('[data-context="Hard to focus"]');
  app.click('#checkin-next');
  app.click('[data-guide="voice"]');
  app.click('#pick-begin');
  assert.equal(spoken[0].lang, 'hi-IN');
  assert.match(spoken[0].text, /चलिए शुरू करें/);
  assert.equal(spoken[1].text, 'साँस लें');
});

test('AT26 Hindi and Hinglish crisis phrases open SOS; everyday Hindi does not', () => {
  const app = makeApp({ now: day(1) });
  const crisis = [
    'मैं आत्महत्या के बारे में सोच रहा हूँ', 'खुदकुशी कर लूँ', 'मैं मरना चाहती हूँ', 'अब जीना नहीं चाहता', 'जीने का मन नहीं करता',
    'खुद को नुकसान पहुँचाना चाहता हूँ', 'अपनी जान ले लूँगी', 'ज़िंदगी ख़त्म कर दूँ', 'mai marna chahta hu', 'khudkushi ka mann',
    'jeena nahi chahti', 'khud ko nuksan', 'apni jaan le lunga', 'zindagi khatam karni hai', 'aatmahatya'
  ];
  for (const c of crisis) assert.equal(app.B.isCrisis(c), true, c);
  const everyday = ['आज मन उदास है', 'नींद नहीं आ रही', 'काम बहुत है', 'aaj mann udaas hai', 'mujhe neend nahi aati', 'jaan pehchan wale log'];
  for (const e of everyday) assert.equal(app.B.isCrisis(e), false, e);
  onboard(app);
  app.B.setLang('hi');
  app.B.go('today');
  app.setValue('#good-text', 'मैं मरना चाहता हूँ');
  assert.equal(app.$('#support-sheet').hidden, false, 'SOS opens from Hindi text');
  assert.match(textOf(app.$('#support-sheet')), /14416/);
  assert.match(textOf(app.$('#support-sheet')), /आप अकेले नहीं हैं/);
});

test('AT26 the SOS message to a trusted person is written in Hindi', () => {
  const app = makeApp({ now: day(1), state: undefined });
  onboard(app);
  app.B.setLang('hi');
  app.B.setState({ trusted: { name: 'Meera', phone: '+919876543210' } });
  const body = decodeURIComponent(app.B.sosHref().split('body=')[1]);
  assert.match(body, /^नमस्ते Meera, मैं Asha हूँ।/);
  assert.match(body, /तुम्हारी ज़रूरत है/);
});

test('AT26 Hindi copy has no dashes, no Hindi forms of the banned words, and no empty entries', () => {
  const src = read('www/i18n.js');
  assert.doesNotMatch(src, /[\u2013\u2014]/);
  const app = makeApp({ now: day(1) });
  const values = Object.values(app.window.LoosenUpI18n.hi);
  assert.ok(values.length > 500, 'a full dictionary');
  for (const v of values) assert.ok(v && v.trim(), 'empty translation');
  const BANNED_HI = ['तनाव', 'चिंता', 'खतरा', 'ख़तरा', 'असफल', 'नाकाम', 'अपराधबोध', 'दबाव', 'देर', 'बुरा', 'बुरी', 'गलत', 'ग़लत', 'मुरझा'];
  const words = new Set(values.join(' ').split(/[\s,.।!?:;()"]+/));
  assert.deepEqual(BANNED_HI.filter((w) => words.has(w)), []);
});
