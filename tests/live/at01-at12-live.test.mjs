// Live checks against the production URL. Run with: LIVE_URL=https://... npm run test:live
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from '../helpers/app.mjs';

const LIVE = (process.env.LIVE_URL || '').replace(/\/$/, '');
const skip = !LIVE && 'LIVE_URL not set';

const FILES = ['/', '/index.html', '/styles.css', '/app.js', '/sw.js', '/manifest.json', '/apple-touch-icon.png',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png', '/fonts/nunito-latin.woff2', '/fonts/fraunces-latin.woff2', '/favicon.png'];

test('AT1 live: every shell file returns 200', { skip }, async () => {
  for (const f of FILES) {
    const r = await fetch(LIVE + f, { redirect: 'follow' });
    assert.equal(r.status, 200, `${f} -> ${r.status}`);
  }
});

test('AT1 live: manifest is served with the manifest content type and matches the repo', { skip }, async () => {
  const r = await fetch(LIVE + '/manifest.json');
  assert.match(r.headers.get('content-type'), /application\/manifest\+json/);
  const live = await r.json();
  const local = JSON.parse(readFileSync(path.join(ROOT, 'www/manifest.json'), 'utf8'));
  assert.deepEqual(live, local);
});

test('AT1 live: sw.js is served no-cache and matches the repo', { skip }, async () => {
  const r = await fetch(LIVE + '/sw.js');
  assert.match(r.headers.get('cache-control') || '', /no-cache/);
  assert.equal(await r.text(), readFileSync(path.join(ROOT, 'www/sw.js'), 'utf8'));
});

test('AT12 live: production URL loads the app over HTTPS from Vercel', { skip }, async () => {
  assert.match(LIVE, /^https:\/\//);
  const r = await fetch(LIVE + '/');
  assert.equal(r.status, 200);
  assert.ok(r.headers.get('x-vercel-id'), 'served by Vercel');
  const html = await r.text();
  assert.match(html, /<title>LoosenUp<\/title>/);
  assert.match(html, /A wellbeing companion, not medical care\./);
});
