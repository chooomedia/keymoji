const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `keymoji-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/index.html';

// Definiere Cache-Strategien
const CACHE_STRATEGIES = {
  CORE_ASSETS: 'core',    // Wichtige App-Assets (HTML, CSS, JS)
  IMAGES: 'images',       // Bilder und Icons
  API: 'api',            // API Requests
  DYNAMIC: 'dynamic'     // Dynamisch gecachte Inhalte
};

// Assets die beim Install gecacht werden sollen
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

const IMAGE_ASSETS = [
  '/static/images/keymoji-logo-11-2023-simple.png',
  '/static/images/keymoji-animated-optimize-resize-160x160px.webp',
  '/static/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.webp'
];

// Dynamisches Asset Matching
const CACHEABLE_EXTENSIONS = [
  'js', 'css', 'woff2', 'woff', 'ttf', 'eot'
].map(ext => `.${ext}`);

// Helper Funktionen
const isNavigationRequest = (request) => 
  request.mode === 'navigate' && request.method === 'GET';

const isAssetRequest = (url) =>
  CACHEABLE_EXTENSIONS.some(ext => url.pathname.endsWith(ext));

const isImageRequest = (url) =>
  url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);

const isAPIRequest = (url) =>
  url.pathname.startsWith('/api/') || url.hostname.includes('api.');

// Cache Management
async function addToCache(cacheName, requests) {
  const cache = await caches.open(cacheName);
  await cache.addAll(requests.map(request => 
    new Request(request, {credentials: 'same-origin'})));
}

async function cleanupCaches() {
  const keys = await caches.keys();
  const oldCaches = keys.filter(key => 
    key.startsWith('keymoji-cache-') && key !== CACHE_NAME);
  return Promise.all(oldCaches.map(key => caches.delete(key)));
}

// Service Worker Event Handlers
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    // Core Assets cachen
    await addToCache(CACHE_STRATEGIES.CORE_ASSETS, CORE_ASSETS);
    // Image Assets cachen
    await addToCache(CACHE_STRATEGIES.IMAGES, IMAGE_ASSETS);
    // Skip Waiting für sofortige Aktivierung
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Alte Caches aufräumen
    await cleanupCaches();
    // Sofort alle Clients übernehmen
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Ignoriere nicht-GET Requests
  if (event.request.method !== 'GET') return;

  // Definiere Cache-Strategie basierend auf Request-Typ
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

  event.respondWith(strategy(event.request));
});

// Cache Strategien
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    // Background sync für Cache-Update
    event.waitUntil(updateCache(request, cache));
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Offline Fallback für Navigation
    if (isNavigationRequest(request)) {
      return caches.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  const networkPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });

  return cached || networkPromise;
}

async function networkOnlyStrategy(request) {
  try {
    return await fetch(request);
  } catch {
    // Für API Requests kein Offline-Fallback
    throw new Error('Network error');
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

// Periodic Sync für regelmäßige Updates
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

// Message Handler für Cache-Kontrolle
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'cleanCache') {
    event.waitUntil(cleanupCaches());
  }
});