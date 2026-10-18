import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day, read } from '../helpers/app.mjs';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

test('AT19 one home: loosenup.anchit-tandon.com/get serves the downloads page', () => {
  const v = JSON.parse(read('vercel.json'));
  assert.deepEqual(v.rewrites, [{ source: '/get', destination: '/install.html' }]);
  assert.equal(v.redirects, undefined, 'no per-domain redirects any more');
});

test('AT19 the service worker serves the app shell only for the app URL', () => {
  const sw = read('www/sw.js');
  assert.match(sw, /url\.pathname === '\/' \|\| url\.pathname === '\/index\.html'/);
  assert.match(sw, /if \(!isAppShell\)/);
});

test('AT19 shares, live updates and the organisations API all use loosenup.anchit-tandon.com', async () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  let shared = '';
  Object.defineProperty(app.window.navigator, 'clipboard', { value: { writeText: (t) => { shared = t; return Promise.resolve(); } }, configurable: true });
  await app.B.shareSunbeam();
  assert.match(shared, /https:\/\/loosenup\.anchit-tandon\.com\/get/);
  assert.equal(app.B.updateManifest, 'https://loosenup.anchit-tandon.com/updates/latest.json');
  const js = read('www/app.js');
  assert.doesNotMatch(js, /loosenup-(ios|android)\.anchit-tandon\.com/);
});

test('AT19 iPhone Safari visitors see the Add to Home Screen tip, others do not', () => {
  const iphone = makeApp({ now: day(1), ua: IPHONE });
  assert.equal(iphone.visible('#ios-tip'), true);
  assert.match(iphone.$('#ios-tip').textContent, /Add to Home Screen/);
  const desktop = makeApp({ now: day(1) });
  assert.equal(desktop.visible('#ios-tip'), false);
});

test('AT19 the downloads page names the one home and the /get link', () => {
  const html = read('www/install.html');
  assert.match(html, /loosenup\.anchit-tandon\.com\/get/);
  assert.doesNotMatch(html, /loosenup-(ios|android)\.anchit-tandon\.com/);
});
