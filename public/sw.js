// Service Worker for Wild Dragons PWA - Theme Aware
const CACHE_NAME = 'wild-dragons-v1.2.0'
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.js',
  '/src/App.vue',
  '/src/style.css',
  '/src/data/themes.json',
  '/src/lib/themeManager.js',
  '/src/lib/pwa.js',
  '/src/lib/offlineStorage.js'
]

const DYNAMIC_CACHE = 'wild-dragons-dynamic-v1.2'
const THEME_CACHE = 'wild-dragons-themes-v1'

// Skip waiting and take control immediately
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_CACHE)
      }),
      caches.open(THEME_CACHE).then(cache => {
        console.log('Initializing theme cache')
        return cache.addAll([
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png',
          '/vite.svg'
        ])
      })
    ]).then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== THEME_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      self.clients.claim()
    ])
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  
  // Handle theme-specific requests
  if (url.pathname.includes('/themes/') || url.pathname.includes('themes.json')) {
    event.respondWith(handleThemeRequest(event.request))
    return
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(event.request))
    return
  }

  // Handle all other requests
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }

        // Clone the request
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // Fallback to offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html')
            }
            
            // Return a generic offline response for other requests
            return new Response('Offline', { 
              status: 503, 
              statusText: 'Service Unavailable' 
            })
          })
      })
  )
})

// Handle theme-specific requests
async function handleThemeRequest(request) {
  try {
    // Try cache first for theme assets
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Fetch from network
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // Cache the theme asset
      const cache = await caches.open(THEME_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Fallback for theme requests - return cached version if available
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return empty theme fallback
    return new Response('{}', {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle API requests with offline support
async function handleAPIRequest(request) {
  try {
    // Network first for API requests
    const networkResponse = await fetch(request)
    
    // Cache successful GET requests
    if (request.method === 'GET' && networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Offline - try to serve from cache for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      }
    }
    
    // Return offline indicator
    return new Response(JSON.stringify({ 
      error: 'offline', 
      message: 'Request failed - you are offline' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-battle') {
    console.log('Background sync: processing offline battles')
    event.waitUntil(processPendingBattles())
  }
})

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'background-battle') {
    event.waitUntil(processPendingBattles())
  } else if (event.tag === 'background-preferences') {
    event.waitUntil(syncUserPreferences())
  } else if (event.tag === 'background-gamestate') {
    event.waitUntil(syncGameStates())
  }
})

// Push notifications with theme awareness
self.addEventListener('push', event => {
  console.log('Push notification received')
  
  let notificationData = {
    title: 'Wild Dragons',
    body: 'New content available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  }

  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = { ...notificationData, ...data }
    } catch (error) {
      console.error('Error parsing push data:', error)
      notificationData.body = event.data.text()
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: notificationData.id || 1,
      url: notificationData.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open Game',
        icon: '/icons/play-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-96x96.png'
      }
    ],
    tag: notificationData.tag || 'general',
    renotify: true,
    requireInteraction: false
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event.action)

  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          // Check if there's already a window/tab open with the target URL
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus()
            }
          }
          
          // If not, open a new window/tab
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen)
          }
        })
    )
  }
  // 'close' action just closes the notification (default behavior)
})

// Helper functions for background sync
async function processPendingBattles() {
  try {
    console.log('Processing pending battles...')
    
    // Get pending battles from IndexedDB (simplified - would need actual implementation)
    const battles = await getPendingBattles()
    
    for (const battle of battles) {
      try {
        // Process battle when online
        const response = await fetch('/api/battle/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${battle.token}`
          },
          body: JSON.stringify(battle.data)
        })
        
        if (response.ok) {
          // Mark battle as synced
          await markBattleAsSynced(battle.id)
          console.log(`Battle ${battle.id} synced successfully`)
        }
      } catch (error) {
        console.error(`Failed to sync battle ${battle.id}:`, error)
      }
    }
  } catch (error) {
    console.error('Background battle sync failed:', error)
  }
}

async function syncUserPreferences() {
  try {
    console.log('Syncing user preferences...')
    
    // Implementation would sync offline preference changes
    const preferences = await getPendingPreferences()
    
    for (const pref of preferences) {
      try {
        await fetch('/api/user/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${pref.token}`
          },
          body: JSON.stringify(pref.data)
        })
        
        await markPreferencesAsSynced(pref.userId)
      } catch (error) {
        console.error('Failed to sync preferences:', error)
      }
    }
  } catch (error) {
    console.error('Background preferences sync failed:', error)
  }
}

async function syncGameStates() {
  try {
    console.log('Syncing game states...')
    
    // Implementation would sync offline game state changes
    const gameStates = await getPendingGameStates()
    
    for (const gameState of gameStates) {
      try {
        await fetch('/api/user/gamestate', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gameState.token}`
          },
          body: JSON.stringify(gameState.data)
        })
        
        await markGameStateAsSynced(gameState.userId)
      } catch (error) {
        console.error('Failed to sync game state:', error)
      }
    }
  } catch (error) {
    console.error('Background game state sync failed:', error)
  }
}

// Simplified IndexedDB helpers (would need proper implementation)
async function getPendingBattles() {
  // This would query IndexedDB for unsynced battles
  return []
}

async function markBattleAsSynced(battleId) {
  // This would mark a battle as synced in IndexedDB
  console.log(`Marking battle ${battleId} as synced`)
}

async function getPendingPreferences() {
  // This would query IndexedDB for unsynced preferences
  return []
}

async function markPreferencesAsSynced(userId) {
  // This would mark preferences as synced in IndexedDB
  console.log(`Marking preferences for user ${userId} as synced`)
}

async function getPendingGameStates() {
  // This would query IndexedDB for unsynced game states
  return []
}

async function markGameStateAsSynced(userId) {
  // This would mark game state as synced in IndexedDB
  console.log(`Marking game state for user ${userId} as synced`)
}

// Periodic cleanup of old cached data
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cleanup-cache') {
    event.waitUntil(cleanupOldCache())
  }
})

async function cleanupOldCache() {
  try {
    console.log('Cleaning up old cache entries...')
    
    const cacheNames = await caches.keys()
    const now = Date.now()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
    
    for (const cacheName of cacheNames) {
      if (cacheName.includes('dynamic')) {
        const cache = await caches.open(cacheName)
        const requests = await cache.keys()
        
        for (const request of requests) {
          const response = await cache.match(request)
          if (response) {
            const dateHeader = response.headers.get('date')
            if (dateHeader) {
              const responseDate = new Date(dateHeader).getTime()
              if (now - responseDate > maxAge) {
                await cache.delete(request)
                console.log(`Deleted old cache entry: ${request.url}`)
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error)
  }
}
