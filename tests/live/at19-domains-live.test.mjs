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

test('AT27 live: the iPhone install manifest and app file are served over HTTPS', { skip }, async () => {
  const m = await fetch(IOS + '/loosenup-ios.plist');
  assert.equal(m.status, 200);
  assert.match(m.headers.get('content-type'), /xml/);
  assert.match(await m.text(), /com\.loosenup\.calm/);
  const ipa = await fetch(IOS + '/download/loosenup-ios.ipa');
  assert.equal(ipa.status, 200);
  const buf = Buffer.from(await ipa.arrayBuffer());
  assert.equal(buf.subarray(0, 2).toString(), 'PK');
  const page = await (await fetch(IOS + '/install.html')).text();
  assert.match(page, /itms-services:\/\/\?action=download-manifest/);
});

test('AT30 live: organisations work end to end on Neon, and small groups stay private', { skip }, async () => {
  const api = IOS + '/api/org';
  const post = async (body, headers = {}) => { const r = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }); return { status: r.status, json: await r.json() }; };
  const made = await post({ action: 'create', name: 'LoosenUp live test', kind: 'other' });
  assert.equal(made.status, 200, JSON.stringify(made.json));
  const { joinCode, adminKey } = made.json;
  try {
    const joined = await post({ action: 'join', code: joinCode });
    assert.equal(joined.json.name, 'LoosenUp live test');
    const dash = async () => (await (await fetch(api + '?action=dashboard', { headers: { 'X-Admin-Key': adminKey } })).json());
    for (let i = 0; i < 4; i++) assert.equal((await post({ action: 'pulse', code: joinCode, member: 'live-member-' + i + '-xxxxxxxxxxxx', week: '2026-W01', mood: 3, calmGain: 2, breaks: 2, contexts: ['Busy mind'] })).status, 200);
    assert.equal((await dash()).weeks[0].hidden, true, '4 people: still private');
    await post({ action: 'pulse', code: joinCode, member: 'live-member-4-xxxxxxxxxxxx', week: '2026-W01', mood: 5, calmGain: 4, breaks: 3, contexts: ['Feeling low'] });
    const w = (await dash()).weeks[0];
    assert.equal(w.members, 5);
    assert.equal(w.breaks, 11);
    assert.deepEqual(w.topFeelings[0], 'Busy mind');
  } finally {
    assert.equal((await post({ action: 'delete' }, { 'X-Admin-Key': adminKey })).status, 200, 'test organisation removed');
  }
});
