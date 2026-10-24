// AT50: /get offers a real Install button on every phone. iPhones get a three-step guide to Safari's
// Add to Home Screen (no web install of the native app, which a free Apple ID build cannot do).
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';
import { startServer } from '../helpers/serve.mjs';

let server, browser;
before(async () => { server = await startServer(0); browser = await chromium.launch(); });
after(async () => { await browser?.close(); await server?.close(); });

async function open(dev) {
  const ctx = await browser.newContext(dev);
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(server.url + '/install.html');
  return { ctx, p, errors };
}

test('AT50 on iPhone, the iPhone card comes first and Install opens the Share guide with an arrow', async () => {
  const { ctx, p, errors } = await open(devices['iPhone 13']);
  assert.equal(await p.evaluate(() => document.querySelector('main .card').id), 'iphone');
  assert.equal(await p.textContent('#iphone-install'), 'Install LoosenUp');
  assert.equal(await p.isVisible('#a2hs .sheet'), false);
  await p.click('#iphone-install');
  assert.equal(await p.isVisible('#a2hs .sheet'), true, 'the app bottom sheet opens');
  assert.equal(await p.isVisible('#a2hs-arrow'), true, 'points at Share at the bottom of Safari');
  assert.match(await p.textContent('#a2hs'), /Add to Home Screen/);
  assert.equal(await p.evaluate(() => /itms-services/.test(document.documentElement.innerHTML)), false);
  await p.keyboard.press('Escape');
  assert.equal(await p.isVisible('#a2hs .sheet'), false);
  assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('AT50 /get follows the app theme: dark on a dark phone, and the guide uses the app sheet', async () => {
  const { ctx, p } = await open({ ...devices['iPhone 13'], colorScheme: 'dark' });
  assert.equal(await p.getAttribute('html', 'data-theme'), 'dark');
  assert.equal(await p.getAttribute('meta[name="theme-color"]', 'content'), '#0E1626');
  await p.click('#iphone-install');
  assert.ok(await p.isVisible('#a2hs-scrim'));
  await p.click('#a2hs-scrim', { position: { x: 10, y: 10 } });
  assert.equal(await p.isVisible('#a2hs .sheet'), false, 'tapping outside closes it, like the app');
  await ctx.close();
});

test('AT50 inside another app, the guide says to open Safari first', async () => {
  const d = devices['iPhone 13'];
  const { ctx, p } = await open({ ...d, userAgent: d.userAgent + ' Instagram 300.0' });
  await p.click('#iphone-install');
  assert.match(await p.textContent('#a2hs-note'), /Open in Safari/);
  assert.equal(await p.isVisible('#a2hs-arrow'), false);
  await ctx.close();
});

test('AT50 on Android, the APK comes first and the iPhone guide explains where to follow it', async () => {
  const { ctx, p, errors } = await open(devices['Pixel 7']);
  assert.equal(await p.evaluate(() => document.querySelector('main .card').id), 'android');
  assert.ok(await p.isVisible('#apk-download'));
  await p.click('#iphone-install');
  assert.match(await p.textContent('#a2hs-note'), /on your iPhone in Safari/);
  await p.click('#a2hs-close');
  assert.equal(await p.isVisible('#a2hs .sheet'), false);
  assert.deepEqual(errors, []);
  await ctx.close();
});
