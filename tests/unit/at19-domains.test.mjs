import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day, read } from '../helpers/app.mjs';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

test('AT19 the Android domain opens on the install page, the app stays one link away', () => {
  const v = JSON.parse(read('vercel.json'));
  const r = v.rewrites.find((x) => x.destination === '/install.html');
  assert.ok(r, 'rewrite to the install page');
  assert.equal(r.source, '/');
  assert.deepEqual(r.has, [{ type: 'host', value: 'loosenup-android.anchit-tandon.com' }]);
  assert.deepEqual(r.missing, [{ type: 'query', key: 'app' }]);
});

test('AT19 the service worker serves the app shell only for the app URL', () => {
  const sw = read('www/sw.js');
  assert.match(sw, /url\.pathname === '\/' \|\| url\.pathname === '\/index\.html'/);
  assert.match(sw, /loosenup-android\./);
  assert.match(sw, /if \(!isAppShell\)/);
});

test('AT19 Sunbeam shares carry both platform links', async () => {
  const app = makeApp({ now: day(1) });
  onboard(app);
  let shared = '';
  Object.defineProperty(app.window.navigator, 'clipboard', { value: { writeText: (t) => { shared = t; return Promise.resolve(); } }, configurable: true });
  await app.B.shareSunbeam();
  assert.match(shared, /https:\/\/loosenup-android\.anchit-tandon\.com/);
  assert.match(shared, /https:\/\/loosenup-ios\.anchit-tandon\.com/);
});

test('AT19 iPhone Safari visitors see the Add to Home Screen tip, others do not', () => {
  const iphone = makeApp({ now: day(1), ua: IPHONE });
  assert.equal(iphone.visible('#ios-tip'), true);
  assert.match(iphone.$('#ios-tip').textContent, /Add to Home Screen/);
  const desktop = makeApp({ now: day(1) });
  assert.equal(desktop.visible('#ios-tip'), false);
});

test('AT19 install page names both platform domains', () => {
  const html = read('www/install.html');
  assert.match(html, /loosenup-android\.anchit-tandon\.com/);
  assert.match(html, /loosenup-ios\.anchit-tandon\.com/);
});
