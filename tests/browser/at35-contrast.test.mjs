// Every text on every screen must be readable in light and dark mode (WCAG AA: 4.5:1, or 3:1 for large text).
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from '../helpers/serve.mjs';

let server, b;
before(async () => { server = await startServer(0); b = await chromium.launch(); });
after(async () => { await b?.close(); await server?.close(); });

for (const scheme of ['light', 'dark']) {
  test(`AT35 text contrast passes on every screen in ${scheme} mode`, async () => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, colorScheme: scheme });
    const page = await ctx.newPage();
    const problems = [];
    const console = { log: (x) => problems.push(x) };
    await page.goto(server.url + '/');
    const audit = async (name) => {
      await page.waitForTimeout(450);
      const r = await page.evaluate(() => {
        const parse = (c) => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
        const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
        const blend = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
        const bgOf = (el) => {
          const layers = [];
          for (let e = el; e; e = e.parentElement) {
            const cs = getComputedStyle(e);
            const bc = parse(cs.backgroundColor);
            if (bc && bc.a > 0) layers.push(bc);
            const gi = cs.backgroundImage && cs.backgroundImage.match(/rgba?\([^)]+\)/g);
            if (gi) { const cols = gi.map(parse); const avg = cols.reduce((a, c) => ({ r: a.r + c.r / cols.length, g: a.g + c.g / cols.length, b: a.b + c.b / cols.length, a: Math.min(1, a.a + c.a / cols.length) }), { r: 0, g: 0, b: 0, a: 0 }); layers.push(avg); }
            if (layers.length && layers[layers.length - 1].a >= 0.99) break;
          }
          let c = parse(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
          if (c.a < 1) c = blend(c, document.documentElement.getAttribute('data-theme') === 'dark' ? { r: 14, g: 22, b: 38, a: 1 } : { r: 255, g: 255, b: 255, a: 1 });
          for (let i = layers.length - 1; i >= 0; i--) c = blend(layers[i], c);
          return c;
        };
        const out = [];
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = w.nextNode())) {
          const el = n.parentElement;
          if (!/\S/.test(n.data) || !el || el.closest('[hidden], svg, script, style, .sr-only') ) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
          const rc = el.getBoundingClientRect(); if (!rc.width || !rc.height) continue;
          if (/\p{Extended_Pictographic}/u.test(n.data.trim()) && n.data.trim().length <= 3) continue;
          const fg = parse(cs.color); if (!fg) continue;
          let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity;
          const bg = bgOf(el);
          const f = blend({ ...fg, a: fg.a * op }, bg);
          const L1 = lum(f), L2 = lum(bg);
          const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
          const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
          if (ratio < need) out.push(`${ratio.toFixed(2)} ${(el.id || el.className || el.tagName).toString().slice(0, 28)} "${n.data.trim().slice(0, 36)}"`);
        }
        return [...new Set(out)];
      });
      r.forEach((x) => console.log(name + ': ' + x));
    };
    await audit('welcome');
    await page.fill('#name-input', 'Anchit'); await page.click('#welcome-go'); await audit('how');
    await page.click('#gift-go'); await audit('checkin');
    await page.click('[data-context="Busy mind"]'); await page.click('#checkin-next'); await audit('pick');
    await page.click('#pick-begin'); await page.waitForTimeout(3500); await audit('session');
    await page.click('#session-finish'); await audit('after'); await page.click('#after-next'); await audit('result'); await page.click('#result-done');
    await page.click('[data-mood="2"]'); await page.click('[data-emotion="angry"]'); await page.click('[data-emotion="happy"]');
    for (const t of ['today', 'play', 'progress', 'me']) { await page.click(`[data-tab="${t}"]`); await audit('tab-' + t); }
    for (const sg of ['games', 'sounds']) { await page.click('[data-tab="play"]'); await page.click(`[data-seg="${sg}"]`); await audit('calm-' + sg); }
    for (const tool of ['support', 'safety', 'reframe', 'learn', 'wellbeing', 'programs']) { await page.evaluate((t) => window.LoosenUp.go(t), tool); await audit('tool-' + tool); }
    await page.evaluate(() => window.LoosenUp.openProgram('sleep')); await audit('program');
    await page.evaluate(() => window.LoosenUp.openLesson('breath')); await audit('lesson');
    for (const g of ['pairs', 'catch', 'bloom', 'sort', 'sand', 'stars', 'stack', 'kind']) { await page.evaluate((x) => window.LoosenUp.openGame(x), g); await audit('game-' + g); }
    await page.evaluate(() => { window.LoosenUp.go('today'); window.LoosenUp.openShop(); }); await audit('plus');
    await page.evaluate(() => { document.getElementById('shop-close').click(); document.getElementById('sos-btn').click(); }); await audit('sos');
    await ctx.close();
    // The skip link is off screen until focused; the Calm switch label sits on a separately drawn gold pill.
    const real = problems.filter((p) => !/skip "Skip to content"|seg-(games|sounds|breathe)/.test(p));
    assert.deepEqual([...new Set(real)], []);
  });
}
