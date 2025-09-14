// Enhanced Offline Storage for PWA
// Provides robust offline data management with IndexedDB and localStorage fallback

class OfflineStorageManager {
  constructor() {
    this.dbName = 'WildDragonsDB'
    this.dbVersion = 1
    this.db = null
    this.isIndexedDBSupported = 'indexedDB' in window
    this.init()
  }

  // Initialize IndexedDB
  async init() {
    if (!this.isIndexedDBSupported) {
      console.warn('IndexedDB not supported, falling back to localStorage')
      return
    }

    try {
      this.db = await this.openDatabase()
      console.log('Offline storage initialized')
    } catch (error) {
      console.error('Failed to initialize offline storage:', error)
    }
  }

  // Open IndexedDB database
  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Game states store
        if (!db.objectStoreNames.contains('gameStates')) {
          const gameStore = db.createObjectStore('gameStates', { keyPath: 'id' })
          gameStore.createIndex('userId', 'userId', { unique: false })
          gameStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Battle results store
        if (!db.objectStoreNames.contains('battleResults')) {
          const battleStore = db.createObjectStore('battleResults', { keyPath: 'id' })
          battleStore.createIndex('userId', 'userId', { unique: false })
          battleStore.createIndex('synced', 'synced', { unique: false })
          battleStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // User preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'userId' })
        }

        // Cached data store
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' })
          cacheStore.createIndex('expires', 'expires', { unique: false })
        }
      }
    })
  }

  // Save game state
  async saveGameState(userId, gameState) {
    const data = {
      id: `gameState_${userId}`,
      userId,
      gameState,
      timestamp: Date.now(),
      version: 1
    }

    if (this.db) {
      try {
        const transaction = this.db.transaction(['gameStates'], 'readwrite')
        const store = transaction.objectStore('gameStates')
        await store.put(data)
        console.log('Game state saved to IndexedDB')
        return true
      } catch (error) {
        console.error('Failed to save game state to IndexedDB:', error)
      }
    }

    // Fallback to localStorage
    try {
      localStorage.setItem(`gameState_${userId}`, JSON.stringify(data))
      console.log('Game state saved to localStorage')
      return true
    } catch (error) {
      console.error('Failed to save game state:', error)
      return false
    }
  }

  // Load game state
  async loadGameState(userId) {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['gameStates'], 'readonly')
        const store = transaction.objectStore('gameStates')
        const result = await store.get(`gameState_${userId}`)
        
        if (result) {
          console.log('Game state loaded from IndexedDB')
          return result.gameState
        }
      } catch (error) {
        console.error('Failed to load game state from IndexedDB:', error)
      }
    }

    // Fallback to localStorage
    try {
      const saved = localStorage.getItem(`gameState_${userId}`)
      if (saved) {
        const data = JSON.parse(saved)
        console.log('Game state loaded from localStorage')
        return data.gameState
      }
    } catch (error) {
      console.error('Failed to load game state:', error)
    }

    return null
  }

  // Save battle result for offline sync
  async saveBattleResult(userId, battleData) {
    const data = {
      id: `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      battleData,
      timestamp: Date.now(),
      synced: false
    }

    if (this.db) {
      try {
        const transaction = this.db.transaction(['battleResults'], 'readwrite')
        const store = transaction.objectStore('battleResults')
        await store.add(data)
        console.log('Battle result saved for sync')
        return data.id
      } catch (error) {
        console.error('Failed to save battle result:', error)
      }
    }

    // Fallback to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('pendingBattles') || '[]')
      existing.push(data)
      localStorage.setItem('pendingBattles', JSON.stringify(existing))
      console.log('Battle result saved to localStorage')
      return data.id
    } catch (error) {
      console.error('Failed to save battle result:', error)
      return null
    }
  }

  // Get unsynced battle results
  async getUnsyncedBattles(userId) {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['battleResults'], 'readonly')
        const store = transaction.objectStore('battleResults')
        const index = store.index('synced')
        const results = []
        
        const request = index.openCursor(IDBKeyRange.only(false))
        
        return new Promise((resolve) => {
          request.onsuccess = (event) => {
            const cursor = event.target.result
            if (cursor) {
              if (cursor.value.userId === userId) {
                results.push(cursor.value)
              }
              cursor.continue()
            } else {
              resolve(results)
            }
          }
        })
      } catch (error) {
        console.error('Failed to get unsynced battles:', error)
      }
    }

    // Fallback to localStorage
    try {
      const pending = JSON.parse(localStorage.getItem('pendingBattles') || '[]')
      return pending.filter(battle => battle.userId === userId && !battle.synced)
    } catch (error) {
      console.error('Failed to get unsynced battles from localStorage:', error)
      return []
    }
  }

  // Mark battle as synced
  async markBattleSynced(battleId) {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['battleResults'], 'readwrite')
        const store = transaction.objectStore('battleResults')
        const battle = await store.get(battleId)
        
        if (battle) {
          battle.synced = true
          battle.syncedAt = Date.now()
          await store.put(battle)
          console.log(`Battle ${battleId} marked as synced`)
          return true
        }
      } catch (error) {
        console.error('Failed to mark battle as synced:', error)
      }
    }

    // Fallback to localStorage
    try {
      const pending = JSON.parse(localStorage.getItem('pendingBattles') || '[]')
      const updated = pending.map(battle => 
        battle.id === battleId ? { ...battle, synced: true, syncedAt: Date.now() } : battle
      )
      localStorage.setItem('pendingBattles', JSON.stringify(updated))
      return true
    } catch (error) {
      console.error('Failed to mark battle as synced in localStorage:', error)
      return false
    }
  }

  // Save user preferences
  async savePreferences(userId, preferences) {
    const data = {
      userId,
      preferences,
      timestamp: Date.now()
    }

    if (this.db) {
      try {
        const transaction = this.db.transaction(['preferences'], 'readwrite')
        const store = transaction.objectStore('preferences')
        await store.put(data)
        console.log('Preferences saved to IndexedDB')
        return true
      } catch (error) {
        console.error('Failed to save preferences to IndexedDB:', error)
      }
    }

    // Fallback to localStorage
    try {
      localStorage.setItem(`preferences_${userId}`, JSON.stringify(data))
      console.log('Preferences saved to localStorage')
      return true
    } catch (error) {
      console.error('Failed to save preferences:', error)
      return false
    }
  }

  // Load user preferences
  async loadPreferences(userId) {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['preferences'], 'readonly')
        const store = transaction.objectStore('preferences')
        const result = await store.get(userId)
        
        if (result) {
          console.log('Preferences loaded from IndexedDB')
          return result.preferences
        }
      } catch (error) {
        console.error('Failed to load preferences from IndexedDB:', error)
      }
    }

    // Fallback to localStorage
    try {
      const saved = localStorage.getItem(`preferences_${userId}`)
      if (saved) {
        const data = JSON.parse(saved)
        console.log('Preferences loaded from localStorage')
        return data.preferences
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    }

    // Default preferences
    return {
      soundEffects: true,
      backgroundMusic: true,
      notifications: true,
      theme: 'dragons',
      language: 'en'
    }
  }

  // Cache data with expiration
  async cacheData(key, data, expiresInMs = 3600000) { // Default 1 hour
    const cacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      expires: Date.now() + expiresInMs
    }

    if (this.db) {
      try {
        const transaction = this.db.transaction(['cache'], 'readwrite')
        const store = transaction.objectStore('cache')
        await store.put(cacheEntry)
        return true
      } catch (error) {
        console.error('Failed to cache data:', error)
      }
    }

    // Fallback to localStorage with size limit
    try {
      const cacheKey = `cache_${key}`
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry))
      return true
    } catch (error) {
      console.error('Failed to cache data to localStorage:', error)
      return false
    }
  }

  // Get cached data
  async getCachedData(key) {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['cache'], 'readonly')
        const store = transaction.objectStore('cache')
        const result = await store.get(key)
        
        if (result && result.expires > Date.now()) {
          return result.data
        } else if (result) {
          // Expired, remove it
          const deleteTransaction = this.db.transaction(['cache'], 'readwrite')
          const deleteStore = deleteTransaction.objectStore('cache')
          await deleteStore.delete(key)
        }
      } catch (error) {
        console.error('Failed to get cached data:', error)
      }
    }

    // Fallback to localStorage
    try {
      const cacheKey = `cache_${key}`
      const saved = localStorage.getItem(cacheKey)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.expires > Date.now()) {
          return data.data
        } else {
          localStorage.removeItem(cacheKey)
        }
      }
    } catch (error) {
      console.error('Failed to get cached data from localStorage:', error)
    }

    return null
  }

  // Clear expired cache entries
  async clearExpiredCache() {
    const now = Date.now()

    if (this.db) {
      try {
        const transaction = this.db.transaction(['cache'], 'readwrite')
        const store = transaction.objectStore('cache')
        const index = store.index('expires')
        const range = IDBKeyRange.upperBound(now)
        
        const request = index.openCursor(range)
        request.onsuccess = (event) => {
          const cursor = event.target.result
          if (cursor) {
            store.delete(cursor.primaryKey)
            cursor.continue()
          }
        }
      } catch (error) {
        console.error('Failed to clear expired cache:', error)
      }
    }

    // Clear localStorage cache
    try {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('cache_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key))
            if (data.expires <= now) {
              keysToRemove.push(key)
            }
          } catch (e) {
            keysToRemove.push(key) // Remove corrupted entries
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
      console.log(`Cleared ${keysToRemove.length} expired cache entries`)
    } catch (error) {
      console.error('Failed to clear localStorage cache:', error)
    }
  }

  // Get storage usage stats
  async getStorageStats() {
    const stats = {
      indexedDB: null,
      localStorage: null
    }

    // IndexedDB stats
    if (this.db && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        stats.indexedDB = {
          quota: estimate.quota,
          usage: estimate.usage,
          available: estimate.quota - estimate.usage
        }
      } catch (error) {
        console.error('Failed to get IndexedDB stats:', error)
      }
    }

    // localStorage stats (approximate)
    try {
      let localStorageSize = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorageSize += localStorage[key].length + key.length
        }
      }
      
      stats.localStorage = {
        usage: localStorageSize,
        quota: 5 * 1024 * 1024, // Approximate 5MB limit
        available: (5 * 1024 * 1024) - localStorageSize
      }
    } catch (error) {
      console.error('Failed to calculate localStorage stats:', error)
    }

    return stats
  }
}

// Create singleton instance
export const offlineStorage = new OfflineStorageManager()

// Export enhanced utilities
export const offlineUtils = {
  // Save game state
  saveGameState: (userId, state) => offlineStorage.saveGameState(userId, state),
  
  // Load game state
  loadGameState: (userId) => offlineStorage.loadGameState(userId),
  
  // Save battle for sync
  saveBattleOffline: (userId, battleData) => offlineStorage.saveBattleResult(userId, battleData),
  
  // Get pending battles
  getPendingBattles: (userId) => offlineStorage.getUnsyncedBattles(userId),
  
  // Mark battle synced
  markBattleSynced: (battleId) => offlineStorage.markBattleSynced(battleId),
  
  // User preferences
  savePreferences: (userId, prefs) => offlineStorage.savePreferences(userId, prefs),
  loadPreferences: (userId) => offlineStorage.loadPreferences(userId),
  
  // Caching
  cache: (key, data, ttl) => offlineStorage.cacheData(key, data, ttl),
  getCache: (key) => offlineStorage.getCachedData(key),
  
  // Maintenance
  clearExpiredCache: () => offlineStorage.clearExpiredCache(),
  getStorageStats: () => offlineStorage.getStorageStats()
}

export default offlineStorage
