import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { read, WWW, ROOT } from '../helpers/app.mjs';

const pngSize = (file) => {
  const b = readFileSync(file);
  assert.equal(b.toString('ascii', 1, 4), 'PNG', `${file} is a PNG`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

test('AT1 manifest has the required PWA fields', () => {
  const m = JSON.parse(read('www/manifest.json'));
  assert.equal(m.id, '/');
  assert.equal(m.name, 'Brightside');
  assert.equal(m.short_name, 'Brightside');
  assert.equal(m.display, 'standalone');
  assert.equal(m.start_url, '/');
  assert.equal(m.scope, '/');
  assert.match(m.theme_color, /^#[0-9A-Fa-f]{6}$/);
  assert.match(m.background_color, /^#[0-9A-Fa-f]{6}$/);
  const sizes = m.icons.map((i) => i.sizes);
  assert.ok(sizes.includes('192x192'), '192 icon');
  assert.ok(sizes.includes('512x512'), '512 icon');
  assert.ok(m.icons.some((i) => (i.purpose || '').includes('maskable')), 'maskable icon');
});

test('AT1 every manifest icon exists with the declared pixel size', () => {
  const m = JSON.parse(read('www/manifest.json'));
  for (const icon of m.icons) {
    const file = path.join(WWW, icon.src.replace(/^\//, ''));
    assert.ok(existsSync(file), `${icon.src} exists`);
    const [w, h] = pngSize(file);
    assert.equal(`${w}x${h}`, icon.sizes, `${icon.src} pixel size`);
  }
  assert.deepEqual(pngSize(path.join(WWW, 'apple-touch-icon.png')), [180, 180]);
});

test('AT1 service worker is registered and precaches the shell', () => {
  const app = read('www/app.js');
  assert.match(app, /navigator\.serviceWorker\.register\(\s*['"]\/sw\.js['"]/);
  const sw = read('www/sw.js');
  for (const f of ['/index.html', '/styles.css', '/app.js', '/manifest.json']) {
    assert.ok(sw.includes(`'${f}'`), `sw precaches ${f}`);
  }
  assert.match(sw, /addEventListener\(\s*['"]fetch['"]/);
  assert.match(sw, /caches\.match/);
  assert.match(sw, /request\.method\s*!==\s*['"]GET['"]/);
  assert.match(sw, /self\.location\.origin/);
});

test('AT1 vercel.json sets sw.js no-cache and the manifest content type', () => {
  const v = JSON.parse(read('vercel.json'));
  const find = (src) => v.headers.find((h) => h.source === src);
  const sw = find('/sw.js');
  assert.ok(sw, 'sw.js header rule');
  assert.ok(sw.headers.some((h) => h.key === 'Cache-Control' && /no-cache/.test(h.value)));
  const mf = find('/manifest.json');
  assert.ok(mf.headers.some((h) => h.key === 'Content-Type' && h.value.startsWith('application/manifest+json')));
  assert.equal(v.outputDirectory, 'www');
});

test('AT2 iOS meta tags and viewport-fit=cover are present', () => {
  const html = read('www/index.html');
  assert.match(html, /<meta name="apple-mobile-web-app-capable" content="yes">/);
  assert.match(html, /<meta name="mobile-web-app-capable" content="yes">/);
  assert.match(html, /<meta name="apple-mobile-web-app-title" content="Brightside">/);
  assert.match(html, /<link rel="apple-touch-icon"[^>]*href="\/apple-touch-icon\.png"/);
  assert.match(html, /<meta name="viewport" content="[^"]*viewport-fit=cover/);
  assert.match(html, /<link rel="manifest" href="\/manifest\.json">/);
});

test('AT2 safe-area insets are applied to nav, sheets and toast', () => {
  const css = read('www/styles.css');
  const block = (sel) => {
    const re = new RegExp(sel.replace(/[.]/g, '\\.') + '\\s*\\{([^}]*)\\}');
    const m = css.match(re);
    assert.ok(m, `${sel} rule exists`);
    return m[1];
  };
  assert.match(block('.tabbar'), /env\(safe-area-inset-bottom/);
  assert.match(block('.sheet'), /env\(safe-area-inset-bottom/);
  assert.match(block('.toast'), /env\(safe-area-inset-bottom/);
  assert.match(css, /env\(safe-area-inset-top/);
  assert.ok(existsSync(path.join(ROOT, 'www', 'index.html')));
});
