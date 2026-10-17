// Live checks for the platform domains. Run with: LIVE_DOMAINS=1 npm run test:live
import test from 'node:test';
import assert from 'node:assert/strict';

const skip = !process.env.LIVE_DOMAINS && 'LIVE_DOMAINS not set';
const ANDROID = 'https://loosenup-android.anchit-tandon.com';
const IOS = 'https://loosenup-ios.anchit-tandon.com';
const title = async (url) => ((await (await fetch(url)).text()).match(/<title>([^<]*)<\/title>/) || [])[1];

test('AT19 live: Android domain opens on the install page over HTTPS', { skip }, async () => {
  assert.equal(await title(ANDROID + '/'), 'Install LoosenUp');
  assert.equal(await title(ANDROID + '/?app=1'), 'LoosenUp');
});

test('AT19 live: Android domain serves the APK as an Android package', { skip }, async () => {
  const r = await fetch(ANDROID + '/download/loosenup-android.apk');
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('content-type'), 'application/vnd.android.package-archive');
  assert.ok(Number(r.headers.get('content-length') || (await r.arrayBuffer()).byteLength) > 1000000);
});

test('AT19 live: iOS domain serves the full app with its manifest and service worker', { skip }, async () => {
  assert.equal(await title(IOS + '/'), 'LoosenUp');
  const m = await fetch(IOS + '/manifest.json');
  assert.match(m.headers.get('content-type'), /application\/manifest\+json/);
  const sw = await fetch(IOS + '/sw.js');
  assert.equal(sw.status, 200);
});

test('AT21 live: the update manifest and bundle are served to the apps', { skip }, async () => {
  const r = await fetch(IOS + '/updates/latest.json');
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('access-control-allow-origin'), '*');
  const m = await r.json();
  const z = await fetch(m.url);
  assert.equal(z.status, 200);
  const buf = Buffer.from(await z.arrayBuffer());
  assert.equal(buf.toString('ascii', 0, 2), 'PK');
});
