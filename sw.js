const CACHE = 'noodle-v57';
const FILES = ['./', 'index.html', 'preact.min.js', 'runtime.js', 'app.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'gallery.html', 'fonts/it-latin.woff2', 'fonts/it-latin-ext.woff2'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && /^noodle-v\d/.test(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const fresh = new URL(e.request.url).origin === self.location.origin ? fetch(e.request.url, { cache: 'no-cache' }) : fetch(e.request);
  e.respondWith(fresh.then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); return r; }).catch(() => caches.match(e.request)));
});
