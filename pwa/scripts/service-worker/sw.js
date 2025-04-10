const CACHE_NAME = "irrigo-cache-v1";
const ASSETS = [
  // Assets
  "/assets/fonts/icons.ttf",
  "/assets/fonts/icons.woff",
  "/assets/fonts/readex-pro.woff",
  "/assets/icons/favicon.ico",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png",
  "/assets/icons/icon.png",
  // Scripts
  "/scripts/modules/irrigo/shared.js",
  "/scripts/modules/irrigo/pump.js",
  // "/scripts/modules/service-worker/register-sw.js",
  // "/scripts/modules/service-worker/sw.js",
  "/scripts/modules/notify.js",
  "/scripts/modules/signal.js",
  "/scripts/modules/storage.js",
  "/scripts/modules/theme.js",
  "/scripts/modules/utils.js",
  "/scripts/common.js",
  "/scripts/home.js",
  "/scripts/jquery.min.js",
  // Styles
  "/styles/modules/_icons.css",
  "/styles/modules/_notify.css",
  "/styles/modules/_reset.css",
  "/styles/modules/_theme.css",
  "/styles/global.css",
  "/styles/home.css",
  // root
  "/manifest.json",
  "/index.html",
];
const filesUpdate = (cache) => {
  const stack = [];
  ASSETS.forEach((file) =>
    stack.push(
      cache
        .add(file)
        .catch((_) => console.error(`can't load ${file} to cache`))
    )
  );  
  return Promise.all(stack);
};

// Install event: Caching assets
self.addEventListener("install", (event) => {

  event.waitUntil(caches.open(CACHE_NAME).then(filesUpdate));
});

// Fetch event: Serve cached assets
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate event: Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});
