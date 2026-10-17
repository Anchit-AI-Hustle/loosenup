// Real-browser checks with Playwright Chromium: console errors, horizontal scroll, offline shell, a11y sizing.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startServer } from '../helpers/serve.mjs';
import { ROOT } from '../helpers/app.mjs';

const SHOTS = path.join(ROOT, 'tests', 'screenshots');
mkdirSync(SHOTS, { recursive: true });
let server, browser;

before(async () => {
  server = await startServer(0);
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  await server?.close();
});

async function newPage(width, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 860 }, ...extra });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  return { ctx, page, errors };
}

const noHScroll = (page) => page.evaluate(() => ({
  sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
  bw: document.body.scrollWidth,
}));

async function walkScreens(page, width, label) {
  const shots = [];
  const check = async (name) => {
    await page.waitForTimeout(450);
    const m = await noHScroll(page);
    assert.ok(m.sw <= m.cw && m.bw <= m.cw, `${label} ${name}: scrollWidth ${m.sw}/${m.bw} > ${m.cw}`);
    const file = path.join(SHOTS, `${width}-${name}.png`);
    await page.screenshot({ path: file });
    shots.push(file);
  };
  await page.goto(server.url + '/');
  await check('welcome');
  await page.fill('#name-input', 'Asha');
  await page.click('#welcome-go');
  await check('gift');
  await page.click('#gift-go');
  await check('checkin');
  await page.click('[data-context="Hard to focus"]');
  await page.click('#checkin-next');
  await check('pick');
  await page.click('#pick-begin');
  await page.waitForTimeout(1200);
  await check('session');
  await page.click('#session-finish');
  await page.locator('#calm-after').fill('9');
  await page.click('#after-next');
  await page.waitForTimeout(1600);
  await check('result');
  await page.click('#result-done');
  for (const tab of ['today', 'garden', 'week', 'me']) {
    await page.click(`[data-tab="${tab}"]`);
    await check(tab);
  }
  await page.evaluate(() => window.Brightside.openShop());
  await check('shop');
  return shots;
}

for (const width of [390, 820, 1440]) {
  test(`AT9 no console errors and no horizontal scroll at ${width}px`, async () => {
    const { ctx, page, errors } = await newPage(width);
    const shots = await walkScreens(page, width, `${width}px`);
    assert.ok(shots.length >= 11, 'screenshots taken');
    assert.deepEqual(errors, []);
    await ctx.close();
  });
}

test('AT10 offline shell works after first load', async () => {
  const { ctx, page, errors } = await newPage(390);
  await page.goto(server.url + '/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForSelector('#screen-welcome:not([hidden])');
  const title = await page.title();
  assert.equal(title, 'Brightside');
  const cssOk = await page.evaluate(() => getComputedStyle(document.body).fontFamily.includes('Nunito'));
  assert.ok(cssOk, 'styles.css served from cache');
  const fontOk = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('16px Nunito'); });
  assert.ok(fontOk, 'self-hosted Nunito available offline');
  await page.screenshot({ path: path.join(SHOTS, 'offline-390.png') });
  assert.deepEqual(errors.filter((e) => !/ERR_INTERNET_DISCONNECTED/.test(e)), []);
  await ctx.close();
});

test('AT13 every visible button and tab is at least 48px tall and wide', async () => {
  const { ctx, page } = await newPage(390);
  await page.goto(server.url + '/');
  const small = [];
  const measure = async (where) => {
    const r = await page.evaluate(() => [...document.querySelectorAll('button, a.btn, [role="tab"], input[type="range"], .chip, input[type="time"], input[type="text"]')]
      .filter((e) => e.offsetParent !== null && !e.closest('[hidden]'))
      .map((e) => { const b = e.getBoundingClientRect(); return { id: e.id || e.className || e.textContent.trim().slice(0, 20), w: b.width, h: b.height }; })
      .filter((b) => b.h < 48 || b.w < 48));
    r.forEach((b) => small.push(`${where}: ${b.id} ${Math.round(b.w)}x${Math.round(b.h)}`));
  };
  await measure('welcome');
  await page.fill('#name-input', 'Asha');
  await page.click('#welcome-go'); await measure('gift');
  await page.click('#gift-go'); await measure('checkin');
  await page.click('[data-context="Busy mind"]');
  await page.click('#checkin-next'); await measure('pick');
  await page.click('#pick-begin'); await measure('session');
  await page.click('#session-finish'); await measure('after');
  await page.click('#after-next'); await page.waitForTimeout(400); await measure('result');
  await page.click('#result-done');
  for (const tab of ['today', 'garden', 'week', 'me']) { await page.click(`[data-tab="${tab}"]`); await measure(tab); }
  await page.evaluate(() => window.Brightside.openShop()); await measure('shop');
  assert.deepEqual(small, []);
  await ctx.close();
});

test('AT13 visible focus ring on keyboard focus', async () => {
  const { ctx, page } = await newPage(390);
  await page.goto(server.url + '/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement);
    return { style: s.outlineStyle, width: parseFloat(s.outlineWidth), tag: document.activeElement.tagName };
  });
  assert.notEqual(outline.style, 'none', `focused ${outline.tag} has an outline`);
  assert.ok(outline.width >= 3, 'outline at least 3px');
  await ctx.close();
});

test('AT13 prefers-reduced-motion stops the breathing orb animation', async () => {
  const { ctx, page } = await newPage(390, { reducedMotion: 'reduce' });
  await page.goto(server.url + '/');
  await page.fill('#name-input', 'Asha');
  await page.click('#welcome-go');
  await page.click('#gift-go');
  await page.click('[data-context="Hard to focus"]');
  await page.click('#checkin-next');
  await page.click('#pick-begin');
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const orb = document.querySelector('#orb');
    const s = getComputedStyle(orb);
    return { transition: s.transitionDuration, anim: s.animationName, rm: window.Brightside.prefersReducedMotion() };
  });
  assert.equal(r.rm, true);
  assert.ok(['0s', '0.00001s', '1e-05s'].includes(r.transition) || parseFloat(r.transition) < 0.01, `orb transition ${r.transition}`);
  await ctx.close();
});
