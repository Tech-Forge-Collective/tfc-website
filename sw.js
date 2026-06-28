const CACHE_NAME = "projectile-site-v11";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./technology.html",
  "./journal.html",
  "./journal-why-gpt-is-not-enough-for-complex-engineering-organisations.html",
  "./journal-deterministic-engineering-calculations.html",
  "./notes.html",
  "./updates.html",
  "./styles.css",
  "./script.js",
  "./offline.html",
  "./404.html",
  "./500.html",
  "./manifest.json",
  "./assets/projectile-mark.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./offline.html")))
  );
});
