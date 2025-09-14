// PWA Utilities for Wild Dragons
// Handles offline storage, install prompts, and PWA features
import themeManager from './themeManager.js'

export class PWAManager {
  constructor() {
    this.deferredPrompt = null
    this.isInstalled = false
    this.isOnline = navigator.onLine
    this.updateAvailable = false
    this.updateRequested = false
    this.registration = null
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Install prompt handling
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      this.showInstallBanner()
    })

    // App installed handling
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      this.isInstalled = true
      this.hideInstallBanner()
      this.showThemeNotification('App installed successfully!', 'success')
    })

    // Online/offline handling
    window.addEventListener('online', () => {
      this.isOnline = true
      this.hideOfflineNotification()
      this.syncOfflineData()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.showOfflineNotification()
    })

    // Theme change handling - only update banner, don't trigger updates
    window.addEventListener('themeChanged', () => {
      this.updateInstallBannerContent()
      // Remove any existing notifications to prevent spam
      const existingNotifications = document.querySelectorAll('.pwa-notification')
      existingNotifications.forEach(notif => notif.remove())
    })

    // Service worker update handling
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Only reload if user explicitly requested update
        if (this.updateRequested) {
          window.location.reload()
        }
      })
    }
  }

  // Install PWA
  async installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt()
      const choiceResult = await this.deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      this.deferredPrompt = null
    }
  }

  // Show install banner with theme-aware content
  showInstallBanner() {
    const pwa = themeManager.getPWAConfig()
    
    // Create install banner element
    const banner = document.createElement('div')
    banner.id = 'pwa-install-banner'
    this.updateBannerContent(banner, pwa)
    
    document.body.appendChild(banner)
    
    // Add event listeners
    document.getElementById('pwa-install-btn').addEventListener('click', () => {
      this.installPWA()
    })
    
    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      this.hideInstallBanner()
    })
  }

  // Update install banner content with current theme
  updateBannerContent(banner, pwa = null) {
    if (!pwa) pwa = themeManager.getPWAConfig()
    
    const title = pwa.install_prompt_title || 'Install App'
    const message = pwa.install_prompt_message || 'Add to your home screen for quick access'
    
    banner.innerHTML = `
      <div class="fixed bottom-4 left-4 right-4 bg-foreground text-background p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:w-96">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-sm">${title}</h3>
            <p class="text-xs opacity-75">${message}</p>
          </div>
          <div class="flex space-x-2 ml-4">
            <button id="pwa-install-btn" class="btn btn-sm bg-background text-foreground px-3 py-1 text-xs">
              Install
            </button>
            <button id="pwa-dismiss-btn" class="btn btn-sm btn-ghost text-background px-3 py-1 text-xs">
              ✕
            </button>
          </div>
        </div>
      </div>
    `
  }

  // Update existing install banner content when theme changes
  updateInstallBannerContent() {
    const banner = document.getElementById('pwa-install-banner')
    if (banner) {
      this.updateBannerContent(banner)
      
      // Re-attach event listeners
      document.getElementById('pwa-install-btn').addEventListener('click', () => {
        this.installPWA()
      })
      
      document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
        this.hideInstallBanner()
      })
    }
  }

  // Hide install banner
  hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner')
    if (banner) {
      banner.remove()
    }
  }

  // Show offline notification with theme-aware content
  showOfflineNotification() {
    const existing = document.getElementById('offline-notification')
    if (existing) return // Don't show multiple notifications
    
    const pwa = themeManager.getPWAConfig()
    const message = pwa.offline_message || "You're offline. Some features may be limited."
    
    const notification = document.createElement('div')
    notification.id = 'offline-notification'
    notification.innerHTML = `
      <div class="fixed top-4 left-4 right-4 bg-warning text-warning-foreground p-3 rounded-lg shadow-lg z-50 text-center">
        <span class="text-sm font-medium">${message}</span>
      </div>
    `
    
    document.body.appendChild(notification)
  }

  // Hide offline notification
  hideOfflineNotification() {
    const notification = document.getElementById('offline-notification')
    if (notification) {
      notification.remove()
    }
  }

  // Show themed notification
  showThemeNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = 'pwa-notification'
    
    const bgClass = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    
    notification.innerHTML = `
      <div class="fixed top-4 right-4 ${bgClass} text-white p-3 rounded-lg shadow-lg z-50 max-w-xs">
        <span class="text-sm font-medium">${message}</span>
      </div>
    `
    
    document.body.appendChild(notification)
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  // Show update available notification
  showUpdateNotification() {
    const pwa = themeManager.getPWAConfig()
    const message = pwa.update_available || 'New content available! Restart to update.'
    
    const notification = document.createElement('div')
    notification.id = 'update-notification'
    notification.innerHTML = `
      <div class="fixed top-4 left-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50 text-center">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium flex-1">${message}</span>
          <button id="update-btn" class="ml-3 px-3 py-1 bg-white text-blue-500 rounded text-xs font-semibold">
            Update
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(notification)
    
    document.getElementById('update-btn').addEventListener('click', () => {
      this.updateRequested = true
      this.skipWaiting()
    })
  }

  // Sync offline data when back online
  async syncOfflineData() {
    console.log('Back online - syncing data...')
    
    try {
      // Get offline battles from localStorage
      const offlineBattles = JSON.parse(localStorage.getItem('offline_battles') || '[]')
      
      if (offlineBattles.length > 0) {
        console.log(`Syncing ${offlineBattles.length} offline battles`)
        
        for (const battle of offlineBattles) {
          try {
            // Send to server (would need actual API endpoint)
            await fetch('/api/battle/sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(battle)
            })
          } catch (error) {
            console.error('Failed to sync battle:', error)
          }
        }
        
        // Clear synced battles
        localStorage.removeItem('offline_battles')
      }
    } catch (error) {
      console.error('Offline sync failed:', error)
    }
  }

  // Store battle offline
  storeBattleOffline(battleData) {
    try {
      const offlineBattles = JSON.parse(localStorage.getItem('offline_battles') || '[]')
      offlineBattles.push({
        ...battleData,
        timestamp: Date.now(),
        synced: false
      })
      localStorage.setItem('offline_battles', JSON.stringify(offlineBattles))
      console.log('Battle stored offline')
    } catch (error) {
      console.error('Failed to store battle offline:', error)
    }
  }

  // Register service worker with update handling
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', this.registration)
        
        // Check for updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration.installing
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.updateAvailable = true
              // Only show update notification if not in development
              if (process.env.NODE_ENV === 'production') {
                this.showUpdateNotification()
              }
            }
          })
        })
        
        return this.registration
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        return null
      }
    }
  }

  // Check for app updates
  async checkForUpdates() {
    if (this.registration) {
      try {
        await this.registration.update()
      } catch (error) {
        console.error('Update check failed:', error)
      }
    }
  }

  // Skip waiting and activate new service worker
  async skipWaiting() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  // Add to home screen tracking
  trackInstallPrompt() {
    if (this.deferredPrompt) {
      // Analytics or tracking code here
      console.log('Install prompt shown')
    }
  }

  // PWA feature detection
  static getCapabilities() {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      notifications: 'Notification' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      periodicBackgroundSync: 'serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype,
      webShare: 'share' in navigator,
      installPrompt: true // Will be set dynamically
    }
  }

  // Share API integration
  async shareGame() {
    const pwa = themeManager.getPWAConfig()
    const shareData = {
      title: pwa.app_name || 'Wild Dragons',
      text: pwa.description || 'Check out this awesome game!',
      url: window.location.origin
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        console.log('Game shared successfully')
        return true
      } catch (error) {
        console.log('Share cancelled or failed:', error)
        return false
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.text} ${shareData.url}`)
        this.showThemeNotification('Link copied to clipboard!', 'success')
        return true
      } catch (error) {
        console.error('Copy to clipboard failed:', error)
        return false
      }
    }
  }

  // Background sync for offline actions
  async requestBackgroundSync(tag) {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register(tag)
        console.log(`Background sync registered: ${tag}`)
        return true
      } catch (error) {
        console.error('Background sync registration failed:', error)
        return false
      }
    }
    return false
  }

  // Initialize PWA features (disabled in development)
  async init() {
    // Skip PWA initialization in development to prevent constant refreshes
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      console.log('PWA Manager: Skipping initialization in development mode')
      return
    }
    
    console.log('Initializing PWA Manager...')
    
    // Register service worker
    await this.registerServiceWorker()
    
    // Check capabilities
    const capabilities = PWAManager.getCapabilities()
    console.log('PWA Capabilities:', capabilities)
    
    // Request notification permission if supported
    if (capabilities.notifications) {
      await this.requestNotificationPermission()
    }
    
    // Check for updates periodically (every 30 minutes) - only in production
    setInterval(() => {
      this.checkForUpdates()
    }, 30 * 60 * 1000)
    
    console.log('PWA Manager initialized')
  }
}

// Initialize PWA Manager
export const pwaManager = new PWAManager()

// Utility functions for offline storage
export const offlineStorage = {
  // Save game state
  saveGameState(state) {
    try {
      localStorage.setItem('game_state', JSON.stringify({
        ...state,
        lastSaved: Date.now()
      }))
    } catch (error) {
      console.error('Failed to save game state:', error)
    }
  },

  // Load game state
  loadGameState() {
    try {
      const saved = localStorage.getItem('game_state')
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Failed to load game state:', error)
      return null
    }
  },

  // Save user preferences
  savePreferences(preferences) {
    try {
      localStorage.setItem('user_preferences', JSON.stringify(preferences))
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  },

  // Load user preferences
  loadPreferences() {
    try {
      const saved = localStorage.getItem('user_preferences')
      return saved ? JSON.parse(saved) : {
        soundEffects: true,
        backgroundMusic: true,
        notifications: true,
        darkTheme: false
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
      return {}
    }
  }
}
