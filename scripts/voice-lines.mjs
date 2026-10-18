// Lists every line the voice guide speaks, in English and Hindi, as JSON.
// Used by scripts/make_voice.py to record the clips and by the tests to check coverage.
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const root = new URL('..', import.meta.url).pathname;
const read = (f) => readFileSync(root + f, 'utf8');
const dom = new JSDOM(read('www/index.html').replace(/<script\b[^>]*src=[^>]*><\/script>/g, ''), { url: 'https://loosenup.test/', runScripts: 'outside-only', pretendToBeVisual: true });
dom.window.eval(read('www/i18n.js'));
dom.window.eval(read('www/partners.js'));
dom.window.eval(read('www/app.js'));
const B = dom.window.LoosenUp;
const lines = new Set(B.voiceLines());
const tr = dom.window.LoosenUpI18n.tr;
const out = [...lines].map((en) => ({ en, hi: tr(en) }));
const missing = out.filter((l) => l.hi === l.en);
if (missing.length) { console.error('No Hindi for:', missing.map((l) => l.en)); process.exit(1); }
process.stdout.write(JSON.stringify(out, null, 1));
dom.window.close();
