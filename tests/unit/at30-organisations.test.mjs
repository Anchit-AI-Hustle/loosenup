import test from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, onboard, day, read } from '../helpers/app.mjs';
import { sign } from '../../api/_db.js';

// A stand-in for /api/org inside the app's window.
function withServer(app, org = { name: 'Riverside College', kind: 'college', joinCode: 'LUAB23CD', supportName: 'Student Wellness Centre', supportPhone: '+91 80 1234 5678', memberId: 'srv'.repeat(12), memberPass: 'signed-pass' }) {
  const calls = [];
  app.window.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body);
    calls.push({ url, body });
    if (body.action === 'join') return body.code === org.joinCode ? { ok: true, json: async () => org } : { ok: false, json: async () => ({ error: 'That code was not found. Check it with your organisation.' }) };
    return { ok: true, json: async () => ({ ok: true }) };
  };
  return calls;
}
const ready = () => { const app = makeApp({ now: day(8), rng: () => 0.99 }); onboard(app); return app; };

test('AT30 joining an organisation with its code, sharing off by default', async () => {
  const app = ready();
  const calls = withServer(app);
  app.B.go('me');
  app.setValue('#org-code', 'wrong1');
  assert.equal(await app.B.joinOrg('WRONG1'), false);
  assert.match(app.$('#org-status').textContent, /not found/);
  assert.equal(await app.B.joinOrg('luab23cd'), true);
  assert.equal(calls.at(-1).url, 'https://loosenup.anchit-tandon.com/api/org');
  const o = app.B.state().org;
  assert.equal(o.name, 'Riverside College');
  assert.equal(o.share, false, 'nothing is shared until the person turns it on');
  assert.ok(o.member.length >= 32, 'a random member id, not tied to the person');
  assert.equal(o.member, 'srv'.repeat(12), 'the id the server signed');
  assert.equal(o.pass, 'signed-pass');
  assert.equal(app.visible('#org-joined'), true);
  assert.match(app.$('#org-share').textContent, /off/);
});

test('AT30 the weekly pulse is only averages and allowed feelings, sent once per week', async () => {
  const app = makeApp({ now: day(1), rng: () => 0.99 });
  onboard(app);
  const calls = withServer(app);
  // A week of activity on days 1 to 3, then the next week.
  app.B.setState({ moods: [{ day: '2026-10-05', mood: 2 }, { day: '2026-10-06', mood: 4 }],
    sessions: [{ ts: day(1).getTime(), day: '2026-10-05', technique: 'sigh', context: 'Busy mind', contexts: ['Busy mind', 'Tight shoulders'], before: 3, after: 7, gain: 4 },
      { ts: day(2).getTime(), day: '2026-10-06', technique: 'breeze', context: 'Busy mind', contexts: ['Busy mind'], before: 5, after: 7, gain: 2 }] });
  await app.B.joinOrg('LUAB23CD');
  app.B.setNow(day(8));
  app.B.go('me');
  app.click('#org-share');
  await new Promise((r) => setTimeout(r, 10));
  const pulses = calls.filter((c) => c.body.action === 'pulse');
  assert.equal(pulses.length, 1);
  const p = pulses[0].body;
  assert.deepEqual(Object.keys(p).sort(), ['action', 'breaks', 'calmGain', 'code', 'contexts', 'member', 'mood', 'pass', 'week'].sort());
  assert.equal(p.week, '2026-W41');
  assert.equal(p.mood, 3);
  assert.equal(p.calmGain, 3);
  assert.equal(p.breaks, 2);
  assert.deepEqual(p.contexts, ['Busy mind', 'Tight shoulders']);
  assert.ok(!JSON.stringify(p).includes('Asha'), 'no name');
  await app.B.sendPulse();
  assert.equal(calls.filter((c) => c.body.action === 'pulse').length, 1, 'once per week');
});

test('AT30 the organisation support line appears in SOS', async () => {
  const app = ready();
  withServer(app);
  await app.B.joinOrg('LUAB23CD');
  app.click('#sos-btn');
  const a = app.$('#sos-org');
  assert.equal(a.hidden, false);
  assert.equal(a.getAttribute('href'), 'tel:+918012345678');
  assert.match(a.textContent, /Student Wellness Centre/);
  assert.ok(app.$('#support-sheet').textContent.indexOf('14416') < app.$('#support-sheet').textContent.indexOf('Student Wellness'), 'Tele-MANAS stays first');
});

// The serverless function, against a stand-in database.
async function apiWith(rowsFor) {
  process.env.DATABASE_URL = 'postgres://u:p@ep-test-123.ap-southeast-1.aws.neon.tech/db';
  const queries = [];
  globalThis.fetch = async (url, opts) => {
    const { query, params } = JSON.parse(opts.body);
    queries.push({ url, query, params, headers: opts.headers });
    return { ok: true, json: async () => ({ rows: rowsFor(query, params) }) };
  };
  const mod = await import('../../api/org.js?' + Math.random());
  const call = async (method, { query = {}, body = {}, headers = {} } = {}) => {
    let status = 200, json;
    const res = { setHeader() {}, status(s) { status = s; return res; }, json(j) { json = j; return res; }, end() { return res; } };
    await mod.default({ method, query, body, headers }, res);
    return { status, json };
  };
  return { call, queries, mod };
}

test('AT30 API: the dashboard hides any week with fewer than 5 people', async () => {
  const { call, queries, mod } = await apiWith((q) => {
    if (q.includes('FROM lu_orgs WHERE admin_hash')) return [{ id: 1, name: 'Riverside College', kind: 'college', join_code: 'LUAB23CD' }];
    if (q.includes('GROUP BY week ORDER BY')) return [{ week: '2026-W42', members: 7, networks: 6, mood: 3.4, calm_gain: 2.1, breaks: 30 }, { week: '2026-W41', members: 3, networks: 3, mood: 1.5, calm_gain: 0, breaks: 4 }, { week: '2026-W40', members: 6, networks: 1, mood: 2, calm_gain: 1, breaks: 9 }];
    if (q.includes('unnest(contexts)')) return [{ week: '2026-W42', context: 'Busy mind', n: 5 }, { week: '2026-W41', context: 'Feeling low', n: 2 }];
    return [];
  });
  assert.equal(mod.MIN_GROUP, 5);
  const r = await call('GET', { query: { action: 'dashboard' }, headers: { 'x-admin-key': 'k'.repeat(32) } });
  assert.equal(r.status, 200);
  assert.deepEqual(r.json.weeks[0].topFeelings, ['Busy mind']);
  assert.equal(r.json.weeks[0].members, 7);
  assert.deepEqual(r.json.weeks[1], { week: '2026-W41', members: null, hidden: true }, 'a small week reveals nothing');
  assert.deepEqual(r.json.weeks[2], { week: '2026-W40', members: null, hidden: true }, 'six pulses from one network stay private');
  assert.match(queries.at(-1).url, /^https:\/\/api\.ap-southeast-1\.aws\.neon\.tech\/sql$/);
  assert.ok(queries.every((q) => !q.params.includes('k'.repeat(32))), 'the admin key is stored and compared only as a hash');
});

test('AT30 API: pulses keep only allowed fields and feelings; members are stored as a hash', async () => {
  const { call, queries } = await apiWith((q) => (q.includes('WHERE join_code') ? [{ id: 9, name: 'X', kind: 'company', join_code: 'LUAB23CD' }] : []));
  const member = 'm'.repeat(36);
  const r = await call('POST', { body: { action: 'pulse', code: 'LUAB23CD', member, pass: sign('9:' + member), week: '2026-W42', mood: 9, calmGain: 3, breaks: 4, contexts: ['Busy mind', 'my secret diary', 'Feeling low', 'Low energy', 'Winding down'], note: 'hi' } });
  assert.equal(r.status, 200);
  const ins = queries.find((q) => q.query.includes('INSERT INTO lu_pulses'));
  assert.equal(ins.params[3], 5, 'mood is clamped to 1 to 5');
  assert.deepEqual(ins.params[6], ['Busy mind', 'Feeling low', 'Low energy'], 'only listed feelings, at most 3');
  assert.notEqual(ins.params[2], member, 'member id is hashed');
  assert.equal(ins.params[7].length, 64, 'network stored only as a hash');
  assert.ok(!JSON.stringify(ins.params).includes('secret'));
  const bad = await call('POST', { body: { action: 'pulse', code: 'LUAB23CD', member, pass: sign('9:' + member), week: 'last week' } });
  assert.equal(bad.status, 400);
});

test('AT30 API: creating an organisation returns a join code and a one-time admin key', async () => {
  const { call, queries } = await apiWith((q) => (q.includes('count(*)') ? [{ n: 0 }] : q.includes('INSERT INTO lu_orgs') ? [{ join_code: 'x' }] : []));
  const r = await call('POST', { body: { action: 'create', name: 'Riverside College', kind: 'college', supportPhone: '+91 80 1234 5678<script>' }, headers: { 'x-forwarded-for': '1.2.3.4' } });
  assert.equal(r.status, 200);
  assert.match(r.json.joinCode, /^LU[A-Z2-9]{6}$/);
  assert.ok(r.json.adminKey.length >= 30);
  const ins = queries.find((q) => q.query.includes('INSERT INTO lu_orgs'));
  assert.notEqual(ins.params[3], r.json.adminKey, 'only the hash of the admin key is stored');
  assert.equal(ins.params[5], '+91 80 1234 5678');
  assert.ok(!JSON.stringify(ins.params).includes('1.2.3.4'), 'IP stored only as a hash');
});

test('AT30 the organisation pages promise only what the API enforces', () => {
  const t = read('www/teams.html');
  assert.match(t, /5 or more people/);
  assert.match(t, /Sharing is off until each member turns it on/);
  assert.match(read('www/org.html'), /noindex/);
});
