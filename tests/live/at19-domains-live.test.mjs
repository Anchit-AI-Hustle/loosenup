// Live checks for loosenup.anchit-tandon.com. Run with: LIVE_DOMAINS=1 npm run test:live
import test from 'node:test';
import assert from 'node:assert/strict';

const skip = !process.env.LIVE_DOMAINS && 'LIVE_DOMAINS not set';
const HOME = 'https://loosenup.anchit-tandon.com';
const IOS = HOME;
const ANDROID = HOME;
const title = async (url) => ((await (await fetch(url)).text()).match(/<title>([^<]*)<\/title>/) || [])[1];

test('AT19 live: /get shows every downloadable app, and / is the full app', { skip }, async () => {
  assert.equal(await title(HOME + '/get'), 'Install LoosenUp');
  assert.equal(await title(HOME + '/'), 'LoosenUp');
  const page = await (await fetch(HOME + '/get')).text();
  assert.match(page, /download\/loosenup-android\.apk/);
  assert.match(page, /Add to Home Screen/);
  assert.doesNotMatch(page, /itms-services/);
});

test('AT19 live: the APK downloads as an Android package', { skip }, async () => {
  const r = await fetch(ANDROID + '/download/loosenup-android.apk');
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('content-type'), 'application/vnd.android.package-archive');
  assert.ok(Number(r.headers.get('content-length') || (await r.arrayBuffer()).byteLength) > 1000000);
});

test('AT19 live: the full app is served with its manifest and service worker', { skip }, async () => {
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

test('AT27 live: no iPhone web install is offered, so a refused install can never remove the app', { skip }, async () => {
  assert.equal((await fetch(IOS + '/loosenup-ios.plist')).status, 404);
  assert.equal((await fetch(IOS + '/download/loosenup-ios.ipa', { method: 'HEAD' })).status, 404);
  const page = await (await fetch(IOS + '/install.html')).text();
  assert.doesNotMatch(page, /itms-services/);
  assert.match(page, /Install on iPhone/);
  const prof = await fetch(IOS + '/loosenup.mobileconfig');
  assert.equal(prof.status, 200);
  assert.equal(prof.headers.get('content-type'), 'application/x-apple-aspen-config');
  assert.match(await prof.text(), /com\.apple\.webClip\.managed/);
});

test('AT30 live: organisations work end to end on Neon, and small or single-network groups stay private', { skip }, async () => {
  const api = IOS + '/api/org';
  const post = async (body, headers = {}) => { const r = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }); return { status: r.status, json: await r.json() }; };
  const made = await post({ action: 'create', name: 'LoosenUp live test', kind: 'other' });
  assert.equal(made.status, 200, JSON.stringify(made.json));
  const { joinCode, adminKey } = made.json;
  try {
    const dash = async () => (await (await fetch(api + '?action=dashboard', { headers: { 'X-Admin-Key': adminKey } })).json());
    const pulse = (m, extra = {}) => post({ action: 'pulse', code: joinCode, member: m.memberId, pass: m.memberPass, week: '2026-W01', mood: 3, calmGain: 2, breaks: 2, contexts: ['Busy mind'], ...extra });
    // Each join gets a server-signed member pass; at most 3 joins a day from one network.
    const members = [];
    for (let i = 0; i < 3; i++) {
      const j = await post({ action: 'join', code: joinCode });
      assert.equal(j.status, 200, JSON.stringify(j.json));
      assert.equal(j.json.name, 'LoosenUp live test');
      assert.ok(j.json.memberId && j.json.memberPass, 'member id and pass from the server');
      members.push(j.json);
    }
    assert.equal((await post({ action: 'join', code: joinCode })).status, 429, 'a fourth join from one network today is refused');
    for (const m of members) assert.equal((await pulse(m)).status, 200);
    assert.equal((await pulse({ memberId: 'made-up-member-xxxxxxxxxx', memberPass: 'forged' })).status, 403, 'a made-up member cannot post');
    assert.equal((await pulse({ memberId: members[0].memberId, memberPass: members[1].memberPass })).status, 403, 'a pass only works for its own member');
    assert.equal((await dash()).weeks[0].hidden, true, 'three people on one network stay private');
  } finally {
    assert.equal((await post({ action: 'delete' }, { 'X-Admin-Key': adminKey })).status, 200, 'test organisation removed');
  }
});
