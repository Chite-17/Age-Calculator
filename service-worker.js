const CACHE_NAME = 'age-calculator-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon.png',
  '/icons/icon2.png',
  '/apple-touch-icon.png',
  '/screenshots/screenshot-1024.png',
  '/screenshots/screenshot-512.png',
  '/background.jpg'
];

// const offlineFallbackPage = "index.html";

   self.addEventListener("message", (event) => {
     if (event.data && event.data.type === "SKIP_WAITING") {
       self.skipWaiting();
     }
   });

   self.addEventListener('install', function (event) {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then(function(cache) {
           console.log('Opened cache')
         return cache.addAll(urlsToCache);
          })
     );
   });

   self.addEventListener('fetch', function(event) {
        event.respondWith(
           caches.match(event.request)
             .then(function(response) {
         if (response) {
              return response;
         }
         return fetch(event.request).catch(function() {
             return caches.match('/index.html');
          });
         })
     );

   });

   self.addEventListener('activate',function(event) {
       var cacheWhitelist = [CACHE_NAME];

       event.waitUntil(
         caches.keys().then(function(keyList) {
           return Promise.all(keyList.map(function(key) {
             if (cacheWhitelist.indexOf(key) === -1) {
               return caches.delete(key);
             }
           }));
        })
       );
   });This is the "Offline page" service worker

