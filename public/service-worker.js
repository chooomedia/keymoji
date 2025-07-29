// public/service-worker.js
const CACHE_VERSION = 'v1.1.0'; // Increment this version whenever you deploy
const CACHE_NAME = `keymoji-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/index.html';

// Define caching strategies
const CACHE_STRATEGIES = {
    CORE_ASSETS: 'core', // Important app assets (HTML, CSS, JS)
    IMAGES: 'images', // Images and icons
    API: 'api', // API Requests
    DYNAMIC: 'dynamic' // Dynamically cached content
};

// Assets to cache on install
const CORE_ASSETS = ['/', '/index.html', '/manifest.json'];

const IMAGE_ASSETS = [
    '/static/images/keymoji-logo-11-2023-simple.png',
    '/static/images/keymoji-animated-optimize-resize-160x160px.webp',
    '/static/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.webp'
];

// Dynamic asset matching
const CACHEABLE_EXTENSIONS = ['js', 'css', 'woff2', 'woff', 'ttf', 'eot'].map(
    ext => `.${ext}`
);

// Helper functions
const isNavigationRequest = request =>
    request.mode === 'navigate' && request.method === 'GET';

const isAssetRequest = url =>
    CACHEABLE_EXTENSIONS.some(ext => url.pathname.endsWith(ext));

const isImageRequest = url =>
    url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);

const isAPIRequest = url =>
    url.pathname.startsWith('/api/') || url.hostname.includes('api.');

// Helper to check if URL should be cached
const isValidCacheableUrl = url => {
    // Ignore chrome-extension:// URLs
    if (url.protocol === 'chrome-extension:') return false;
    // Ignore invalid URLs
    if (url.hostname === 'invalid') return false;
    // Only cache http/https
    return url.protocol === 'http:' || url.protocol === 'https:';
};

// Cache Management
async function addToCache(cacheName, requests) {
    const cache = await caches.open(cacheName);
    await Promise.allSettled(
        requests.map(async request => {
            try {
                const req = new Request(request, {
                    credentials: 'same-origin'
                });
                const response = await fetch(req);
                if (response.ok) {
                    return cache.put(req, response);
                }
            } catch (error) {
                console.error(`Failed to cache ${request}:`, error);
            }
        })
    );
}

async function cleanupCaches() {
    const keys = await caches.keys();
    const oldCaches = keys.filter(
        key => key.startsWith('keymoji-cache-') && key !== CACHE_NAME
    );
    return Promise.all(oldCaches.map(key => caches.delete(key)));
}

// Service Worker Event Handlers
self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            // Cache core assets
            await addToCache(CACHE_STRATEGIES.CORE_ASSETS, CORE_ASSETS);
            // Cache image assets
            await addToCache(CACHE_STRATEGIES.IMAGES, IMAGE_ASSETS);
            // Skip waiting for immediate activation
            await self.skipWaiting();
            console.log(
                `Service Worker installed with cache version ${CACHE_VERSION}`
            );
        })()
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            // Clean up old caches
            await cleanupCaches();
            // Immediately take over all clients
            await self.clients.claim();
            console.log(
                `Service Worker activated with cache version ${CACHE_VERSION}`
            );

            // Notify clients about update
            const clients = await self.clients.matchAll({ type: 'window' });
            clients.forEach(client => {
                client.postMessage({
                    type: 'SW_UPDATED',
                    version: CACHE_VERSION
                });
            });
        })()
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Ignore non-GET requests
    if (event.request.method !== 'GET') return;

    // Ignore chrome-extension and invalid URLs
    if (!isValidCacheableUrl(url)) return;

    // Define caching strategy based on request type
    let strategy;
    if (isNavigationRequest(event.request)) {
        strategy = networkFirstStrategy;
    } else if (isAssetRequest(url)) {
        strategy = cacheFirstStrategy;
    } else if (isImageRequest(url)) {
        strategy = staleWhileRevalidateStrategy;
    } else if (isAPIRequest(url)) {
        strategy = networkOnlyStrategy;
    } else {
        strategy = networkFirstStrategy;
    }

    try {
        event.respondWith(strategy(event.request));
    } catch (error) {
        console.error('Service worker strategy failed:', error);
        // Fallback to a basic error response
        event.respondWith(
            new Response('Service worker error', {
                status: 500,
                headers: { 'Content-Type': 'text/plain' }
            })
        );
    }
});

// Cache Strategies
async function cacheFirstStrategy(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
        // Background sync for cache update
        updateCache(request, cache);
        return cached;
    }

    try {
        const response = await fetch(request);
        // Only cache successful responses from valid origins
        if (response.ok && response.type !== 'opaque') {
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function networkFirstStrategy(request) {
    try {
        const response = await fetch(request);
        // Only cache successful responses from valid origins
        if (response.ok && response.type !== 'opaque') {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.warn('Network first strategy failed for:', request.url, error);

        // Try to get from cache
        const cached = await caches.match(request);
        if (cached) {
            console.log('Serving from cache:', request.url);
            return cached;
        }

        // Offline fallback for navigation
        if (isNavigationRequest(request)) {
            const offlineResponse = await caches.match(OFFLINE_URL);
            if (offlineResponse) {
                console.log('Serving offline page for:', request.url);
                return offlineResponse;
            }
        }

        // Return a proper error response instead of throwing
        return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    const networkPromise = fetch(request)
        .then(response => {
            if (response.ok) cache.put(request, response.clone());
            return response;
        })
        .catch(error => {
            console.warn(`Failed to fetch ${request.url}:`, error);
            // Return cached response if available, otherwise return error response
            if (cached) {
                console.log('Serving stale from cache:', request.url);
                return cached;
            }
            return new Response('Network error happened', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
            });
        });

    return cached || networkPromise;
}

async function networkOnlyStrategy(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.warn('Network only strategy failed for:', request.url, error);
        // Return a proper error response instead of throwing
        return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Background Sync
async function updateCache(request, cache) {
    try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response);
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Periodic Sync for regular updates
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-cache') {
        event.waitUntil(updateAllCaches());
    }
});

async function updateAllCaches() {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();

    return Promise.all(
        requests.map(async request => {
            try {
                await updateCache(request, cache);
            } catch (error) {
                console.error('Failed to update cache for:', request.url);
            }
        })
    );
}

// Message Handler for cache control
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }

    if (event.data === 'cleanCache') {
        event.waitUntil(cleanupCaches());
    }

    // Handle reload requests
    if (event.data === 'promptForReload') {
        // Reply to client with confirmation to show prompt
        event.ports[0].postMessage({
            accepted: true,
            version: CACHE_VERSION
        });
    }
});
