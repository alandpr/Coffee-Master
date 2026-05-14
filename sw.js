const CACHE_NAME = 'coffee-master-v13-8';
const assets = ['./', 'index.html', 'manifest.json'];

// Instalação: Salva os arquivos básicos para emergências offline
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

// A MUDANÇA ESTÁ AQUI: Tenta internet primeiro. Se falhar, usa o cache.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a internet funcionar, atualiza o cache com a cópia nova
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // Se estiver offline, usa o que tem guardado
  );
});
