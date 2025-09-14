import { themeManager } from './themeManager.js'

/**
 * Advanced Modal Manager with theme awareness, stacking, and accessibility
 */
class ModalManager {
  constructor() {
    this.modals = new Map()
    this.modalStack = []
    this.zIndexBase = 1000
    this.focusHistory = []
    
    // Initialize when DOM is ready
    this.init()
  }

  /**
   * Initialize the modal system
   */
  init() {
    // Create modal container if it doesn't exist
    if (!document.getElementById('modal-container')) {
      const container = document.createElement('div')
      container.id = 'modal-container'
      container.setAttribute('aria-live', 'polite')
      document.body.appendChild(container)
    }

    // Add global keyboard listener for ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalStack.length > 0) {
        this.closeTop()
      }
    })

    // Theme change listener to update modal styling
    window.addEventListener('themeChanged', () => {
      this.updateAllModalsTheme()
    })
  }

  /**
   * Create and show a modal
   * @param {object} config - Modal configuration
   * @returns {string} Modal ID
   */
  showModal(config) {
    const id = config.id || `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const modalConfig = {
      id,
      title: config.title || 'Modal',
      content: config.content || '',
      type: config.type || 'default', // 'default', 'confirmation', 'alert', 'custom'
      size: config.size || 'medium', // 'small', 'medium', 'large', 'fullscreen'
      closable: config.closable !== false,
      persistent: config.persistent || false, // Prevents closing on backdrop click
      animation: config.animation || 'fade', // 'fade', 'slide', 'zoom'
      buttons: config.buttons || [],
      onShow: config.onShow,
      onHide: config.onHide,
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
      className: config.className || '',
      ariaLabel: config.ariaLabel || config.title
    }

    this.modals.set(id, modalConfig)
    this.renderModal(modalConfig)
    this.showModalElement(id)

    return id
  }

  /**
   * Render modal HTML
   * @param {object} config - Modal configuration
   */
  renderModal(config) {
    const theme = themeManager.getTheme()
    const container = document.getElementById('modal-container')
    
    // Create modal backdrop
    const backdrop = document.createElement('div')
    backdrop.className = `modal-backdrop modal-backdrop-${config.animation}`
    backdrop.id = `backdrop-${config.id}`
    backdrop.setAttribute('data-modal-id', config.id)
    
    // Create modal dialog
    const modal = document.createElement('div')
    modal.className = `modal-dialog modal-${config.size} modal-${config.type} ${config.className}`
    modal.id = config.id
    modal.setAttribute('role', 'dialog')
    modal.setAttribute('aria-labelledby', `${config.id}-title`)
    modal.setAttribute('aria-describedby', `${config.id}-content`)
    modal.setAttribute('aria-label', config.ariaLabel)
    modal.setAttribute('tabindex', '-1')

    // Apply theme-aware styling
    modal.innerHTML = this.generateModalHTML(config, theme)

    backdrop.appendChild(modal)
    container.appendChild(backdrop)

    // Add event listeners
    this.attachModalEvents(config)
  }

  /**
   * Generate theme-aware modal HTML
   * @param {object} config - Modal configuration
   * @param {object} theme - Current theme
   * @returns {string} Modal HTML
   */
  generateModalHTML(config, theme) {
    const themeClasses = this.getThemeClasses(theme)
    const headerIcon = this.getModalIcon(config.type, theme)
    
    return `
      <div class="modal-content ${themeClasses.content}">
        ${config.closable ? `
          <button 
            class="modal-close ${themeClasses.closeBtn}" 
            aria-label="Close modal"
            data-action="close"
          >
            ${this.getCloseIcon(theme)}
          </button>
        ` : ''}
        
        <div class="modal-header ${themeClasses.header}">
          ${headerIcon ? `<div class="modal-icon">${headerIcon}</div>` : ''}
          <h2 id="${config.id}-title" class="modal-title ${themeClasses.title}">
            ${config.title}
          </h2>
        </div>
        
        <div class="modal-body ${themeClasses.body}">
          <div id="${config.id}-content" class="modal-content-text">
            ${config.content}
          </div>
        </div>
        
        ${config.buttons.length > 0 ? `
          <div class="modal-footer ${themeClasses.footer}">
            ${config.buttons.map(btn => this.generateButtonHTML(btn, theme)).join('')}
          </div>
        ` : ''}
      </div>
    `
  }

  /**
   * Get theme-specific CSS classes
   * @param {object} theme - Current theme
   * @returns {object} Theme classes
   */
  getThemeClasses(theme) {
    const modalClasses = theme.ui.modals.classes
    
    return {
      content: `theme-modal-content ${modalClasses.theme}`,
      header: `theme-modal-header ${modalClasses.header}`,
      title: `theme-modal-title ${modalClasses.title}`,
      body: `theme-modal-body ${modalClasses.body}`,
      footer: `theme-modal-footer ${modalClasses.footer}`,
      closeBtn: `theme-close-btn ${modalClasses.close}`
    }
  }

  /**
   * Get modal icon based on type and theme
   * @param {string} type - Modal type
   * @param {object} theme - Current theme
   * @returns {string} Icon HTML
   */
  getModalIcon(type, theme) {
    const modalIcons = theme.ui.modals.icons
    return modalIcons[type] || ''
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
   * Generate button HTML
   * @param {object} button - Button configuration
   * @param {object} theme - Current theme
   * @returns {string} Button HTML
   */
  generateButtonHTML(button, theme) {
    const modalClasses = theme.ui.modals.classes
    const btnClass = `modal-btn modal-btn-${button.type || 'default'} ${modalClasses.button} ${button.className || ''}`
    
    return `
      <button 
        class="${btnClass}"
        data-action="${button.action || 'custom'}"
        data-handler="${button.handler || ''}"
        ${button.disabled ? 'disabled' : ''}
        aria-label="${button.ariaLabel || button.text}"
      >
        ${button.icon ? `<span class="btn-icon">${button.icon}</span>` : ''}
        <span class="btn-text">${button.text}</span>
        ${button.loading ? '<span class="btn-spinner"></span>' : ''}
      </button>
    `
  }

  /**
   * Attach event listeners to modal
   * @param {object} config - Modal configuration
   */
  attachModalEvents(config) {
    const backdrop = document.getElementById(`backdrop-${config.id}`)
    const modal = document.getElementById(config.id)

    // Backdrop click to close (if not persistent)
    if (!config.persistent) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.hideModal(config.id)
        }
      })
    }

    // Button clicks
    modal.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action]')
      if (!button) return

      const action = button.getAttribute('data-action')
      const handler = button.getAttribute('data-handler')

      switch (action) {
        case 'close':
          this.hideModal(config.id)
          break
        case 'confirm':
          if (config.onConfirm) {
            config.onConfirm(config.id)
          }
          this.hideModal(config.id)
          break
        case 'cancel':
          if (config.onCancel) {
            config.onCancel(config.id)
          }
          this.hideModal(config.id)
          break
        case 'custom':
          if (handler && window[handler]) {
            window[handler](config.id, button)
          }
          break
      }
    })
  }

  /**
   * Show modal with animation
   * @param {string} id - Modal ID
   */
  showModalElement(id) {
    const config = this.modals.get(id)
    if (!config) return

    const backdrop = document.getElementById(`backdrop-${id}`)
    const modal = document.getElementById(id)

    if (!backdrop || !modal) return

    // Store current focus
    this.focusHistory.push(document.activeElement)

    // Add to modal stack
    this.modalStack.push(id)

    // Set z-index
    const zIndex = this.zIndexBase + this.modalStack.length
    backdrop.style.zIndex = zIndex

    // Show with animation
    backdrop.classList.add('modal-showing')
    
    setTimeout(() => {
      backdrop.classList.add('modal-visible')
      backdrop.classList.remove('modal-showing')
      
      // Focus management
      modal.focus()
      
      // Call onShow callback
      if (config.onShow) {
        config.onShow(id)
      }
    }, 10)

    // Add body class to prevent scrolling
    document.body.classList.add('modal-open')
  }

  /**
   * Hide modal
   * @param {string} id - Modal ID
   */
  hideModal(id) {
    const config = this.modals.get(id)
    if (!config) return

    const backdrop = document.getElementById(`backdrop-${id}`)
    if (!backdrop) return

    // Remove from stack
    const stackIndex = this.modalStack.indexOf(id)
    if (stackIndex > -1) {
      this.modalStack.splice(stackIndex, 1)
    }

    // Hide with animation
    backdrop.classList.add('modal-hiding')
    backdrop.classList.remove('modal-visible')

    setTimeout(() => {
      backdrop.remove()
      this.modals.delete(id)

      // Restore focus
      if (this.focusHistory.length > 0) {
        const previousFocus = this.focusHistory.pop()
        if (previousFocus && previousFocus.focus) {
          previousFocus.focus()
        }
      }

      // Remove body class if no modals left
      if (this.modalStack.length === 0) {
        document.body.classList.remove('modal-open')
      }

      // Call onHide callback
      if (config.onHide) {
        config.onHide(id)
      }
    }, 300)
  }

  /**
   * Close the topmost modal
   */
  closeTop() {
    if (this.modalStack.length > 0) {
      const topModal = this.modalStack[this.modalStack.length - 1]
      const config = this.modals.get(topModal)
      
      if (config && config.closable) {
        this.hideModal(topModal)
      }
    }
  }

  /**
   * Close all modals
   */
  closeAll() {
    const modalIds = [...this.modalStack]
    modalIds.forEach(id => this.hideModal(id))
  }

  /**
   * Update theme for all open modals
   */
  updateAllModalsTheme() {
    this.modalStack.forEach(id => {
      const config = this.modals.get(id)
      if (config) {
        const modal = document.getElementById(id)
        if (modal) {
          const theme = themeManager.getTheme()
          modal.innerHTML = this.generateModalHTML(config, theme)
          this.attachModalEvents(config)
        }
      }
    })
  }

  /**
   * Show confirmation modal (convenience method)
   * @param {object} options - Confirmation options
   * @returns {Promise} Promise that resolves with user choice
   */
  confirm(options) {
    return new Promise((resolve) => {
      const theme = themeManager.getTheme()
      const modals = theme.ui.modals
      
      this.showModal({
        type: 'confirmation',
        title: options.title || modals.confirm_title,
        content: options.message || 'Do you want to proceed?',
        size: options.size || 'small',
        buttons: [
          {
            text: options.cancelText || modals.confirm_cancel,
            type: 'secondary',
            action: 'cancel',
            icon: modals.icons.cancel
          },
          {
            text: options.confirmText || modals.confirm_accept,
            type: 'primary',
            action: 'confirm',
            icon: modals.icons.accept
          }
        ],
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
        onHide: () => resolve(false)
      })
    })
  }

  /**
   * Show alert modal (convenience method)
   * @param {object} options - Alert options
   */
  alert(options) {
    const theme = themeManager.getTheme()
    
    return this.showModal({
      type: 'alert',
      title: options.title || theme.ui.modals.text.alert.title,
      content: options.message || 'Something happened!',
      size: options.size || 'small',
      buttons: [
        {
          text: options.buttonText || theme.ui.modals.text.alert.buttonText,
          type: 'primary',
          action: 'close',
          icon: theme.ui.modals.icons.alert
        }
      ]
    })
  }
}

// Create singleton instance
export const modalManager = new ModalManager()

export default modalManager
