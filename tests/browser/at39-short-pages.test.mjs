// Shorter pages and one-tap calm in a real browser on a 390 x 844 phone, light and dark:
// Today stays under 120 words above the fold, Find support's first screen under 60,
// the three SOS actions fit the first view, and Breathe now reaches the breath in one tap.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from '../helpers/serve.mjs';

let server, browser;
before(async () => { server = await startServer(0); browser = await chromium.launch(); });
after(async () => { await browser?.close(); await server?.close(); });

// Words in visible text whose line starts above the fold.
const wordsAboveFold = (page, sel) => page.evaluate((s) => {
  const root = document.querySelector(s);
  const H = window.innerHeight;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n, words = 0;
  const range = document.createRange();
  while ((n = w.nextNode())) {
    const el = n.parentElement;
    if (!/\S/.test(n.data) || el.closest('[hidden], svg, .sr-only')) continue;
    const fold = el.closest('details:not([open])');
    if (fold && !el.closest('summary')) continue; // folded: not on screen
    range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    if (!r.width || !r.height || r.top >= H || r.bottom <= 0) continue;
    words += n.data.trim().split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x)).length;
  }
  return words;
}, sel);

async function onboarded(scheme, lang = 'en') {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: scheme, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(server.url + '/');
  if (lang === 'hi') await page.click('#screen-welcome [data-lang-choice="hi"]');
  await page.fill('#name-input', 'Asha');
  await page.click('#welcome-go');
  await page.evaluate(() => window.LoosenUp.go('today'));
  await page.waitForTimeout(300);
  return { ctx, page, errors };
}

for (const scheme of ['light', 'dark']) {
  test(`AT39 Today is under 120 words above the fold and Find support's first screen under 60 (${scheme})`, async () => {
    const { ctx, page, errors } = await onboarded(scheme);
    const today = await wordsAboveFold(page, '#screen-today');
    assert.ok(today > 20 && today < 120, `Today shows ${today} words above the fold`);
    const streaks = await page.evaluate(() => (document.querySelector('#screen-today').innerText.match(/in a row|streak/gi) || []).length);
    assert.ok(streaks <= 1, `the streak shows ${streaks} times on Today`);
    assert.ok(await page.isVisible('#breathe-now'));
    assert.ok(await page.isVisible('#mood-card .moods'));
    const gamesTop = await page.evaluate(() => document.querySelector('.game-row').getBoundingClientRect().top);
    assert.ok(gamesTop < 844, 'the games row starts on the first screen');
    await page.evaluate(() => window.LoosenUp.go('support'));
    await page.waitForTimeout(300);
    const support = await wordsAboveFold(page, '#screen-support');
    assert.ok(support > 15 && support < 60, `Find support shows ${support} words on its first screen`);
    const closed = await page.evaluate(() => [...document.querySelectorAll('#screen-support details.fold')].filter((d) => !d.open).length);
    assert.equal(closed, 5, 'the five long guides are folded');
    await page.click('#book-card summary');
    assert.ok(await page.isVisible('#partner-list .partner, #partner-list > *'), 'a folded guide opens on tap');
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  test(`AT39 the three ranked SOS actions fit the first view, and Breathe now is one tap (${scheme})`, async () => {
    const { ctx, page, errors } = await onboarded(scheme);
    await page.click('#sos-btn');
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ['sos-call', 'sos-alert', 'sos-112'].map((id) => {
      const b = document.getElementById(id).getBoundingClientRect();
      return { id, top: b.top, bottom: b.bottom, h: b.height };
    }));
    for (const x of r) {
      assert.ok(x.h >= 64, `${x.id} is a large target (${x.h}px)`);
      assert.ok(x.bottom <= 844, `${x.id} is on the first view (bottom ${Math.round(x.bottom)})`);
    }
    assert.ok(r[0].top < r[1].top && r[1].top < r[2].top, 'ranked top to bottom');
    assert.equal(await page.isVisible('#sos-more [data-tool="safety"]'), false, 'extras are folded');
    await page.click('#sos-more summary');
    assert.equal(await page.isVisible('#sos-more [data-tool="safety"]'), true);
    await page.click('#support-close');
    await page.click('#breathe-now');
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => window.LoosenUp.currentScreen()), 'session');
    assert.equal(await page.isVisible('#session-audio-panel'), false);
    await page.click('#session-audio');
    assert.equal(await page.isVisible('#session-audio-panel [data-bed="rain"]'), true);
    await page.click('#session-finish');
    assert.equal(await page.isVisible('#before-tap'), true);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
}

test('AT39 in Hindi, Today and Find support stay short too', async () => {
  const { ctx, page, errors } = await onboarded('light', 'hi');
  const today = await wordsAboveFold(page, '#screen-today');
  assert.ok(today < 140, `Hindi Today shows ${today} words above the fold`);
  await page.evaluate(() => window.LoosenUp.go('support'));
  await page.waitForTimeout(300);
  const support = await wordsAboveFold(page, '#screen-support');
  assert.ok(support < 75, `Hindi Find support shows ${support} words on its first screen`);
  assert.deepEqual(errors, []);
  await ctx.close();
});
