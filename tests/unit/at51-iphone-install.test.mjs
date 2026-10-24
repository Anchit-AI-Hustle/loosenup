// AT51: "Install the native app" on /get. The server queues a request behind a private key, and the
// Mac job picks it up, installs, and reports back. The database is an in-memory stand-in here.
import test from 'node:test';
import assert from 'node:assert/strict';
import { act, keyOk, makeHandler } from '../../api/iphone.js';
import { read } from '../helpers/app.mjs';

function memStore() {
  const rows = []; let seenAgo = null;
  return {
    rows, setSeen: (s) => { seenAgo = s; },
    async init() {},
    async open() { return rows.filter((r) => r.status === 'queued' || r.status === 'installing').slice(-1)[0] || null; },
    async add() { const r = { id: rows.length + 1, status: 'queued', message: null }; rows.push(r); return r; },
    async get(id) { return rows.find((r) => r.id === id) || null; },
    async seen() { seenAgo = 0; },
    async lastSeen() { return seenAgo; },
    async take() { const r = rows.find((x) => x.status === 'queued'); if (r) r.status = 'installing'; return r || null; },
    async finish(id, status, message) { const r = rows.find((x) => x.id === id); if (r) { r.status = status; r.message = message; } return r || null; }
  };
}
function call(handler, body, env = 'k3y') {
  process.env.IPHONE_INSTALL_KEY = env;
  return new Promise((done) => {
    const res = { code: 0, setHeader() {}, status(c) { this.code = c; return this; }, json(j) { done({ code: this.code, json: j }); } };
    handler({ method: 'POST', body }, res);
  });
}

test('AT51 the private key is required, compared safely, and nothing works without it set up', async () => {
  const h = makeHandler(memStore());
  assert.equal(keyOk('abc', 'abc'), true);
  assert.equal(keyOk('abd', 'abc'), false);
  assert.equal(keyOk('', 'abc'), false);
  assert.equal((await call(h, { action: 'request', key: 'nope' })).code, 403);
  assert.equal((await call(h, { action: 'request', key: 'k3y' }, '')).code, 503);
  assert.equal((await call(h, { action: 'request', key: 'k3y' })).code, 200);
});

test('AT51 a tap queues one request, the Mac takes it, installs, and the page sees Installed', async () => {
  const s = memStore();
  const r1 = await act(s, 'request', {});
  assert.deepEqual([r1.status, r1.macOnline], ['queued', false], 'the Mac has not checked in yet');
  const r2 = await act(s, 'request', {});
  assert.equal(r2.id, r1.id, 'a second tap reuses the open request');
  assert.deepEqual(await act(s, 'next', {}), { id: r1.id });
  assert.equal((await act(s, 'status', { id: r1.id })).status, 'installing');
  assert.equal((await act(s, 'status', { id: r1.id })).macOnline, true);
  assert.deepEqual(await act(s, 'next', {}), { none: true }, 'nothing else waiting');
  await act(s, 'finish', { id: r1.id, ok: true });
  assert.equal((await act(s, 'status', { id: r1.id })).status, 'installed');
  const r3 = await act(s, 'request', {});
  assert.notEqual(r3.id, r1.id, 'a new tap after it finished makes a new request');
});

test('AT51 when the Mac cannot reach the iPhone, the page is told why', async () => {
  const s = memStore();
  const { id } = await act(s, 'request', {});
  await act(s, 'next', {});
  await act(s, 'finish', { id, ok: false, message: 'the iPhone was not reachable <script>' });
  const st = await act(s, 'status', { id });
  assert.equal(st.status, 'stopped');
  assert.equal(st.message, 'the iPhone was not reachable script');
});

test('AT51 /get shows the native button only on an iPhone that opened the private link, and keeps the key out of the address', () => {
  const html = read('www/install.html');
  assert.match(html, /<div id="native" class="native" hidden>/);
  assert.match(html, /Install the native app/);
  assert.match(html, /iphone=\(\[A-Za-z0-9\]\+\)/);
  assert.match(html, /history\.replaceState\(null, '', location\.pathname\)/);
  assert.match(html, /if \(nkey && ios\)/);
  assert.doesNotMatch(html, /itms-services/, 'still never a web install');
});
