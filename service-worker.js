// service-worker.js
const CACHE_NAME = 'keymoji-cache-v1';
const OFFLINE_URL = '/index.html';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/static/images/keymoji-logo-11-2023-simple.png',
                '/static/images/keymoji-animated-optimize-resize-160x160px.webp',
                '/static/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.svg',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                    });
            })
    );
});

// Regelmäßige Cache-Aktualisierung
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-cache') {
        event.waitUntil(updateCache());
    }
});

async function updateCache() {
    const cache = await caches.open(CACHE_NAME);
    await cache.keys().then((keys) => {
        return Promise.all(
            keys.map((request) => {
                return fetch(request.url).then((response) => {
                    if (response.ok) {
                        return cache.put(request, response);
                    }
                });
            })
        );
    });
}