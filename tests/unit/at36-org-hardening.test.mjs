import test from 'node:test';
import assert from 'node:assert/strict';

// The organisations function against a stand-in database that keeps simple state.
async function api() {
  process.env.DATABASE_URL = 'postgres://u:p@ep-test-9.ap-southeast-1.aws.neon.tech/db';
  const db = { joins: {}, pulses: [] };
  globalThis.fetch = async (url, opts) => {
    const { query: q, params: p } = JSON.parse(opts.body);
    let rows = [];
    if (q.includes('FROM lu_orgs WHERE join_code')) rows = [{ id: 7, name: 'Riverside College', kind: 'college', join_code: 'LUAB23CD' }];
    else if (q.includes('INSERT INTO lu_joins')) { const k = p.join(':'); db.joins[k] = (db.joins[k] ?? -1) + 1; rows = [{ n: db.joins[k] }]; }
    else if (q.includes('SELECT count(*)::int AS n FROM lu_pulses')) rows = [{ n: db.pulses.filter((x) => x.week === p[1] && x.ip === p[2] && x.member !== p[3]).length }];
    else if (q.includes('INSERT INTO lu_pulses')) { db.pulses = db.pulses.filter((x) => !(x.week === p[1] && x.member === p[2])); db.pulses.push({ week: p[1], member: p[2], ip: p[7] }); }
    return { ok: true, json: async () => ({ rows }) };
  };
  const mod = await import('../../api/org.js?' + Math.random());
  return async (body, ip = '10.0.0.1') => {
    let status = 200, json;
    const res = { setHeader() {}, status(s) { status = s; return res; }, json(j) { json = j; return res; }, end() { return res; } };
    await mod.default({ method: 'POST', query: {}, body, headers: { 'x-forwarded-for': ip } }, res);
    return { status, json };
  };
}

test('AT36 joining returns a server-made member id with a signed pass; pulses need a valid pass', async () => {
  const call = await api();
  const j = await call({ action: 'join', code: 'LUAB23CD' });
  assert.equal(j.status, 200);
  assert.ok(j.json.memberId.length >= 20 && j.json.memberPass.length >= 30);
  const ok = await call({ action: 'pulse', code: 'LUAB23CD', member: j.json.memberId, pass: j.json.memberPass, week: '2026-W42', mood: 3, breaks: 1 });
  assert.equal(ok.status, 200);
  const forged = await call({ action: 'pulse', code: 'LUAB23CD', member: 'x'.repeat(24), pass: 'made-up', week: '2026-W42', mood: 3 });
  assert.equal(forged.status, 403, 'a made-up member is refused');
  const swapped = await call({ action: 'pulse', code: 'LUAB23CD', member: 'y'.repeat(24), pass: j.json.memberPass, week: '2026-W42', mood: 3 });
  assert.equal(swapped.status, 403, 'a pass only works for its own member');
});

test('AT36 one network can join at most 3 times a day and send at most 4 members a week', async () => {
  const call = await api();
  const members = [];
  for (let i = 0; i < 3; i++) { const j = await call({ action: 'join', code: 'LUAB23CD' }); assert.equal(j.status, 200); members.push(j.json); }
  assert.equal((await call({ action: 'join', code: 'LUAB23CD' })).status, 429, 'fourth join from one network today is refused');
  for (let i = 0; i < 2; i++) members.push((await call({ action: 'join', code: 'LUAB23CD' }, '10.0.0.2')).json);
  // All five members now pulse from the first network.
  const results = [];
  for (const m of members) results.push((await call({ action: 'pulse', code: 'LUAB23CD', member: m.memberId, pass: m.memberPass, week: '2026-W42', mood: 4, breaks: 1 })).status);
  assert.deepEqual(results, [200, 200, 200, 200, 429], 'a fifth member from one network in a week is refused');
});
