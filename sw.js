/* ====================================================
   SERVICE WORKER (sw.js) — PWA Offline Sync Mode
   Caches all HTML, CSS, JS files for offline usage
   ==================================================== */

const CACHE_NAME = 'agri-market-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/login.html',
    '/css/base.css',
    '/css/layout.css',
    '/css/components.css',
    '/css/modules.css',
    '/css/auth.css',
    '/js/app.js',
    '/js/auth.js',
    '/js/advanced.js',
    '/js/farmer.js',
    '/js/buyer.js',
    '/js/admin.js',
    '/js/chatbot.js',
    '/js/logistics.js',
    '/js/weather.js',
    '/js/voice.js',
    '/js/blockchain.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800;900&display=swap'
];

// Install Event - Cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 [Service Worker] Caching all assets for offline use');
            // Using catch to prevent entire caching failure if one external asset fails
            return Promise.allSettled(ASSETS.map(url => cache.add(url).catch(e => console.warn('Failed to cache:', url))));
        })
    );
    self.skipWaiting();
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('🧹 [Service Worker] Removing old cache', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Serve from Cache or Network
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if found
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Otherwise fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Don't cache if not a valid response or not from our origin/trusted CDN
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
                    return networkResponse;
                }
                
                // Cache the new response for future
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                
                return networkResponse;
            }).catch(() => {
                // If network fails and it's an HTML request, fallback to index
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});

// Background Sync (Mock)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-orders') {
        event.waitUntil(
            new Promise((resolve) => {
                console.log('🔄 [Service Worker] Background Sync: Syncing orders...');
                setTimeout(resolve, 2000);
            })
        );
    }
});
