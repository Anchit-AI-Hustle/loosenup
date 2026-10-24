import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, read } from '../helpers/app.mjs';

test('AT18 install page offers a direct Android download and iPhone home screen steps', () => {
  const html = read('www/install.html');
  assert.match(html, /<title>Install LoosenUp<\/title>/);
  assert.match(html, /<a id="apk-download"[^>]*href="\/download\/loosenup-android\.apk"/);
  assert.match(html, /Install unknown apps/);
  assert.match(html, /Add to Home Screen/);
  assert.match(html, /Open LoosenUp in Safari/);
  assert.match(html, /href="tel:14416"/);
  assert.match(html, /A wellbeing companion, not medical care\./);
});

test('AT18 the Android APK shipped for download is a real LoosenUp package', () => {
  const file = path.join(ROOT, 'downloads', 'loosenup-android.apk');
  const st = statSync(file);
  assert.ok(st.size > 1_000_000, 'APK is a full build');
  const buf = readFileSync(file);
  assert.equal(buf.toString('ascii', 0, 2), 'PK', 'APK is a zip archive');
  assert.ok(buf.includes(Buffer.from('AndroidManifest.xml')), 'contains a manifest');
});

test('AT18 the APK is served as an Android package download', () => {
  const v = JSON.parse(read('vercel.json'));
  const rule = v.headers.find((h) => h.source.startsWith('/download/'));
  assert.ok(rule, 'download header rule');
  const get = (k) => rule.headers.find((h) => h.key === k).value;
  assert.equal(get('Content-Type'), 'application/vnd.android.package-archive');
  assert.match(get('Content-Disposition'), /attachment; filename="LoosenUp\.apk"/);
});

test('AT18 Me links to the install page on the web', () => {
  assert.match(read('www/index.html'), /<a id="install-page-link"[^>]*href="\/install\.html"/);
});

test('AT27 iPhone on /get adds LoosenUp to the home screen and never tries a web install', () => {
  // A free Apple ID build cannot install from a web link, and a refused install removes the copy
  // already on the phone. So /get offers only the home screen app on iPhone.
  const html = read('www/install.html');
  assert.doesNotMatch(html, /itms-services/);
  assert.match(html, /<a id="iphone-open"[^>]*href="https:\/\/loosenup\.anchit-tandon\.com\/"/);
  assert.match(html, /Add to Home Screen, then Add/);
  assert.match(html, /<button id="iphone-install"[^>]*>Install LoosenUp<\/button>/, 'a real Install button');
  assert.match(html, /id="a2hs"[^>]*role="dialog"/, 'Install opens a three-step guide');
  assert.match(html, /beforeinstallprompt/, 'browsers with an install prompt get it directly');
  assert.match(html, /iPhones and iPads see their card first/);
  assert.equal(existsSync(path.join(ROOT, 'www', 'loosenup-ios.plist')), false, 'no install manifest is served');
  const vercel = JSON.parse(read('vercel.json'));
  assert.doesNotMatch(vercel.buildCommand, /\.ipa/, 'no iPhone app file is published');
  assert.ok(!vercel.headers.some((h) => /plist|ipa/.test(h.source)));
});
