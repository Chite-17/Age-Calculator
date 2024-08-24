const CACHE_NAME = 'age-calculator-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/ikon.png',
  '/icons/ikon2.png',
  '/apple-touch-icon.png',
  '/screenshots/screenshot1.png',
  '/screenshots/screenshot2.png',
  '/background.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Try to add all URLs to the cache
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(error => {
              console.error(`Failed to cache ${url}:`, error);
            });
          })
        );
      })
      .catch(error => {
        console.error('Failed to open cache:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
self.addEventListener('sync', event => {
    if (event.tag === 'sync-age-calculation') {
        event.waitUntil(syncAgeCalculation());
    }
});
async function syncAgeCalculation() {
    // Code to sync data with the server
    try {
        // Perform the necessary actions (e.g., POST data to server)
        console.log('Background sync in progress...');
        // Example: Sending data to the server
        const response = await fetch('/sync', {
            method: 'POST',
            body: JSON.stringify({ /* Your data */ }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Failed to sync');
        }
        console.log('Background sync completed.');
    } catch (error) {
        console.error('Background sync failed:', error);
        throw error;
    }
}
if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('sync-age-calculation');
    }).then(() => {
        console.log('Background sync registered');
    }).catch(err => {
        console.error('Background sync registration failed:', err);
    });
}
if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            subscribeUserToPush();
        }
    });
}


