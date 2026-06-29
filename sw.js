const CACHE_NAME = "projectile-site-v13-i18n-language-fix-mobile-buttons-v2";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./en/",
  "./nl/",
  "./pl/",
  "./de/",
  "./es/",
  "./fr/",
  "./technology.html",
  "./en/technology/",
  "./nl/technology/",
  "./pl/technology/",
  "./de/technology/",
  "./es/technology/",
  "./fr/technology/",
  "./projectile/",
  "./roadmap/",
  "./journal.html",
  "./en/journal/",
  "./nl/journal/",
  "./pl/journal/",
  "./de/journal/",
  "./es/journal/",
  "./fr/journal/",
  "./journal-why-gpt-is-not-enough-for-complex-engineering-organisations.html",
  "./en/journal/why-gpt-is-not-enough-for-complex-engineering-organisations/",
  "./nl/journal/why-gpt-is-not-enough-for-complex-engineering-organisations/",
  "./pl/journal/why-gpt-is-not-enough-for-complex-engineering-organisations/",
  "./de/journal/why-gpt-is-not-enough-for-complex-engineering-organisations/",
  "./es/journal/why-gpt-is-not-enough-for-complex-engineering-organisations/",
  "./fr/journal/why-gpt-is-not-enough-for-complex-engineering-organisations/",
  "./journal-deterministic-engineering-calculations.html",
  "./notes.html",
  "./en/notes/",
  "./nl/notes/",
  "./pl/notes/",
  "./de/notes/",
  "./es/notes/",
  "./fr/notes/",
  "./updates.html",
  "./updates/",
  "./en/updates/",
  "./nl/updates/",
  "./pl/updates/",
  "./de/updates/",
  "./es/updates/",
  "./fr/updates/",
  "./styles.css?v=20260629-mobile-nav-tight",
  "./script.js?v=20260629-mobile-nav-tight",
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
