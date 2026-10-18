import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { ROOT, read, makeApp, day } from '../helpers/app.mjs';

const manifest = () => JSON.parse(read('downloads/updates/latest.json'));

test('AT21 version compare picks only newer releases', () => {
  const { B } = makeApp({ now: day(1) });
  assert.equal(B.newerVersion('1.6.1', '1.6.0'), true);
  assert.equal(B.newerVersion('1.10.0', '1.9.9'), true);
  assert.equal(B.newerVersion('1.6.0', '1.6.0'), false);
  assert.equal(B.newerVersion('1.5.9', '1.6.0'), false);
});

test('AT21 the update bundle matches this release exactly', () => {
  const m = manifest();
  const pkg = JSON.parse(read('package.json'));
  assert.equal(m.version, pkg.version, 'manifest version = package.json');
  assert.ok(read('www/app.js').includes(`var VERSION = '${pkg.version}'`), 'app.js VERSION = package.json');
  const zip = path.join(ROOT, 'downloads', 'updates', `loosenup-web-${m.version}.zip`);
  assert.ok(existsSync(zip), 'bundle zip exists');
  assert.equal(m.url, `https://loosenup.anchit-tandon.com/updates/loosenup-web-${m.version}.zip`);
  assert.equal(createHash('sha256').update(readFileSync(zip)).digest('hex'), m.checksum, 'checksum matches');
  const zipped = execFileSync('unzip', ['-p', zip, 'app.js']).toString();
  const h = (x) => createHash('sha256').update(x).digest('hex');
  assert.equal(h(zipped), h(read('www/app.js')), 'bundle app.js is the current source (rebuild with scripts/build-web-update.sh)');
  assert.ok(execFileSync('unzip', ['-l', zip]).toString().includes('index.html'), 'index.html at bundle root');
});

test('AT21 the updater stays on our own server and the manifest is fetchable from the apps', () => {
  const cap = JSON.parse(read('capacitor.config.json')).plugins.CapacitorUpdater;
  assert.equal(cap.autoUpdate, false);
  for (const k of ['updateUrl', 'statsUrl', 'channelUrl']) assert.equal(cap[k], '', `${k} disabled`);
  const v = JSON.parse(read('vercel.json'));
  const rule = v.headers.find((h) => h.source === '/updates/(.*)');
  assert.ok(rule.headers.some((h) => h.key === 'Access-Control-Allow-Origin' && h.value === '*'));
  assert.match(v.buildCommand, /cp downloads\/updates\/\* site\/updates\//);
  const { B } = makeApp({ now: day(1) });
  assert.equal(B.updateManifest, 'https://loosenup.anchit-tandon.com/updates/latest.json');
});

test('AT21 in a browser (not the phone apps) live updates stay off', async () => {
  const { B } = makeApp({ now: day(1) });
  assert.equal(await B.liveUpdate(), 'web');
});
