// Tiny static server for www/ that mirrors the vercel.json headers.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WWW = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'www');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

export function startServer(port = 0) {
  const server = http.createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(WWW, path.normalize(p));
    if (!file.startsWith(WWW)) { res.writeHead(403); return res.end(); }
    try {
      const body = await readFile(file);
      const ext = path.extname(file);
      const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream' };
      if (p === '/manifest.json') headers['Content-Type'] = 'application/manifest+json';
      if (p === '/sw.js') headers['Cache-Control'] = 'no-cache';
      res.writeHead(200, headers);
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const { port: p } = server.address();
      resolve({ url: `http://127.0.0.1:${p}`, close: () => new Promise((r) => server.close(r)) });
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const s = await startServer(Number(process.env.PORT || 4173));
  console.log('LightenUp serving at ' + s.url);
}
