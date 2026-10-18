// Writes www/voice/manifest.json: every spoken line, its clip id, and which clips exist per language.
// Run after scripts/make_voice.py (or any time clips are added): node scripts/voice-manifest.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('..', import.meta.url).pathname;
const lines = JSON.parse(readFileSync(root + '.voice/lines.json', 'utf8'));
const id = (t) => createHash('sha1').update(t, 'utf8').digest('hex').slice(0, 12);
const have = {};
for (const lang of ['en', 'hi']) {
  const dir = root + 'www/voice/' + lang;
  have[lang] = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.m4a')).map((f) => f.slice(0, -4)).sort() : [];
}
const map = Object.fromEntries(lines.map((l) => [l.en, id(l.en)]).sort((a, b) => a[0].localeCompare(b[0])));
writeFileSync(root + 'www/voice/manifest.json', JSON.stringify({ voice: 'Anchit, recreated with Chatterbox Multilingual (MIT licence) from Anchit\'s own recording', lines: map, have }, null, 1) + '\n');
console.log('manifest:', Object.keys(map).length, 'lines;', have.en.length, 'English clips;', have.hi.length, 'Hindi clips');
