import test from 'node:test';
import assert from 'node:assert/strict';

test('AT44 web reminders go out once a day, within 20 minutes after each person\'s own local time', async () => {
  process.env.DATABASE_URL = 'postgres://u:p@ep-test-9.ap-southeast-1.aws.neon.tech/db';
  const { due } = await import('../../api/push.js');
  // 19:00 in India is 13:30 UTC.
  const at = Date.UTC(2026, 9, 18, 13, 35);
  const ist = { id: 'a', at_minute: 19 * 60, tz_minutes: 330, last_sent: null };
  assert.equal(due([ist], at).length, 1, 'five minutes after 19:00 in India');
  assert.equal(due([{ ...ist, last_sent: '2026-10-18' }], at).length, 0, 'never twice a day');
  assert.equal(due([{ ...ist, at_minute: 21 * 60 }], at).length, 0, 'not before the chosen time');
  assert.equal(due([ist], Date.UTC(2026, 9, 18, 13, 55)).length, 0, 'not after the 20 minute window');
  const london = { id: 'b', at_minute: 14 * 60 + 30, tz_minutes: 60, last_sent: '2026-10-17' };
  assert.equal(due([london], at).length, 1, 'other time zones too');
});

test('AT44 the send endpoint needs the scheduler secret', async () => {
  process.env.CRON_SECRET = 'test-secret';
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ rows: [] }) });
  const mod = await import('../../api/push.js?' + Math.random());
  let status;
  const res = { setHeader() {}, status(s) { status = s; return res; }, json() { return res; }, end() { return res; } };
  await mod.default({ method: 'POST', query: {}, body: { action: 'send' }, headers: {} }, res);
  assert.equal(status, 401);
});
