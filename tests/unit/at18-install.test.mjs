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
  assert.match(html, /Install the iPhone app/);
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

test('AT27 the iPhone app installs from a link: install button, Apple manifest and a signed app file', () => {
  const html = read('www/install.html');
  const link = html.match(/id="ipa-install"[^>]*href="([^"]+)"/) || html.match(/href="([^"]+)"[^>]*id="ipa-install"/);
  assert.ok(link, 'install button present');
  assert.equal(link[1].replace(/&amp;/g, '&'), 'itms-services://?action=download-manifest&url=https://loosenup-ios.anchit-tandon.com/loosenup-ios.plist');
  const plist = read('www/loosenup-ios.plist');
  assert.match(plist, /<string>software-package<\/string>\s*<key>url<\/key><string>https:\/\/loosenup-ios\.anchit-tandon\.com\/download\/loosenup-ios\.ipa<\/string>/);
  assert.match(plist, /<key>bundle-identifier<\/key><string>com\.loosenup\.calm<\/string>/);
  assert.match(plist, /<key>title<\/key><string>LoosenUp<\/string>/);
  const ipa = readFileSync(path.join(ROOT, 'downloads', 'loosenup-ios.ipa'));
  assert.ok(ipa.length > 500000, 'app file is a real build');
  assert.equal(ipa.subarray(0, 2).toString(), 'PK', 'app file is a zip archive');
  assert.ok(ipa.includes(Buffer.from('Payload/App.app/embedded.mobileprovision')), 'signed with a provisioning profile');
  const vercel = JSON.parse(read('vercel.json'));
  assert.match(vercel.buildCommand, /cp downloads\/loosenup-ios\.ipa site\/download\/loosenup-ios\.ipa/);
});
