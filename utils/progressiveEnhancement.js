/**
 * Progressive Enhancement Service
 * Implements Core Web Vitals animations, skeleton loaders, and staggered component loading
 * Features:
 * - Core Web Vitals optimized animations
 * - Skeleton loading states
 * - Staggered component loading
 * - Reduced motion support
 * - Performance-based enhancement levels
 */

class ProgressiveEnhancementService {
  constructor() {
    this.enhancementLevel = this.detectPerformanceLevel();
    this.prefersReducedMotion = this.detectReducedMotion();
    this.intersectionObserver = null;
    this.loadedComponents = new Set();
    this.loadingStates = new Map();

    this.init();
  }

  init() {
    // Initialize intersection observer for lazy loading
    this.initIntersectionObserver();

    // Setup performance monitoring
    this.monitorPerformance();

    // Apply initial enhancements
    this.applyEnhancements();
  }

  /**
   * Detect device/performance level for enhancement decisions
   */
  detectPerformanceLevel() {
    // Check for various performance indicators
    const connection = navigator.connection ||
                      navigator.mozConnection ||
                      navigator.webkitConnection;

    const deviceMemory = navigator.deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    // Simple performance scoring
    let score = 0;

    // Network speed
    if (connection) {
      if (connection.effectiveType === '4g') score += 2;
      else if (connection.effectiveType === '3g') score += 1;
      else if (connection.effectiveType === 'slow-2g') score -= 1;
    } else {
      score += 1; // Assume decent connection if unknown
    }

    // Device memory
    if (deviceMemory >= 4) score += 2;
    else if (deviceMemory >= 2) score += 1;

    // CPU cores
    if (hardwareConcurrency >= 4) score += 2;
    else if (hardwareConcurrency >= 2) score += 1;

    // Return enhancement level
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  /**
   * Detect user's reduced motion preference
   */
  detectReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Initialize intersection observer for lazy enhancements
   */
  initIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.enhanceElement(entry.target);
            this.intersectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );
  }

  /**
   * Monitor performance and adjust enhancements dynamically
   */
  monitorPerformance() {
    // Monitor FPS
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        // Adjust enhancement level based on FPS
        if (fps < 30 && this.enhancementLevel === 'high') {
          this.enhancementLevel = 'medium';
          this.applyEnhancements();
        } else if (fps < 20 && this.enhancementLevel === 'medium') {
          this.enhancementLevel = 'low';
          this.applyEnhancements();
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  /**
   * Apply enhancements based on current level
   */
  applyEnhancements() {
    const enhancements = {
      high: () => this.applyHighEnhancements(),
      medium: () => this.applyMediumEnhancements(),
      low: () => this.applyLowEnhancements()
    };

    const applyFn = enhancements[this.enhancementLevel] || enhancements.low;
    applyFn();
  }

  /**
   * High-performance enhancements
   */
  applyHighEnhancements() {
    // Enable all animations and effects
    document.documentElement.classList.remove('reduced-motion', 'low-performance');
    document.documentElement.classList.add('high-performance');

    // Enable advanced loading states
    this.enableSkeletonLoaders();
    this.enableStaggeredLoading();
    this.enableCoreWebVitalsAnimations();
  }

  /**
   * Medium-performance enhancements
   */
  applyMediumEnhancements() {
    // Enable basic animations, disable heavy effects
    document.documentElement.classList.remove('high-performance', 'low-performance');
    if (this.prefersReducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    }

    // Enable basic loading states
    this.enableSkeletonLoaders();
    this.enableBasicStaggeredLoading();
  }

  /**
   * Low-performance enhancements
   */
  applyLowEnhancements() {
    // Disable all animations and effects
    document.documentElement.classList.remove('high-performance');
    document.documentElement.classList.add('low-performance', 'reduced-motion');

    // Disable complex loading states
    this.disableSkeletonLoaders();
    this.disableStaggeredLoading();
  }

  /**
   * Enable skeleton loading states
   */
  enableSkeletonLoaders() {
    // Find all elements that should have skeleton loaders
    const skeletonElements = document.querySelectorAll('[data-skeleton]');

    skeletonElements.forEach(element => {
      if (!element.hasAttribute('data-skeleton-enabled')) {
        this.createSkeletonLoader(element);
        element.setAttribute('data-skeleton-enabled', 'true');
      }
    });
  }

  /**
   * Create skeleton loader for element
   */
  createSkeletonLoader(element) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-loader';
    skeleton.style.cssText = `
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      border-radius: 4px;
      width: ${element.offsetWidth || 200}px;
      height: ${element.offsetHeight || 20}px;
    `;

    // Insert skeleton before element
    element.parentNode.insertBefore(skeleton, element);
    element.style.opacity = '0';

    // Add CSS animation if not exists
    if (!document.getElementById('skeleton-styles')) {
      const style = document.createElement('style');
      style.id = 'skeleton-styles';
      style.textContent = `
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton-loader {
          animation: skeleton-loading 1.5s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-loader {
            animation: none;
            background: #f0f0f0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Store reference for cleanup
    this.loadingStates.set(element, skeleton);
  }

  /**
   * Remove skeleton loader and show real content
   */
  removeSkeletonLoader(element) {
    const skeleton = this.loadingStates.get(element);
    if (skeleton) {
      skeleton.remove();
      element.style.opacity = '1';
      this.loadingStates.delete(element);
    }
  }

  /**
   * Enable staggered component loading
   */
  enableStaggeredLoading() {
    const staggerElements = document.querySelectorAll('[data-stagger]');

    staggerElements.forEach((element, index) => {
      if (!element.hasAttribute('data-stagger-enabled')) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        // Stagger animation
        setTimeout(() => {
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * 100);

        element.setAttribute('data-stagger-enabled', 'true');
      }
    });
  }

  /**
   * Enable basic staggered loading (no transforms)
   */
  enableBasicStaggeredLoading() {
    const staggerElements = document.querySelectorAll('[data-stagger]');

    staggerElements.forEach((element, index) => {
      if (!element.hasAttribute('data-stagger-enabled')) {
        element.style.opacity = '0';

        setTimeout(() => {
          element.style.transition = 'opacity 0.6s ease';
          element.style.opacity = '1';
        }, index * 150);

        element.setAttribute('data-stagger-enabled', 'true');
      }
    });
  }

  /**
   * Enable Core Web Vitals optimized animations
   */
  enableCoreWebVitalsAnimations() {
    // Add CSS for optimized animations
    if (!document.getElementById('cwv-styles')) {
      const style = document.createElement('style');
      style.id = 'cwv-styles';
      style.textContent = `
        .cwv-fade-in {
          opacity: 0;
          animation: cwv-fade-in 0.6s ease forwards;
        }

        .cwv-slide-up {
          opacity: 0;
          transform: translateY(30px);
          animation: cwv-slide-up 0.8s ease forwards;
        }

        @keyframes cwv-fade-in {
          to { opacity: 1; }
        }

        @keyframes cwv-slide-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cwv-fade-in, .cwv-slide-up {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }

        /* High performance mode */
        .high-performance .enhanced-animation {
          will-change: transform, opacity;
        }

        /* Low performance mode */
        .low-performance .enhanced-animation {
          animation: none !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Disable skeleton loaders
   */
  disableSkeletonLoaders() {
    // Remove all skeleton loaders
    document.querySelectorAll('.skeleton-loader').forEach(skeleton => {
      skeleton.remove();
    });

    // Show all hidden elements
    this.loadingStates.forEach((skeleton, element) => {
      element.style.opacity = '1';
    });
    this.loadingStates.clear();
  }

  /**
   * Disable staggered loading
   */
  disableStaggeredLoading() {
    const staggerElements = document.querySelectorAll('[data-stagger]');
    staggerElements.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.transition = 'none';
    });
  }

  /**
   * Enhance element when it comes into view
   */
  enhanceElement(element) {
    // Add enhancement classes
    if (this.enhancementLevel === 'high') {
      element.classList.add('cwv-fade-in', 'enhanced-animation');
    } else if (this.enhancementLevel === 'medium') {
      element.classList.add('cwv-fade-in');
    }

    // Mark as loaded
    this.loadedComponents.add(element);
  }

  /**
   * Register component for progressive enhancement
   */
  registerComponent(element, options = {}) {
    const { lazy = false, skeleton = false, stagger = false } = options;

    if (lazy) {
      element.setAttribute('data-lazy', 'true');
      this.intersectionObserver.observe(element);
    }

    if (skeleton) {
      element.setAttribute('data-skeleton', 'true');
    }

    if (stagger) {
      element.setAttribute('data-stagger', 'true');
    }
  }

  /**
   * Mark component as loaded
   */
  markComponentLoaded(element) {
    this.removeSkeletonLoader(element);
    element.classList.add('component-loaded');
  }

  /**
   * Get current enhancement status
   */
  getStatus() {
    return {
      level: this.enhancementLevel,
      prefersReducedMotion: this.prefersReducedMotion,
      loadedComponents: this.loadedComponents.size,
      activeLoaders: this.loadingStates.size,
      intersectionObserver: !!this.intersectionObserver
    };
  }

  /**
   * Force re-evaluation of performance level
   */
  reevaluatePerformance() {
    const newLevel = this.detectPerformanceLevel();
    if (newLevel !== this.enhancementLevel) {
      this.enhancementLevel = newLevel;
      this.applyEnhancements();
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.disableSkeletonLoaders();
    this.disableStaggeredLoading();
    this.loadingStates.clear();
    this.loadedComponents.clear();
  }
}

// Export singleton instance
export const progressiveEnhancement = new ProgressiveEnhancementService();
export default progressiveEnhancement;