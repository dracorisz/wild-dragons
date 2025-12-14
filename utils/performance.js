/**
 * DevSTon Performance Optimization Utilities
 * Collection of performance enhancement functions
 */

// Image lazy loading with Intersection Observer
export const lazyLoadImage = (imgElement, src) => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  imageObserver.observe(imgElement);
};

// Debounce function for performance-critical operations
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts
  // const fontLink = document.createElement('link');
  // fontLink.rel = 'preload';
  // fontLink.href = '/fonts/main-font.woff2';
  // fontLink.as = 'font';
  // fontLink.type = 'font/woff2';
  // fontLink.crossOrigin = 'anonymous';
  // document.head.appendChild(fontLink);

  // Preload critical images
  // const criticalImages = [
  //   '/images/logo.png',
  //   '/images/hero-bg.jpg'
  // ];

  // criticalImages.forEach(src => {
  //   const img = new Image();
  //   img.src = src;
  // });
};

// Memory cleanup for event listeners
export const createCleanupFunction = (element, event, handler) => {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
};

// Optimize scroll performance
export const optimizeScroll = (callback) => {
  let ticking = false;

  return () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
};

// Bundle size monitoring
export const logBundleSize = () => {
  if (import.meta.env.DEV) {
    // Log bundle information in development
    console.log('DevSTon Bundle Info:', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      memory: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
      } : 'Not available'
    });
  }
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if ('web-vitals' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};

// Service Worker performance monitoring
export const monitorServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_HIT') {
        // Track cache performance
        console.log('Service Worker Cache Hit:', event.data.url);
      }
    });
  }
};

// Optimize React re-renders
export const useOptimizedCallback = (callback, deps) => {
  return React.useCallback(callback, deps);
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memInfo = performance.memory;
    const usedPercent = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;

    if (usedPercent > 80) {
      console.warn('High memory usage detected:', {
        used: Math.round(memInfo.usedJSHeapSize / 1048576) + ' MB',
        percentage: Math.round(usedPercent) + '%'
      });
    }
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Log initial bundle size
  logBundleSize();

  // Track Web Vitals
  trackWebVitals();

  // Monitor Service Worker
  monitorServiceWorker();

  // Preload critical resources
  preloadCriticalResources();

  // Monitor memory usage periodically
  setInterval(monitorMemoryUsage, 30000);
};