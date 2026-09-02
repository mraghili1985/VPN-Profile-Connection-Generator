const CACHE_NAME = 'vpn-profile-tool-v1';

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Stale-while-revalidate: serve from cache instantly, refresh cache in background.
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (cached) {
        const network = fetch(event.request)
          .then(function (response) {
            if (response && response.status === 200) cache.put(event.request, response.clone());
            return response;
          })
          .catch(function () { return cached; });
        return cached || network;
      });
    })
  );
});
