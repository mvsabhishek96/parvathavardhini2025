// Version: 2.0 (Search, Sort, and Mobile View Update)
const CACHE_NAME = 'donation-portal-cache-v2'; // <-- Changed v1 to v2
const urlsToCache = [
  '/',
  '/index.html'
  // Add other important files here if needed, like a CSS file
];

// 1. Installation: Caches the new files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching new files');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activation: Cleans up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Keep only the new cache
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName); // Delete all other versions
          }
        })
      );
    })
  );
});

// 3. Fetch: Serves the app from cache for offline access
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      })
  );
});