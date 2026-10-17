/* Brightside service worker: precache the shell, cache-first for same-origin GET. */
var CACHE = 'brightside-v1.0.0';
var SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/fonts/nunito-latin.woff2',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(SHELL); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // App shell for every navigation, refreshed in the background when online.
    event.respondWith(
      caches.match('/index.html').then(function (cached) {
        var network = fetch(request).then(function (res) {
          if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('/index.html', copy); }); }
          return res;
        }).catch(function () { return cached; });
        return cached || network;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (res) {
        if (res && res.ok && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(request, copy); });
        }
        return res;
      });
    })
  );
});
