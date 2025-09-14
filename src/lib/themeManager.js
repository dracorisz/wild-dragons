import themes from '../data/themes.json'

class ThemeManager {
  constructor() {
    // THEME CONFIGURATION - Change this to switch themes
    this.currentTheme = 'dragons' // OPTIONS: 'dragons', 'puppies'
    // ^^^^^ DEVELOPERS: Change the string above to switch the entire app theme
    
    this.themes = themes
    this.cache = new Map()
  }

  /**
   * Set the active theme
   * @param {string} themeName - The theme to activate
   */
  setTheme(themeName) {
    if (!this.themes[themeName]) {
      console.warn(`Theme "${themeName}" not found. Available themes:`, Object.keys(this.themes))
      return false
    }
    
    this.currentTheme = themeName
    
    // Clear cache for immediate updates
    this.clearCache()
    
    this.updateCSSVariables()
    this.updatePageTitle()
    this.updateFavicon()
    this.updateManifest()
    
    // NOTE: localStorage persistence disabled for development
    // Enable this in production: localStorage.setItem('game-theme', themeName)
    
    // Emit theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: themeName, config: this.getTheme() }
    }))
    
    console.log(`Theme changed to: ${themeName}`)
    return true
  }

  /**
   * Get the current theme configuration
   * @returns {object} Current theme config
   */
  getTheme() {
    return this.themes[this.currentTheme]
  }

  /**
   * Get a UI text value with fallback
   * @param {string} key - Dot notation key (e.g., 'ui.game_title')
   * @param {object} replacements - Optional replacements object
   * @returns {string} The text value
   */
  getText(key, replacements = {}) {
    const cacheKey = `${this.currentTheme}.${key}`
    
    if (this.cache.has(cacheKey)) {
      return this.processReplacements(this.cache.get(cacheKey), replacements)
    }

    const theme = this.getTheme()
    const keys = key.split('.')
    let value = theme

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Theme key "${key}" not found in theme "${this.currentTheme}"`)
        return key // Return the key as fallback
      }
    }

    this.cache.set(cacheKey, value)
    return this.processReplacements(value, replacements)
  }

  /**
   * Process replacement variables in text
   * @param {string} text - Text with {{variable}} placeholders
   * @param {object} replacements - Replacement values
   * @returns {string} Processed text
   */
  processReplacements(text, replacements) {
    if (typeof text !== 'string') return text
    
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return replacements[key] !== undefined ? replacements[key] : match
    })
  }

  /**
   * Get a color value
   * @param {string} colorName - The color key
   * @returns {string} CSS color value
   */
  getColor(colorName) {
    return this.themes[this.currentTheme]?.colors?.[colorName] || '#000000'
  }

  /**
   * Get an asset path
   * @param {string} assetName - The asset key
   * @returns {string} Asset path
   */
  getAsset(assetName) {
    return this.themes[this.currentTheme]?.assets?.[assetName] || ''
  }

  /**
   * Get enemy data
   * @param {string} enemyKey - The enemy key
   * @returns {object} Enemy configuration
   */
  getEnemy(enemyKey) {
    return this.themes[this.currentTheme]?.enemies?.[enemyKey] || null
  }

  /**
   * Get all enemies for current theme
   * @returns {object} All enemies
   */
  getAllEnemies() {
    return this.themes[this.currentTheme]?.enemies || {}
  }

  /**
   * Get loot item name
   * @param {string} lootKey - The loot key
   * @returns {string} Loot item name
   */
  getLoot(lootKey) {
    return this.themes[this.currentTheme]?.loot?.[lootKey] || lootKey
  }

  /**
   * Get available themes list
   * @returns {Array} List of available themes
   */
  getAvailableThemes() {
    return Object.keys(this.themes).map(key => ({
      key,
      name: this.themes[key].meta.name,
      description: this.themes[key].meta.description,
      icon: this.themes[key].meta.icon
    }))
  }

  /**
   * Update CSS custom properties for current theme
   */
  updateCSSVariables() {
    const colors = this.themes[this.currentTheme]?.colors
    if (!colors) return

    const root = document.documentElement
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key.replace(/_/g, '-')}`, value)
    })

    // Update theme-specific assets
    const assets = this.themes[this.currentTheme]?.assets
    if (assets?.background_pattern) {
      root.style.setProperty('--theme-bg-pattern', `url('${assets.background_pattern}')`)
    }
  }

  /**
   * Update page title
   */
  updatePageTitle() {
    const title = this.getText('ui.game_title')
    if (title && document.title !== title) {
      document.title = title
    }
  }

  /**
   * Update favicon
   */
  updateFavicon() {
    const faviconPath = this.getAsset('favicon')
    if (!faviconPath) return

    let favicon = document.querySelector('link[rel="icon"]')
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      document.head.appendChild(favicon)
    }
    favicon.href = faviconPath
  }

  /**
   * Update PWA manifest with theme data
   */
  updateManifest() {
    // This would be used in production to update manifest
    // For now, just log the theme change
    console.log('Theme manifest would be updated in production')
  }

  /**
   * Get PWA configuration for current theme
   * @returns {object} PWA config
   */
  getPWAConfig() {
    const theme = this.getTheme()
    return theme?.pwa || {
      app_name: theme?.meta?.name || 'Adventure Game',
      short_name: theme?.meta?.name || 'AdventureGame',
      description: theme?.meta?.description || 'A web-based game',
      theme_color: '#000000',
      background_color: '#ffffff',
      install_prompt_title: 'Install App',
      install_prompt_message: 'Add to your home screen for quick access',
      offline_message: "You're offline. Some features may be limited.",
      update_available: 'New content available! Restart to update.'
    }
  }

  /**
   * Initialize theme (development mode - uses hardcoded theme)
   */
  init() {
    // Development mode: Always use the hardcoded theme from constructor
    // Production mode: Uncomment the lines below to use localStorage
    /*
    const savedTheme = localStorage.getItem('game-theme')
    if (savedTheme && this.themes[savedTheme]) {
      this.setTheme(savedTheme)
    } else {
      this.setTheme(this.currentTheme)
    }
    */
    
    // Force use the theme set in constructor for instant development switching
    this.setTheme(this.currentTheme)
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache() {
    this.cache.clear()
  }
}

// Create singleton instance
export const themeManager = new ThemeManager()

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  themeManager.init()
}

export default themeManager
