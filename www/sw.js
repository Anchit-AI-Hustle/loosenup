/* LoosenUp service worker: precache the shell, cache-first for same-origin GET. */
var CACHE = 'loosenup-v2.3.1';
var SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/more.css',
  '/i18n.js',
  '/sleep.js',
  '/helplines.js',
  '/partners.js',
  '/app.js',
  '/more.js',
  '/manifest.json',
  '/fonts/nunito-latin.woff2',
  '/fonts/fraunces-latin.woff2',
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
    var isAppShell = url.pathname === '/' || url.pathname === '/index.html';
    if (!isAppShell) {
      // Other pages (like /get) come from the network, with any cached copy as an offline fallback.
      event.respondWith(fetch(request).catch(function () {
        return caches.match(request).then(function (r) { return r || caches.match('/index.html'); });
      }));
      return;
    }
    // App shell, refreshed in the background when online.
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

// Daily reminders on the website and mobile website (Web Push from /api/push).
self.addEventListener('push', function (event) {
  var d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = {}; }
  event.waitUntil(self.registration.showNotification(d.title || 'LoosenUp', {
    body: d.body || 'Two calm minutes are here for you whenever you like.',
    icon: '/icons/icon-192.png', badge: '/icons/icon-192.png', tag: 'loosenup-daily', data: { url: d.url || '/' }
  }));
});
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) if ('focus' in list[i]) return list[i].focus();
    return self.clients.openWindow ? self.clients.openWindow(url) : null;
  }));
});
