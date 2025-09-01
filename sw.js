// Service Worker for Hangul Learning System

const CACHE_NAME = 'hangul-learning-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/basic_vowels.html',
  '/basic_consonants.html',
  '/derived_vowels.html',
  '/derived_consonants.html',
  '/composite_vowels.html',
  '/composite_consonants.html',
  '/primitiveletters.html',
  '/hundlism.html',
  '/hangul_wing.html',
  '/css/modern-style.css',
  '/css/lesson-style.css',
  '/js/modern-audio.js',
  '/js/modern-interactions.js',
  '/js/lesson-audio.js',
  '/images/hundlipattern.svg',
  '/images/basicvowels.svg',
  '/images/basicconsonants.svg',
  '/images/derivedvowels.svg',
  '/images/derivedconsonants.svg',
  '/images/compositevowels.svg',
  '/images/compositeconsonants.svg',
  '/images/graduateicon.svg',
  '/images/primitiveletters_dot.svg',
  '/images/primitiveletters_horizontal_line.svg',
  '/images/primitiveletters_vertical_line.svg',
  '/images/primitiveletters_circle.svg',
  '/images/primitiveletters_square.svg',
  '/images/primitiveletters_triangle.svg',
  '/images/speech00.svg',
  '/images/speech02.svg',
  '/images/speech03.svg',
  '/images/speech04.svg',
  '/images/speech05.svg',
  '/images/speech06.svg',
  '/images/speech07.svg',
  '/images/KingSejongTheGreat.png',
  '/sounds/sound01.mp3',
  '/sounds/sound02.mp3',
  '/sounds/sound03.mp3',
  '/sounds/sound04.ogg',
  '/sounds/sound05.ogg',
  '/sounds/sound06.ogg',
  '/sounds/sound07.ogg'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New lesson available!',
    icon: '/images/hundlipattern.svg',
    badge: '/images/hundlipattern.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Start Learning',
        icon: '/images/hundlipattern.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/hundlipattern.svg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Hangul Learning', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
function doBackgroundSync() {
  // Sync any offline data when connection is restored
  return Promise.resolve();
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
