import { themeManager } from './themeManager.js'

/**
 * Advanced Toast Notification Manager with theme awareness and rich features
 */
class ToastManager {
  constructor() {
    this.toasts = new Map()
    this.toastQueue = []
    this.maxToasts = 5
    this.zIndexBase = 2000
    this.defaultDuration = 5000
    this.positions = {
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
    }
    this.currentPosition = 'top-right'
    
    this.init()
  }

  /**
   * Initialize the toast system
   */
  init() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div')
      container.id = 'toast-container'
      container.className = 'toast-container'
      container.setAttribute('aria-live', 'polite')
      container.setAttribute('aria-atomic', 'false')
      this.updateContainerPosition()
      document.body.appendChild(container)
    }

    // Theme change listener to update toast styling
    window.addEventListener('themeChanged', () => {
      this.updateAllToastsTheme()
    })

    // Add swipe gesture support for mobile
    this.addSwipeSupport()
  }

  /**
   * Show a toast notification
   * @param {object} config - Toast configuration
   * @returns {string} Toast ID
   */
  showToast(config) {
    const id = config.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const toastConfig = {
      id,
      type: config.type || 'info', // 'success', 'error', 'warning', 'info', 'custom'
      title: config.title,
      message: config.message || '',
      duration: config.duration !== undefined ? config.duration : this.defaultDuration,
      persistent: config.persistent || false, // If true, won't auto-dismiss
      closable: config.closable !== false,
      icon: config.icon,
      actions: config.actions || [], // Array of action buttons
      className: config.className || '',
      position: config.position || this.currentPosition,
      showProgress: config.showProgress !== false,
      sound: config.sound || false,
      onShow: config.onShow,
      onHide: config.onHide,
      onClick: config.onClick,
      onAction: config.onAction
    }

    // Check if we're at max capacity
    if (this.toastQueue.length >= this.maxToasts) {
      // Remove oldest non-persistent toast
      this.removeOldestDismissibleToast()
    }

    this.toasts.set(id, toastConfig)
    this.toastQueue.push(id)
    this.renderToast(toastConfig)
    this.showToastElement(id)

    return id
  }

  /**
   * Render toast HTML
   * @param {object} config - Toast configuration
   */
  renderToast(config) {
    const theme = themeManager.getTheme()
    const container = document.getElementById('toast-container')
    
    // Create toast element
    const toast = document.createElement('div')
    toast.className = `toast toast-${config.type} ${config.className}`
    toast.id = config.id
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'assertive')
    toast.setAttribute('tabindex', '0')

    // Apply theme-aware styling
    toast.innerHTML = this.generateToastHTML(config, theme)

    container.appendChild(toast)

    // Add event listeners
    this.attachToastEvents(config)

    // Auto-dismiss timer
    if (!config.persistent && config.duration > 0) {
      this.startDismissTimer(config.id, config.duration)
    }
  }

  /**
   * Generate theme-aware toast HTML
   * @param {object} config - Toast configuration
   * @param {object} theme - Current theme
   * @returns {string} Toast HTML
   */
  generateToastHTML(config, theme) {
    const themeClasses = this.getThemeClasses(theme, config.type)
    const icon = this.getToastIcon(config.type, theme, config.icon)
    
    return `
      <div class="toast-content ${themeClasses.content}">
        ${config.showProgress && !config.persistent ? `
          <div class="toast-progress-container">
            <div class="toast-progress ${themeClasses.progress}" data-duration="${config.duration}"></div>
          </div>
        ` : ''}
        
        <div class="toast-body">
          ${icon ? `<div class="toast-icon ${themeClasses.icon}">${icon}</div>` : ''}
          
          <div class="toast-text">
            ${config.title ? `<div class="toast-title ${themeClasses.title}">${config.title}</div>` : ''}
            ${config.message ? `<div class="toast-message ${themeClasses.message}">${config.message}</div>` : ''}
          </div>
          
          ${config.closable ? `
            <button 
              class="toast-close ${themeClasses.closeBtn}" 
              aria-label="Close notification"
              data-action="close"
            >
              ${this.getCloseIcon(theme)}
            </button>
          ` : ''}
        </div>
        
        ${config.actions.length > 0 ? `
          <div class="toast-actions ${themeClasses.actions}">
            ${config.actions.map(action => this.generateActionHTML(action, theme)).join('')}
          </div>
        ` : ''}
      </div>
    `
  }

  /**
   * Get theme-specific CSS classes
   * @param {object} theme - Current theme
   * @param {string} type - Toast type
   * @returns {object} Theme classes
   */
  getThemeClasses(theme, type) {
    const toastTheme = theme.ui.toasts.theme
    
    return {
      content: `theme-toast-content ${toastTheme}-toast toast-${type}-${toastTheme}`,
      icon: `theme-toast-icon ${toastTheme}-icon`,
      title: `theme-toast-title ${toastTheme}-title`,
      message: `theme-toast-message ${toastTheme}-message`,
      closeBtn: `theme-toast-close ${toastTheme}-close`,
      actions: `theme-toast-actions ${toastTheme}-actions`,
      progress: `theme-toast-progress ${toastTheme}-progress toast-progress-${type}`
    }
  }

  /**
   * Get toast icon based on type and theme
   * @param {string} type - Toast type
   * @param {object} theme - Current theme
   * @param {string} customIcon - Custom icon override
   * @returns {string} Icon HTML
   */
  getToastIcon(type, theme, customIcon) {
    if (customIcon) return customIcon
    
    const toastIcons = theme.ui.toasts.icons
    return toastIcons[type] || toastIcons.info
  }

  /**
   * Get close icon for theme
   * @param {object} theme - Current theme
   * @returns {string} Close icon
   */
  getCloseIcon(theme) {
    return theme.ui.modals.icons.close || '⨯'
  }

  /**
   * Generate action button HTML
   * @param {object} action - Action configuration
   * @param {object} theme - Current theme
   * @returns {string} Action HTML
   */
  generateActionHTML(action, theme) {
    const toastClasses = theme.ui.toasts.classes
    const btnClass = `toast-action-btn toast-action-${action.type || 'default'} ${toastClasses.action} ${action.className || ''}`
    
    return `
      <button 
        class="${btnClass}"
        data-action="custom"
        data-handler="${action.handler || ''}"
        data-action-id="${action.id || ''}"
        ${action.disabled ? 'disabled' : ''}
        aria-label="${action.ariaLabel || action.text}"
      >
        ${action.icon ? `<span class="action-icon">${action.icon}</span>` : ''}
        <span class="action-text">${action.text}</span>
      </button>
    `
  }

  /**
   * Attach event listeners to toast
   * @param {object} config - Toast configuration
   */
  attachToastEvents(config) {
    const toast = document.getElementById(config.id)
    if (!toast) return

    // Click handler
    if (config.onClick) {
      toast.addEventListener('click', (e) => {
        if (!e.target.closest('.toast-close') && !e.target.closest('.toast-action-btn')) {
          config.onClick(config.id)
        }
      })
    }

    // Button handlers
    toast.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action]')
      if (!button) return

      const action = button.getAttribute('data-action')
      const handler = button.getAttribute('data-handler')
      const actionId = button.getAttribute('data-action-id')

      switch (action) {
        case 'close':
          this.hideToast(config.id)
          break
        case 'custom':
          if (config.onAction) {
            config.onAction(actionId, config.id, button)
          }
          if (handler && window[handler]) {
            window[handler](config.id, button, actionId)
          }
          break
      }
    })

    // Keyboard navigation
    toast.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && config.closable) {
        this.hideToast(config.id)
      }
    })

    // Hover pause (pause auto-dismiss on hover)
    if (!config.persistent) {
      toast.addEventListener('mouseenter', () => {
        this.pauseDismissTimer(config.id)
      })
      
      toast.addEventListener('mouseleave', () => {
        this.resumeDismissTimer(config.id)
      })
    }
  }

  /**
   * Show toast with animation
   * @param {string} id - Toast ID
   */
  showToastElement(id) {
    const config = this.toasts.get(id)
    if (!config) return

    const toast = document.getElementById(id)
    if (!toast) return

    // Set initial state
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(100%)'
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-showing')
      toast.style.opacity = '1'
      toast.style.transform = 'translateX(0)'
      
      // Start progress bar animation if enabled
      if (config.showProgress && !config.persistent) {
        const progress = toast.querySelector('.toast-progress')
        if (progress) {
          progress.style.animation = `toastProgress ${config.duration}ms linear`
        }
      }
      
      // Call onShow callback
      if (config.onShow) {
        config.onShow(id)
      }
    })
  }

  /**
   * Hide toast
   * @param {string} id - Toast ID
   */
  hideToast(id) {
    const config = this.toasts.get(id)
    if (!config) return

    const toast = document.getElementById(id)
    if (!toast) return

    // Clear timers
    this.clearDismissTimer(id)

    // Remove from queue
    const queueIndex = this.toastQueue.indexOf(id)
    if (queueIndex > -1) {
      this.toastQueue.splice(queueIndex, 1)
    }

    // Hide with animation
    toast.classList.add('toast-hiding')
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(100%)'

    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove()
      }
      this.toasts.delete(id)

      // Call onHide callback
      if (config.onHide) {
        config.onHide(id)
      }
    }, 300)
  }

  /**
   * Start auto-dismiss timer
   * @param {string} id - Toast ID
   * @param {number} duration - Duration in ms
   */
  startDismissTimer(id, duration) {
    const timerId = setTimeout(() => {
      this.hideToast(id)
    }, duration)
    
    // Store timer reference
    const config = this.toasts.get(id)
    if (config) {
      config.timerId = timerId
      config.startTime = Date.now()
      config.remainingTime = duration
    }
  }

  /**
   * Pause dismiss timer
   * @param {string} id - Toast ID
   */
  pauseDismissTimer(id) {
    const config = this.toasts.get(id)
    if (!config || !config.timerId) return

    clearTimeout(config.timerId)
    config.remainingTime = config.remainingTime - (Date.now() - config.startTime)
    config.timerId = null

    // Pause progress bar
    const toast = document.getElementById(id)
    const progress = toast?.querySelector('.toast-progress')
    if (progress) {
      progress.style.animationPlayState = 'paused'
    }
  }

  /**
   * Resume dismiss timer
   * @param {string} id - Toast ID
   */
  resumeDismissTimer(id) {
    const config = this.toasts.get(id)
    if (!config || config.timerId || config.remainingTime <= 0) return

    // Resume timer with remaining time
    this.startDismissTimer(id, config.remainingTime)

    // Resume progress bar
    const toast = document.getElementById(id)
    const progress = toast?.querySelector('.toast-progress')
    if (progress) {
      progress.style.animationPlayState = 'running'
    }
  }

  /**
   * Clear dismiss timer
   * @param {string} id - Toast ID
   */
  clearDismissTimer(id) {
    const config = this.toasts.get(id)
    if (config && config.timerId) {
      clearTimeout(config.timerId)
      config.timerId = null
    }
  }

  /**
   * Remove oldest dismissible toast
   */
  removeOldestDismissibleToast() {
    for (const id of this.toastQueue) {
      const config = this.toasts.get(id)
      if (config && !config.persistent) {
        this.hideToast(id)
        break
      }
    }
  }

  /**
   * Update container position
   */
  updateContainerPosition() {
    const container = document.getElementById('toast-container')
    if (!container) return

    const position = this.positions[this.currentPosition]
    Object.assign(container.style, position)
  }

  /**
   * Set toast position
   * @param {string} position - Position key
   */
  setPosition(position) {
    if (this.positions[position]) {
      this.currentPosition = position
      this.updateContainerPosition()
    }
  }

  /**
   * Clear all toasts
   */
  clearAll() {
    const toastIds = [...this.toastQueue]
    toastIds.forEach(id => this.hideToast(id))
  }

  /**
   * Update theme for all active toasts
   */
  updateAllToastsTheme() {
    this.toastQueue.forEach(id => {
      const config = this.toasts.get(id)
      if (config) {
        const toast = document.getElementById(id)
        if (toast) {
          const theme = themeManager.getTheme()
          toast.innerHTML = this.generateToastHTML(config, theme)
          this.attachToastEvents(config)
        }
      }
    })
  }

  /**
   * Add swipe gesture support
   */
  addSwipeSupport() {
    let startX = 0
    let currentToast = null

    document.addEventListener('touchstart', (e) => {
      const toast = e.target.closest('.toast')
      if (toast) {
        startX = e.touches[0].clientX
        currentToast = toast
      }
    })

    document.addEventListener('touchmove', (e) => {
      if (!currentToast) return
      
      const deltaX = e.touches[0].clientX - startX
      if (deltaX > 0) {
        currentToast.style.transform = `translateX(${deltaX}px)`
        currentToast.style.opacity = Math.max(0, 1 - deltaX / 200)
      }
    })

    document.addEventListener('touchend', (e) => {
      if (!currentToast) return
      
      const deltaX = e.changedTouches[0].clientX - startX
      
      if (deltaX > 100) {
        // Swipe right to dismiss
        this.hideToast(currentToast.id)
      } else {
        // Snap back
        currentToast.style.transform = 'translateX(0)'
        currentToast.style.opacity = '1'
      }
      
      currentToast = null
    })
  }

  // Convenience methods
  success(message, options = {}) {
    return this.showToast({ type: 'success', message, ...options })
  }

  error(message, options = {}) {
    return this.showToast({ type: 'error', message, ...options })
  }

  warning(message, options = {}) {
    return this.showToast({ type: 'warning', message, ...options })
  }

  info(message, options = {}) {
    return this.showToast({ type: 'info', message, ...options })
  }
}

// Create singleton instance
export const toastManager = new ToastManager()

export default toastManager
