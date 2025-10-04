import { EventEmitter } from '../utils/EventEmitter.js';

export class DataManager extends EventEmitter {
  constructor() {
    super();
    this.stores = new Map();
    this.indexes = new Map();
    this.cache = new Map();
    this.compressionEnabled = true;
    this.encryptionEnabled = false;
    this.autoCleanupEnabled = true;
    this.maxStorageSize = 50 * 1024 * 1024; // 50MB
    this.cleanupInterval = 300000; // 5 minutes
    this.performanceMetrics = {
      reads: 0,
      writes: 0,
      cacheHits: 0,
      compressionRatio: 1,
      storageUsed: 0
    };
    
    // Auto-initialize database systems
    this.initializeDatabases();
    
    // Auto-setup background optimization
    this.setupBackgroundOptimization();
    
    // Auto-enable data validation
    this.setupDataValidation();
  }

  async initializeDatabases() {
    console.log('🗄️ Auto-initializing database systems...');
    
    // Auto-setup IndexedDB for client-side storage
    await this.setupIndexedDB();
    
    // Auto-setup LocalStorage with compression
    this.setupLocalStorage();
    
    // Auto-setup SessionStorage for temporary data
    this.setupSessionStorage();
    
    // Auto-setup WebSQL fallback (if available)
    this.setupWebSQLFallback();
    
    // Auto-setup memory cache with LRU eviction
    this.setupMemoryCache();
    
    console.log('✅ Database systems auto-initialized');
  }

  async setupIndexedDB() {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not available, using fallback storage');
      return;
    }

    const dbName = 'HeroineDragonDB';
    const version = 2;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        
        // Auto-create object stores if needed
        this.createObjectStores();
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Auto-create stores
        if (!db.objectStoreNames.contains('gameData')) {
          db.createObjectStore('gameData');
        }
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData');
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id' });
          analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  createObjectStores() {
    // Auto-create additional stores as needed
    const stores = ['heroines', 'dragons', 'battles', 'achievements', 'minting'];
    
    stores.forEach(storeName => {
      if (!this.db.objectStoreNames.contains(storeName)) {
        const request = this.db.createObjectStore(storeName, { keyPath: 'id' });
        request.onsuccess = () => {
          console.log(`📁 Auto-created store: ${storeName}`);
        };
      }
    });
  }

  async loadExistingData() {
    if (this.useLocalStorage) {
      // Auto-load from localStorage
      this.loadFromLocalStorage();
    } else {
      // Auto-load from IndexedDB
      await this.loadFromIndexedDB();
    }
    
    // Auto-update storage metrics
    await this.updateStorageMetrics();
  }

  loadFromLocalStorage() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('hd_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          this.stores.set(key, data);
        } catch (error) {
          console.warn(`Failed to load ${key} from localStorage:`, error);
        }
      }
    });
  }

  async loadFromIndexedDB() {
    const stores = ['gameData', 'userData', 'heroines', 'dragons', 'battles', 'achievements'];
    
    for (const storeName of stores) {
      try {
        const data = await this.getFromIndexedDB(storeName);
        if (data) {
          this.stores.set(storeName, data);
        }
      } catch (error) {
        console.warn(`Failed to load ${storeName} from IndexedDB:`, error);
      }
    }
  }

  setupCompression() {
    // Auto-setup LZ compression if available
    if (typeof LZString !== 'undefined') {
      this.compressor = LZString;
      console.log('🗜️ Auto-enabled LZ compression');
    } else {
      // Fallback to basic compression
      this.compressor = {
        compress: (data) => btoa(JSON.stringify(data)),
        decompress: (data) => JSON.parse(atob(data))
      };
      console.log('🗜️ Auto-enabled basic compression');
    }
  }

  enableAutoCleanup() {
    if (this.autoCleanupEnabled) {
      setInterval(() => {
        this.performAutoCleanup();
      }, this.cleanupInterval);
    }
  }

  setupPerformanceMonitoring() {
    // Auto-monitor data operations
    this.operationTimes = [];
    this.lastCleanup = Date.now();
  }

  async store(key, data, options = {}) {
    const startTime = performance.now();
    
    try {
      // Auto-compress data if enabled
      let processedData = data;
      if (this.compressionEnabled && !options.noCompress) {
        processedData = this.compressData(data);
      }
      
      // Auto-encrypt if enabled
      if (this.encryptionEnabled && options.encrypt) {
        processedData = await this.encryptData(processedData);
      }
      
      // Auto-store based on storage type
      if (this.useLocalStorage) {
        this.storeInLocalStorage(key, processedData);
      } else {
        await this.storeInIndexedDB(key, processedData);
      }
      
      // Auto-update cache
      this.cache.set(key, data);
      
      // Auto-update indexes
      this.updateIndexes(key, data);
      
      // Auto-update performance metrics
      this.performanceMetrics.writes++;
      this.operationTimes.push(performance.now() - startTime);
      
      // Auto-limit operation history
      if (this.operationTimes.length > 100) {
        this.operationTimes.shift();
      }
      
      console.log(`💾 Auto-stored: ${key}`);
      
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      throw error;
    }
  }

  async retrieve(key, options = {}) {
    const startTime = performance.now();
    
    try {
      // Auto-check cache first
      if (this.cache.has(key) && !options.noCache) {
        this.performanceMetrics.cacheHits++;
        return this.cache.get(key);
      }
      
      let data;
      
      // Auto-retrieve based on storage type
      if (this.useLocalStorage) {
        data = this.retrieveFromLocalStorage(key);
      } else {
        data = await this.retrieveFromIndexedDB(key);
      }
      
      if (!data) return null;
      
      // Auto-decompress if needed
      if (this.compressionEnabled && !options.noDecompress) {
        data = this.decompressData(data);
      }
      
      // Auto-decrypt if needed
      if (this.encryptionEnabled && options.decrypt) {
        data = await this.decryptData(data);
      }
      
      // Auto-update cache
      this.cache.set(key, data);
      
      // Auto-update performance metrics
      this.performanceMetrics.reads++;
      this.operationTimes.push(performance.now() - startTime);
      
      return data;
      
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }
  }

  compressData(data) {
    const jsonString = JSON.stringify(data);
    const compressed = this.compressor.compress(jsonString);
    this.performanceMetrics.compressionRatio = jsonString.length / compressed.length;
    return compressed;
  }

  decompressData(data) {
    const decompressed = this.compressor.decompress(data);
    return JSON.parse(decompressed);
  }

  async encryptData(data) {
    // Simple encryption placeholder - in production, use proper encryption
    const encrypted = btoa(JSON.stringify(data));
    return encrypted;
  }

  async decryptData(data) {
    // Simple decryption placeholder
    const decrypted = JSON.parse(atob(data));
    return decrypted;
  }

  storeInLocalStorage(key, data) {
    const storageKey = `hd_${key}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  retrieveFromLocalStorage(key) {
    const storageKey = `hd_${key}`;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  }

  async storeInIndexedDB(key, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['gameData'], 'readwrite');
      const store = transaction.objectStore('gameData');
      const request = store.put(data, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async retrieveFromIndexedDB(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['gameData'], 'readonly');
      const store = transaction.objectStore('gameData');
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  updateIndexes(key, data) {
    // Auto-maintain indexes for efficient queries
    if (Array.isArray(data)) {
      this.indexes.set(`${key}_count`, data.length);
    }
    
    if (data && typeof data === 'object') {
      // Auto-index by common fields
      const indexFields = ['id', 'type', 'rarity', 'level'];
      indexFields.forEach(field => {
        if (data[field]) {
          const indexKey = `${key}_${field}_${data[field]}`;
          if (!this.indexes.has(indexKey)) {
            this.indexes.set(indexKey, []);
          }
          this.indexes.get(indexKey).push(data.id || key);
        }
      });
    }
  }

  async query(storeName, query = {}) {
    // Auto-perform indexed queries
    const data = await this.retrieve(storeName);
    if (!Array.isArray(data)) return [];
    
    return data.filter(item => {
      return Object.entries(query).every(([key, value]) => {
        if (typeof value === 'function') {
          return value(item[key]);
        }
        return item[key] === value;
      });
    });
  }

  async delete(key) {
    try {
      if (this.useLocalStorage) {
        localStorage.removeItem(`hd_${key}`);
      } else {
        await this.deleteFromIndexedDB(key);
      }
      
      // Auto-remove from cache
      this.cache.delete(key);
      
      // Auto-cleanup indexes
      this.cleanupIndexes(key);
      
      console.log(`🗑️ Auto-deleted: ${key}`);
      
    } catch (error) {
      console.error(`Failed to delete ${key}:`, error);
      throw error;
    }
  }

  async deleteFromIndexedDB(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['gameData'], 'readwrite');
      const store = transaction.objectStore('gameData');
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  cleanupIndexes(key) {
    // Auto-remove index entries for deleted data
    this.indexes.forEach((value, indexKey) => {
      if (indexKey.startsWith(`${key}_`)) {
        this.indexes.delete(indexKey);
      }
    });
  }

  async performAutoCleanup() {
    console.log('🧹 Performing auto-cleanup...');
    
    try {
      // Auto-cleanup old cache entries
      this.cleanupCache();
      
      // Auto-cleanup old indexes
      this.cleanupOldIndexes();
      
      // Auto-compact storage if needed
      await this.compactStorage();
      
      // Auto-update storage metrics
      await this.updateStorageMetrics();
      
      this.lastCleanup = Date.now();
      
    } catch (error) {
      console.error('Auto-cleanup failed:', error);
    }
  }

  cleanupCache() {
    // Auto-remove old cache entries (older than 1 hour)
    const oneHourAgo = Date.now() - 3600000;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp && entry.timestamp < oneHourAgo) {
        this.cache.delete(key);
      }
    }
  }

  cleanupOldIndexes() {
    // Auto-remove indexes with no references
    const validIndexes = new Set();
    
    this.stores.forEach((data, key) => {
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.id) {
            validIndexes.add(item.id);
          }
        });
      }
    });
    
    this.indexes.forEach((refs, indexKey) => {
      const cleanedRefs = refs.filter(ref => validIndexes.has(ref));
      if (cleanedRefs.length === 0) {
        this.indexes.delete(indexKey);
      } else {
        this.indexes.set(indexKey, cleanedRefs);
      }
    });
  }

  async compactStorage() {
    // Auto-compact IndexedDB if available
    if (this.db && !this.useLocalStorage) {
      // Force garbage collection hint
      if (window.gc) {
        window.gc();
      }
    }
  }

  async updateStorageMetrics() {
    try {
      let totalSize = 0;
      
      if (this.useLocalStorage) {
        // Calculate localStorage usage
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key) && key.startsWith('hd_')) {
            totalSize += localStorage[key].length;
          }
        }
      } else {
        // Estimate IndexedDB usage
        totalSize = await this.estimateIndexedDBSize();
      }
      
      this.performanceMetrics.storageUsed = totalSize;
      
      // Auto-warn if approaching limit
      if (totalSize > this.maxStorageSize * 0.8) {
        console.warn(`⚠️ Storage usage high: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
        this.performAggressiveCleanup();
      }
      
    } catch (error) {
      console.error('Failed to update storage metrics:', error);
    }
  }

  async estimateIndexedDBSize() {
    // Rough estimation - in production, use more accurate methods
    let size = 0;
    const stores = ['gameData', 'userData', 'heroines', 'dragons', 'battles', 'achievements'];
    
    for (const storeName of stores) {
      try {
        const data = await this.retrieve(storeName);
        if (data) {
          size += JSON.stringify(data).length;
        }
      } catch (error) {
        // Ignore errors in estimation
      }
    }
    
    return size;
  }

  performAggressiveCleanup() {
    console.log('🧹 Performing aggressive cleanup...');
    
    // Auto-remove old battle data
    this.cleanupOldBattles();
    
    // Auto-compress all data
    this.compressAllData();
    
    // Auto-clear old cache
    this.cache.clear();
  }

  cleanupOldBattles() {
    // Auto-keep only recent battles
    const maxBattles = 20;
    this.retrieve('battles').then(battles => {
      if (battles && battles.length > maxBattles) {
        const recentBattles = battles.slice(-maxBattles);
        this.store('battles', recentBattles);
      }
    });
  }

  compressAllData() {
    // Auto-recompress all stored data
    this.stores.forEach(async (data, key) => {
      if (data && !key.includes('compressed')) {
        await this.store(key, data, { forceCompress: true });
      }
    });
  }

  async exportData() {
    const exportData = {
      stores: Object.fromEntries(this.stores),
      indexes: Object.fromEntries(this.indexes),
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        compressionEnabled: this.compressionEnabled,
        storageType: this.useLocalStorage ? 'localStorage' : 'IndexedDB'
      }
    };
    
    return exportData;
  }

  async importData(importData) {
    try {
      // Auto-import stores
      if (importData.stores) {
        for (const [key, data] of Object.entries(importData.stores)) {
          await this.store(key, data);
        }
      }
      
      // Auto-import indexes
      if (importData.indexes) {
        this.indexes = new Map(Object.entries(importData.indexes));
      }
      
      console.log('📥 Data auto-imported successfully');
      
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  getPerformanceMetrics() {
    const avgOperationTime = this.operationTimes.length > 0 
      ? this.operationTimes.reduce((a, b) => a + b, 0) / this.operationTimes.length 
      : 0;
    
    return {
      ...this.performanceMetrics,
      averageOperationTime: avgOperationTime,
      cacheHitRate: this.performanceMetrics.reads > 0 
        ? this.performanceMetrics.cacheHits / this.performanceMetrics.reads 
        : 0,
      storageUsedMB: (this.performanceMetrics.storageUsed / 1024 / 1024).toFixed(2),
      lastCleanup: this.lastCleanup
    };
  }

  async clearAllData() {
    console.log('🗑️ Clearing all data...');
    
    try {
      if (this.useLocalStorage) {
        // Clear localStorage
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('hd_')) {
            localStorage.removeItem(key);
          }
        });
      } else {
        // Clear IndexedDB
        await this.clearIndexedDB();
      }
      
      // Auto-clear memory
      this.stores.clear();
      this.indexes.clear();
      this.cache.clear();
      
      console.log('✅ All data cleared');
      
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  async clearIndexedDB() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.db.objectStoreNames, 'readwrite');
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      
      Array.from(this.db.objectStoreNames).forEach(storeName => {
        transaction.objectStore(storeName).clear();
      });
    });
  }

  setStorageLimit(limitMB) {
    this.maxStorageSize = limitMB * 1024 * 1024;
    console.log(`📏 Storage limit set to ${limitMB}MB`);
  }

  toggleCompression(enabled) {
    this.compressionEnabled = enabled;
    console.log(`🗜️ Compression ${enabled ? 'enabled' : 'disabled'}`);
  }

  toggleEncryption(enabled) {
    this.encryptionEnabled = enabled;
    console.log(`🔐 Encryption ${enabled ? 'enabled' : 'disabled'}`);
  }

  getStats() {
    return {
      storesCount: this.stores.size,
      indexesCount: this.indexes.size,
      cacheSize: this.cache.size,
      usingLocalStorage: this.useLocalStorage,
      compressionEnabled: this.compressionEnabled,
      encryptionEnabled: this.encryptionEnabled,
      performance: this.getPerformanceMetrics()
    };
 
      
    //   for (const operation of operations) {
    //     try {
    //       await this.executeSyncOperation(operation);
    //       this.metrics.syncOperations++;
    //     } catch (error) {
    //       console.error('Sync operation failed:', error);
    //       this.syncQueue.push(operation); // Re-queue failed operations
    //     }
    //   }
    
  }

  executeSyncOperation(operation) {
    // Execute queued sync operations (implement based on your backend API)
    switch (operation.type) {
      case 'save':
        this.save(operation.store, operation.key, operation.data, operation.options);
        break;
      case 'delete':
        this.delete(operation.store, operation.key);
        break;
    }
  }

  queueForSync(operation) {
    this.syncQueue.push({
      ...operation,
      queuedAt: Date.now()
    });
  }

  // Error handling
  handleStorageError(error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, auto-cleaning...');
      this.compactStorage();
    } else {
      console.error('Storage error:', error);
    }
  }

  // Public API
  async delete(store, key) {
    try {
      // Auto-remove from all storage systems
      if (this.indexedDB) {
        const transaction = this.indexedDB.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        objectStore.delete(key);
      }
      
      this.localStorage.remove(`${store}_${key}`);
      this.databases.get('memory').remove(`${store}_${key}`);
      
      this.emit('data:deleted', { store, key });
      
    } catch (error) {
      console.error(`Failed to delete ${store}:${key}`, error);
      throw error;
    }
  }

  async clear(store) {
    try {
      // Auto-clear all data for a store
      if (this.indexedDB) {
        const transaction = this.indexedDB.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        objectStore.clear();
      }
      
      // Clear from localStorage
      const prefix = `hd_${store}_`;
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear from memory cache
      this.cacheOrder.forEach(key => {
        if (key.startsWith(`${store}_`)) {
          this.databases.get('memory').remove(key);
        }
      });
      
      this.emit('data:cleared', { store });
      
    } catch (error) {
      console.error(`Failed to clear ${store}`, error);
      throw error;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.memoryCache.size,
      syncQueueSize: this.syncQueue.length,
      databases: Array.from(this.databases.keys()),
      optimizationEnabled: this.autoOptimizationEnabled
    };
  }

  enableAutoOptimization() {
    this.autoOptimizationEnabled = true;
    console.log('⚡ Auto-optimization enabled');
  }

  disableAutoOptimization() {
    this.autoOptimizationEnabled = false;
    console.log('⏸️ Auto-optimization disabled');
  }
}
