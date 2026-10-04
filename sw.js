const CACHE_NAME = 'jjtech-host-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './exploit-runner.js',
  './assets/ps4_pro.jpg',
  './assets/jjtech_logo.png',
  './exploit/psfree.mjs',
  './exploit/lapse.mjs',
  './exploit/config.mjs',
  './exploit/send.mjs',
  './exploit/module/chain.mjs',
  './exploit/module/constants.mjs',
  './exploit/module/int64.mjs',
  './exploit/module/mem.mjs',
  './exploit/module/memtools.mjs',
  './exploit/module/offset.mjs',
  './exploit/module/rw.mjs',
  './exploit/module/utils.mjs',
  './exploit/module/view.mjs',
  './exploit/rop/900.mjs',
  './exploit/kpatch/900.elf'
];

// Installation du Service Worker et mise en cache des ressources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie Cache-First : sert depuis le cache si disponible (idéal pour le offline sur console)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
