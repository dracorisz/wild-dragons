// Basic service worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/serviceWorker.js', {
      scope: '/src/',
      updateViaCache: 'none'
    }).then(registration => {
      console.log('ServiceWorker registration successful:', registration);
    }).catch(error => {
      console.log('ServiceWorker registration failed:', error);
    });
  });
}

const CACHE_NAME = 'heroines-dragon-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';
const API_CACHE = 'api-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/App.vue',
  '/src/stores/index.js',
  '/src/stores/gameStore.js',
  '/src/stores/mintingStore.js',
  '/src/router/index.js',
  '/src/assets/css/styles.css',
  '/src/engine/GameEngine.js',
  '/src/web3/TokenTroveConnector.js',
  '/src/ui/UIManager.js',
  '/src/data/DataManager.js',
  '/src/systems/AutoApprovalSystem.js',
  '/src/systems/AutoImprovementSystem.js',
  '/manifest.json',
  '/icons/favicon.svg',
  '/icons/apple-touch-icon.png'
];

const API_ENDPOINTS = [
  '/api/game-state',
  '/api/minting',
  '/api/achievements',
  '/api/user-profile'
];

// Install event - auto-cache essential assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('🔧 Service Worker: Caching static assets');
          return cache.addAll(STATIC_ASSETS);
        }),
      // Auto-preload critical resources
      fetch('/manifest.json').then(response => {
        if (response.ok) {
          return caches.open(STATIC_CACHE).then(cache => cache.put('/manifest.json', response));
        }
      })
    ]).then(() => {
      console.log('🔧 Service Worker: Installation completed');
      return self.skipWaiting();
    }).catch(error => {
      console.error('🔧 Service Worker: Installation failed:', error);
    })
  );
});

// Activate event - auto-cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('🔧 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== API_CACHE) {
            console.log('🔧 Service Worker: Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('🔧 Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - auto-handle requests with intelligent caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Auto-skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Auto-handle API requests
  if (this.isApiRequest(url)) {
    event.respondWith(this.handleApiRequest(request));
    return;
  }
  
  // Auto-handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(this.handleStaticRequest(request));
    return;
  }
  
  // Auto-handle other requests with network-first strategy
  event.respondWith(this.handleNetworkFirstRequest(request));
});

// Auto-detect API requests
function isApiRequest(url) {
  return url.pathname.startsWith('/api/') || 
         url.hostname.includes('tokentrove') || 
         API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint));
}

// Auto-handle API requests with cache-first strategy
async function handleApiRequest(request) {
  try {
    // Auto-try cache first for API requests
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Auto-refresh cache in background
      this.refreshApiCache(request);
      return cachedResponse;
    }
    
    // Auto-fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Auto-cache successful responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
    
  } catch (error) {
    console.error('🔧 Service Worker: API request failed:', error);
    // Auto-return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Auto-return offline response
    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'Content not available offline' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Auto-refresh API cache in background
async function refreshApiCache(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Auto-ignore background refresh failures
  }
}

// Auto-handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('🔧 Service Worker: Static request failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Auto-handle other requests with network-first strategy
async function handleNetworkFirstRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Auto-cache dynamic content
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Auto-fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Auto-return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/index.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Auto-handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-minting') {
    event.waitUntil(syncMintingData());
  } else if (event.tag === 'background-sync-game-state') {
    event.waitUntil(syncGameState());
  } else if (event.tag === 'background-sync-improvements') {
    event.waitUntil(syncImprovements());
  }
});

// Auto-sync minting data
async function syncMintingData() {
  try {
    console.log('💎 Syncing minting data...');
    
    // Auto-retrieve pending minting data
    const pendingData = await getPendingMintingData();
    
    for (const data of pendingData) {
      const response = await fetch('/api/minting/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // Auto-mark as synced
        await markAsSynced(data.id);
      }
    }
    
    console.log('✅ Minting data synced');
    
  } catch (error) {
    console.error('❌ Minting sync failed:', error);
  }
}

// Auto-sync game state
async function syncGameState() {
  try {
    console.log('🎮 Syncing game state...');
    
    const gameState = await getStoredGameState();
    if (gameState) {
      await fetch('/api/game-state/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameState)
      });
    }
    
    console.log('✅ Game state synced');
    
  } catch (error) {
    console.error('❌ Game state sync failed:', error);
  }
}

// Auto-sync improvement data
async function syncImprovements() {
  try {
    console.log('📈 Syncing improvement data...');
    
    const improvements = await getImprovementData();
    if (improvements) {
      await fetch('/api/improvements/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(improvements)
      });
    }
    
    console.log('✅ Improvement data synced');
    
  } catch (error) {
    console.error('❌ Improvement sync failed:', error);
  }
}

// Auto-handle push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: data.data,
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Auto-handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else {
    // Auto-focus existing window
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clients => {
        if (clients.length > 0) {
          return clients[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

// Auto-handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_RESOURCES':
      event.waitUntil(cacheResources(data.urls));
      break;
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache());
      break;
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ cacheSize: size });
      });
      break;
  }
});

// Auto-cache additional resources
async function cacheResources(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  await Promise.all(urls.map(url => 
    fetch(url).then(response => {
      if (response.ok) {
        return cache.put(url, response);
      }
    }).catch(() => {
      // Auto-ignore failed resources
    })
  ));
}

// Auto-clear dynamic cache
async function clearCache() {
  await caches.delete(DYNAMIC_CACHE);
  await caches.open(DYNAMIC_CACHE);
}

// Auto-calculate cache size
async function getCacheSize() {
  let size = 0;
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        size += blob.size;
      }
    }
  }
  
  return size;
}

// Helper functions for data retrieval
async function getPendingMintingData() {
  // Auto-retrieve from IndexedDB or localStorage
  const data = localStorage.getItem('pendingMintingData');
  return data ? JSON.parse(data) : [];
}

async function markAsSynced(id) {
  const data = await getPendingMintingData();
  const updated = data.filter(item => item.id !== id);
  localStorage.setItem('pendingMintingData', JSON.stringify(updated));
}

async function getStoredGameState() {
  const data = localStorage.getItem('gameState');
  return data ? JSON.parse(data) : null;
}

async function getImprovementData() {
  const data = localStorage.getItem('improvementHistory');
  return data ? JSON.parse(data) : null;
}

// Service worker registration is handled at the top of the file
