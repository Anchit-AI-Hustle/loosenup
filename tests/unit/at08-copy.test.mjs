import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, makeApp, onboard, day } from '../helpers/app.mjs';

const BANNED = ['stress', 'anxiety', 'danger', 'fail', 'lose', 'lost', 'wilt', 'miss', 'guilt', 'pressure', 'late', 'bad', 'wrong'];
const BANNED_RE = new RegExp(`\\b(${BANNED.join('|')})\\b`, 'i');
const DASH_RE = /[\u2013\u2014]/;

const SKIP_DIRS = new Set(['node_modules', '.git', '.venv', '.voice', '.agents', '.claude', 'build', '.gradle', 'Pods', 'DerivedData', '.idea', 'xcuserdata', 'screenshots', '.build', 'SourcePackages']);
const TEXT_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.md', '.txt', '.xml', '.gradle', '.kts', '.java', '.kt', '.swift', '.plist', '.yml', '.yaml', '.py', '.properties', '.pro', '.storyboard', '.xcconfig', '.pbxproj', '.gitignore', '.vercelignore', '']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith('DerivedData')) continue;
    const p = path.join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (TEXT_EXT.has(path.extname(name)) && st.size < 2_000_000) out.push(p);
  }
  return out;
}

const COPY_FILES = [
  'www/index.html', 'www/install.html', 'www/teams.html', 'www/org.html', 'api/org.js', 'api/push.js', 'api/plus.js', 'www/app.js', 'www/more.js', 'www/sleep.js', 'www/more.css', 'www/plus.html', 'www/plus-checkout.js', 'www/terms.html', 'www/privacy.html', 'www/refunds.html', 'www/i18n.js', 'www/styles.css', 'www/sw.js', 'www/manifest.json',
  'README.md', 'capacitor.config.json', 'android/app/src/main/res/values/strings.xml',
].filter((f) => existsSync(path.join(ROOT, f)));

test('AT8 no banned words (whole-word) in any UI copy file', () => {
  const hits = [];
  for (const f of COPY_FILES) {
    readFileSync(path.join(ROOT, f), 'utf8').split('\n').forEach((line, i) => {
      const m = line.match(BANNED_RE);
      if (m) hits.push(`${f}:${i + 1} "${m[1]}"`);
    });
  }
  assert.deepEqual(hits, []);
  assert.ok(COPY_FILES.length >= 6, 'scanned the app copy files');
});

test('AT8 rendered UI text on every screen has no banned words', () => {
  const app = makeApp({ now: day(1), rng: () => 0.01 });
  const texts = [];
  const grab = () => texts.push(app.document.body.textContent);
  grab();
  onboard(app); grab();
  app.setValue('#calm-before', 8);
  app.click('[data-context="Big moment ahead"]');
  app.click('#checkin-next'); grab();
  app.click('#pick-begin'); grab();
  app.click('#session-finish');
  app.setValue('#calm-after', 3);
  app.click('#after-next'); grab();
  app.click('#result-done');
  for (const t of ['today', 'play', 'progress', 'me']) { app.click(`[data-tab="${t}"]`); grab(); }
  for (const g of ['pairs', 'catch', 'bloom']) { app.B.openGame(g); app.B.finishCurrentGame(); grab(); }
  app.B.go('today');
  app.B.openShop(); grab();
  const attrs = [...app.document.querySelectorAll('[aria-label],[placeholder],[title]')]
    .map((e) => [e.getAttribute('aria-label'), e.getAttribute('placeholder'), e.getAttribute('title')].join(' '));
  const all = texts.join(' ') + ' ' + attrs.join(' ');
  const m = all.match(BANNED_RE);
  assert.equal(m, null, m ? `banned word "${m[1]}" rendered` : '');
});

test('AT8 no em or en dashes in any repo file', () => {
  const files = walk(ROOT);
  const hits = [];
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    if (DASH_RE.test(text)) hits.push(path.relative(ROOT, f));
  }
  assert.ok(files.length > 10, 'scanned the repo');
  assert.deepEqual(hits, []);
});

test('AT8 plain wellbeing vocabulary: core terms present, no garden or currency theme in the app', () => {
  const html = readFileSync(path.join(ROOT, 'www/index.html'), 'utf8');
  const js = readFileSync(path.join(ROOT, 'www/app.js'), 'utf8');
  const all = html + js;
  for (const w of ['LoosenUp', 'LoosenUp Plus', 'Calm gain', 'day streak', 'rest day', 'Daily reminder', 'Sigh of relief', 'Slow breeze',
    'Here and now', 'Soft release', 'Let it out', 'Quick breeze', 'Progress']) {
    assert.ok(all.toLowerCase().includes(w.toLowerCase()), `vocabulary: ${w}`);
  }
  for (const w of ['Seedling', 'Sprout', 'Meadow', 'Full Bloom', 'Sunny days', 'Rain day', 'Golden hour', 'Seed shop', 'your garden']) {
    assert.ok(!html.includes(w), `retired in the markup: ${w}`);
  }
  assert.ok(html.includes('A wellbeing companion, not medical care.'));
});
