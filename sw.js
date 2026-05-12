const CACHE_NAME = 'cm-v13-auto-stable';
const assets = [
  './',
  'index.html',
  'manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // FORÇA A INSTALAÇÃO IMEDIATA
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('activate', event => {
  // TOMA CONTROLE DE TODAS AS ABAS IMEDIATAMENTE
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});