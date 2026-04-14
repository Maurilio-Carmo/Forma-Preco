// sw.js

import { APP_VERSION } from './version.js';

const CACHE_NAME = `calculadora-preco-v${APP_VERSION}`;
const STATIC_CACHE = `static-v${APP_VERSION}`;
const DYNAMIC_CACHE = `dynamic-v${APP_VERSION}`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/base/variables.css',
  './css/base/reset.css',
  './src/main.js',
  './icons/favicons/favicon-192.png',
  './icons/favicons/favicon-512.png',
  './icons/favicons/favicon-96.png',
  './icons/calculadora.png',
  './icons/carrinho.png',
  './icons/etiqueta.png',
  './icons/lucro.png'
];

const DYNAMIC_ASSETS_PATTERNS = [
  /\/css\//,
  /\/src\//,
  /\/components\//,
  /\/data\//
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.origin !== location.origin) {
    if (url.hostname.includes('brasilapi')) event.respondWith(fetch(request));
    return;
  }

  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset.replace('./', '')))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error(`[SW] Sem cache para: ${request.url}`);
  }
}
