export class UIManager {
  constructor() {
    this.components = new Map();
    this.themes = {
      dark: { primary: '#1a0a2e', secondary: '#16213e', accent: '#0f3460' },
      light: { primary: '#f8f9fa', secondary: '#e9ecef', accent: '#dee2e6' },
      dragon: { primary: '#8B0000', secondary: '#FF6347', accent: '#FFD700' }
    };
    this.currentTheme = 'dark';
    this.autoEnhancementsEnabled = true;
    this.adaptiveUI = true;
    this.animations = new Map();
  }

  async init() {
    console.log('🎨 Initializing UI Manager with auto-enhancements...');
    
    // Auto-detect user preferences
    await this.detectUserPreferences();
    
    // Auto-setup responsive design
    this.setupResponsiveDesign();
    
    // Auto-enable accessibility features
    this.enableAccessibilityFeatures();
    
    // Auto-setup theme system
    this.setupThemeSystem();
    
    // Auto-enable animations
    this.setupAnimationSystem();
    
    console.log('✅ UI Manager initialized with enhancements');
  }

  async detectUserPreferences() {
    // Auto-detect dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark';
    }
    
    // Auto-detect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enableReducedMotion();
    }
    
    // Auto-detect high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.enableHighContrast();
    }
    
    // Auto-load saved preferences
    const savedPrefs = localStorage.getItem('uiPreferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      Object.assign(this, prefs);
    }
  }

  setupResponsiveDesign() {
    // Auto-setup breakpoints
    const breakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
      wide: 1440
    };
    
    // Auto-create responsive containers
    this.createResponsiveSystem(breakpoints);
    
    // Auto-handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleOrientationChange(), 100);
    });
  }

  createResponsiveSystem(breakpoints) {
    // Auto-inject responsive CSS
    const style = document.createElement('style');
    style.textContent = `
      .ui-container { 
        width: 100%; 
        max-width: 1200px; 
        margin: 0 auto; 
        padding: 0 1rem;
        transition: all 0.3s ease;
      }
      
      @media (max-width: ${breakpoints.mobile}px) {
        .ui-container { padding: 0 0.5rem; }
        .ui-grid { grid-template-columns: 1fr; }
      }
      
      @media (min-width: ${breakpoints.tablet}px) {
        .ui-grid { grid-template-columns: repeat(2, 1fr); }
      }
      
      @media (min-width: ${breakpoints.desktop}px) {
        .ui-grid { grid-template-columns: repeat(3, 1fr); }
      }
      
      .ui-grid {
        display: grid;
        gap: 1rem;
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  enableAccessibilityFeatures() {
    console.log('♿ Auto-enabling accessibility features...');
    
    // Auto-add ARIA labels
    this.enhanceARIA();
    
    // Auto-setup keyboard navigation
    this.setupKeyboardNavigation();
    
    // Auto-add focus indicators
    this.addFocusIndicators();
    
    // Auto-setup screen reader support
    this.setupScreenReaderSupport();
  }

  enhanceARIA() {
    // Auto-add missing ARIA attributes
    document.querySelectorAll('button:not([aria-label])').forEach(btn => {
      if (btn.textContent.trim()) {
        btn.setAttribute('aria-label', btn.textContent.trim());
      }
    });
    
    // Auto-add landmarks
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  }

  setupKeyboardNavigation() {
    // Auto-enable tab navigation
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'Tab':
          this.handleTabNavigation(e);
          break;
        case 'Escape':
          this.handleEscapeKey(e);
          break;
        case 'Enter':
        case ' ':
          this.handleActivation(e);
          break;
      }
    });
  }

  addFocusIndicators() {
    // Auto-add enhanced focus styles
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: 2px solid #FFD700;
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      .focus-indicator {
        position: relative;
      }
      
      .focus-indicator:focus::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid #FFD700;
        border-radius: 6px;
        pointer-events: none;
        animation: focusPulse 0.3s ease-out;
      }
      
      @keyframes focusPulse {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  setupScreenReaderSupport() {
    // Auto-add live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-label', 'Game notifications');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(liveRegion);
    this.liveRegion = liveRegion;
  }

  setupThemeSystem() {
    console.log('🎨 Auto-setting up theme system...');
    
    // Auto-apply current theme
    this.applyTheme(this.currentTheme);
    
    // Auto-setup theme switching
    this.setupThemeSwitching();
    
    // Auto-watch for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.adaptiveUI) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
      }
    });
  }

  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;
    
    // Auto-apply CSS custom properties
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Auto-update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = theme.primary;
    }
    
    // Auto-save preference
    localStorage.setItem('selectedTheme', themeName);
  }

  setupThemeSwitching() {
    // Auto-add theme switcher if not exists
    if (!document.querySelector('.theme-switcher')) {
      const switcher = this.createThemeSwitcher();
      document.body.appendChild(switcher);
    }
  }

  createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      gap: 0.5rem;
    `;
    
    Object.keys(this.themes).forEach(themeName => {
      const button = document.createElement('button');
      button.textContent = themeName;
      button.className = 'theme-button';
      button.setAttribute('aria-label', `Switch to ${themeName} theme`);
      button.style.cssText = `
        padding: 0.5rem 1rem;
        border: 1px solid currentColor;
        background: transparent;
        color: currentColor;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
      `;
      
      button.addEventListener('click', () => {
        this.currentTheme = themeName;
        this.applyTheme(themeName);
      });
      
      switcher.appendChild(button);
    });
    
    return switcher;
  }

  setupAnimationSystem() {
    console.log('✨ Auto-setting up animation system...');
    
    // Auto-enable performance-optimized animations
    this.enablePerformantAnimations();
    
    // Auto-setup intersection observer for scroll animations
    this.setupScrollAnimations();
    
    // Auto-create animation utilities
    this.createAnimationUtilities();
  }

  enablePerformantAnimations() {
    // Auto-add GPU-accelerated animation styles
    const style = document.createElement('style');
    style.textContent = `
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
        opacity: 0;
      }
      
      .animate-slide-up {
        animation: slideUp 0.4s ease-out forwards;
        transform: translateY(20px);
        opacity: 0;
      }
      
      .animate-scale-in {
        animation: scaleIn 0.3s ease-out forwards;
        transform: scale(0.9);
        opacity: 0;
      }
      
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        to { 
          transform: translateY(0); 
          opacity: 1; 
        }
      }
      
      @keyframes scaleIn {
        to { 
          transform: scale(1); 
          opacity: 1; 
        }
      }
      
      /* GPU acceleration */
      .animate-fade-in,
      .animate-slide-up,
      .animate-scale-in {
        will-change: transform, opacity;
      }
    `;
    document.head.appendChild(style);
  }

  setupScrollAnimations() {
    // Auto-setup intersection observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Auto-observe elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });
  }

  createAnimationUtilities() {
    // Auto-create animation helper functions
    this.animations.set('fadeIn', (element, duration = 300) => {
      return new Promise(resolve => {
        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          setTimeout(resolve, duration);
        });
      });
    });
    
    this.animations.set('slideIn', (element, direction = 'up', duration = 400) => {
      return new Promise(resolve => {
        const transforms = {
          up: 'translateY(20px)',
          down: 'translateY(-20px)',
          left: 'translateX(20px)',
          right: 'translateX(-20px)'
        };
        
        element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
        element.style.transform = transforms[direction];
        element.style.opacity = '0';
        
        requestAnimationFrame(() => {
          element.style.transform = 'translate(0)';
          element.style.opacity = '1';
          setTimeout(resolve, duration);
        });
      });
    });
  }

  // Auto-enhancement methods
  enhanceElement(element, options = {}) {
    // Auto-add responsive classes
    element.classList.add('ui-enhanced');
    
    // Auto-add accessibility attributes
    if (!element.getAttribute('tabindex') && element.tagName !== 'INPUT' && element.tagName !== 'BUTTON') {
      element.setAttribute('tabindex', '0');
    }
    
    // Auto-add animation classes
    if (options.animate !== false) {
      element.classList.add('scroll-animate');
    }
    
    // Auto-add focus indicators
    element.classList.add('focus-indicator');
  }

  createComponent(type, options = {}) {
    const component = document.createElement(options.tag || 'div');
    component.className = `ui-component ui-${type}`;
    
    // Auto-enhance the component
    this.enhanceElement(component, options);
    
    // Auto-apply theme colors
    if (options.themed !== false) {
      component.style.setProperty('--component-bg', 'var(--color-secondary)');
      component.style.setProperty('--component-text', 'var(--color-primary)');
    }
    
    // Store component reference
    const id = options.id || `component-${Date.now()}`;
    this.components.set(id, component);
    
    return component;
  }

  announce(message) {
    // Auto-announce to screen readers
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
      setTimeout(() => {
        this.liveRegion.textContent = '';
      }, 1000);
    }
  }

  // Event handlers
  handleTabNavigation(e) {
    // Auto-enhance tab navigation
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  handleEscapeKey(e) {
    // Auto-handle escape key for modals/overlays
    const modal = document.querySelector('.modal.open, .overlay.open');
    if (modal) {
      modal.classList.remove('open');
      this.announce('Modal closed');
    }
  }

  handleActivation(e) {
    // Auto-handle Enter/Space activation for custom elements
    if (e.target.classList.contains('clickable') && e.target.tagName !== 'BUTTON') {
      e.target.click();
    }
  }

  handleOrientationChange() {
    // Auto-adjust layout for orientation changes
    console.log('📱 Auto-adjusting for orientation change...');
    
    // Force layout recalculation
    document.body.style.height = 'auto';
    setTimeout(() => {
      document.body.style.height = '';
    }, 50);
    
    // Announce orientation change
    this.announce(`Screen orientation changed to ${screen.orientation ? screen.orientation.type : 'unknown'}`);
  }

  enableReducedMotion() {
    // Auto-disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
    console.log('♿ Reduced motion enabled');
  }

  enableHighContrast() {
    // Auto-enable high contrast mode
    document.body.classList.add('high-contrast');
    const style = document.createElement('style');
    style.textContent = `
      .high-contrast {
        filter: contrast(150%);
      }
      
      .high-contrast button,
      .high-contrast input {
        border: 2px solid currentColor;
      }
    `;
    document.head.appendChild(style);
    console.log('♿ High contrast enabled');
  }

  savePreferences() {
    // Auto-save UI preferences
    const preferences = {
      currentTheme: this.currentTheme,
      adaptiveUI: this.adaptiveUI,
      autoEnhancementsEnabled: this.autoEnhancementsEnabled
    };
    localStorage.setItem('uiPreferences', JSON.stringify(preferences));
  }

  getStats() {
    return {
      componentsCreated: this.components.size,
      currentTheme: this.currentTheme,
      enhancementsEnabled: this.autoEnhancementsEnabled,
      adaptiveUI: this.adaptiveUI
    };
  }
}
