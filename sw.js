// Versioning for cache management
const CACHE_NAME = 'eid-guide-v11';
const ASSETS_TO_CACHE = [
  'index.html',
  'css/style.css',
  'css/responsive.css',
  'js/main.js',
  'js/language-switcher.js',
  'js/checklist.js',
  'js/share-cards.js',
  'js/ai-assistant.js',
  'js/shawwal-tracker.js',
  'js/achievements.js',
  'js/fitrana-calc.js',
  'js/takbeer-counter.js',
  'js/audio-player.js',
  'assets/images/favicon.png',
  'assets/icons/icon-192x192.png',
  'assets/icons/icon-512x512.png',
  'assets/audio/takbeerat.mp3',
  'assets/audio/fatiha.mp3',
  'data/english.json',
  'data/urdu.json',
  'data/hinglish.json'
];

// Add all 21 pages to cache
for (let i = 1; i <= 21; i++) {
  ASSETS_TO_CACHE.push(`page-${i}.html`);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
