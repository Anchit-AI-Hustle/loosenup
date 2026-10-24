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
  assert.match(html, /Install on iPhone/);
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
  assert.match(html, /<a id="ios-profile"[^>]*href="\/loosenup\.mobileconfig"/);
  assert.match(html, /Profile Downloaded near the top, then Install/);
  assert.match(html, /<button id="iphone-install"[^>]*>Or use Safari's Share menu<\/button>/, 'the Share menu way stays as a second option');
  assert.match(html, /class="sheet" role="dialog" aria-modal="true" aria-labelledby="a2hs-title"/, 'Install opens a three-step guide in the app sheet');
  for (const page of ['install', 'plus', 'terms', 'privacy', 'refunds', 'teams', 'org']) {
    assert.match(read(`www/${page}.html`), /<script src="\/theme\.js"><\/script>/, `${page} follows the app theme`);
  }
  assert.match(read('www/theme.js'), /loosenup\.theme/);
  assert.match(html, /beforeinstallprompt/, 'browsers with an install prompt get it directly');
  assert.match(html, /iPhones and iPads see their card first/);
  assert.equal(existsSync(path.join(ROOT, 'www', 'loosenup-ios.plist')), false, 'no install manifest is served');
  const vercel = JSON.parse(read('vercel.json'));
  assert.doesNotMatch(vercel.buildCommand, /\.ipa/, 'no iPhone app file is published');
  assert.ok(!vercel.headers.some((h) => /plist|ipa/.test(h.source)));
});

test('AT27 the iPhone install profile adds one full-screen LoosenUp icon, served so iOS installs it', () => {
  const xml = read('www/loosenup.mobileconfig');
  assert.match(xml, /<key>PayloadType<\/key><string>com\.apple\.webClip\.managed<\/string>/);
  assert.match(xml, /<key>URL<\/key><string>https:\/\/loosenup\.anchit-tandon\.com\/\?app=webclip<\/string>/);
  assert.match(xml, /<key>FullScreen<\/key><true\/>/);
  assert.match(xml, /<key>IsRemovable<\/key><true\/>/);
  const icon = xml.match(/<key>Icon<\/key><data>([^<]+)<\/data>/)[1];
  assert.equal(icon, readFileSync(path.join(ROOT, 'www/icons/icon-512.png')).toString('base64'), 'the current app icon');
  assert.match(xml, /CD3F0B59-B307-4A16-84EE-381B9DFA2879/, 'a fixed id, so installing again replaces it');
  const v = JSON.parse(read('vercel.json'));
  const rule = v.headers.find((h) => h.source === '/loosenup.mobileconfig');
  assert.equal(rule.headers.find((h) => h.key === 'Content-Type').value, 'application/x-apple-aspen-config');
  assert.match(read('www/sw.js'), /\.mobileconfig\$\/\.test/);
});
