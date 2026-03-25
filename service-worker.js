const CACHE_NAME = "devcore-music-v2";

const urlsToCache = [
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./covers/timeaftertime.jpeg",
  "./covers/timeaftertime.jpeg",
  "./music/time-after-time.mp3"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        urlsToCache.map(url =>
          cache.add(url).catch(err => {
            console.warn("No se pudo cachear:", url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, fetchRes.clone());
          return fetchRes;
        });
      }).catch(() => {
        console.warn("Sin conexión y sin caché:", e.request.url);
      });
    })
  );
});
