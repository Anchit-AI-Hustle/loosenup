import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { ROOT, read } from '../helpers/app.mjs';

test('AT18 install page offers a direct Android download and iPhone home screen steps', () => {
  const html = read('www/install.html');
  assert.match(html, /<title>Install LoosenUp<\/title>/);
  assert.match(html, /<a id="apk-download"[^>]*href="\/download\/loosenup-android\.apk"/);
  assert.match(html, /Install unknown apps/);
  assert.match(html, /Add to Home Screen/);
  assert.match(html, /Apple Developer account/);
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
