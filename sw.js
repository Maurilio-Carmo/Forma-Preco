// sw.js

const CACHE_NAME = 'calculadora-preco-v1.0.10';
const STATIC_CACHE = 'static-v1.0.10';
const DYNAMIC_CACHE = 'dynamic-v1.0.10';

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

// Instala Service Worker e faz cache dos assets estáticos
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Cacheando assets estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativa Service Worker e limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[SW] Ativando Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => {
              return name !== STATIC_CACHE && 
                     name !== DYNAMIC_CACHE;
            })
            .map(name => {
              console.log('[SW] Removendo cache antigo:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Atualização imediata do Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Estratégia de cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Não cacheia APIs externas
  if (url.origin !== location.origin) {
    if (url.hostname.includes('brasilapi')) {
      // Network only para API do CNPJ
      event.respondWith(fetch(request));
      return;
    }
  }
  
  // Assets estáticos: Cache First
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }
  
  // Assets dinâmicos: Stale While Revalidate
  if (DYNAMIC_ASSETS_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }
  
  // Padrão: Network First
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('[SW] Erro ao buscar:', request.url);
    throw error;
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(response => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  
  return cached || fetchPromise;
}