/**
 * Advanced Prefetching Service
 * Implements intelligent resource prefetching based on user behavior and navigation patterns
 */

class PrefetchService {
  constructor() {
    this.prefetchedUrls = new Set();
    this.userBehaviorPatterns = new Map();
    this.prefetchQueue = [];
    this.isEnabled = true;
    this.maxConcurrentPrefetches = 3;
    this.activePrefetches = 0;

    this.initialize();
  }

  /**
   * Initialize prefetching service
   */
  initialize() {
    if (!this.isEnabled) return;

    this.setupResourceHints();
    this.setupNavigationPrediction();
    this.setupIntersectionObserver();
    this.setupUserBehaviorTracking();
  }

  /**
   * Setup resource hints for critical resources
   */
  setupResourceHints() {
    // DNS prefetch for external domains
    this.addDNSPrefetch('fonts.googleapis.com');
    this.addDNSPrefetch('fonts.gstatic.com');
    this.addDNSPrefetch('api.coingecko.com');
    this.addDNSPrefetch('freecryptoapi.com');

    // Preconnect to critical APIs
    this.addPreconnect('https://api.coingecko.com');
    this.addPreconnect('https://freecryptoapi.com');

    // Prefetch critical fonts
    this.addPrefetch('/fonts/main-font.woff2', 'font', 'font/woff2');

    // Prefetch critical images
    this.addPrefetch('/images/logo.png', 'image');
    this.addPrefetch('/images/hero-bg.jpg', 'image');
  }

  /**
   * Add DNS prefetch hint
   */
  addDNSPrefetch(domain) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  }

  /**
   * Add preconnect hint
   */
  addPreconnect(url) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  /**
   * Add prefetch hint
   */
  addPrefetch(url, as = 'fetch', type = '') {
    if (this.prefetchedUrls.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    if (as !== 'fetch') {
      link.as = as;
    }
    if (type) {
      link.type = type;
    }
    document.head.appendChild(link);
    this.prefetchedUrls.add(url);
  }

  /**
   * Setup navigation prediction based on user behavior
   */
  setupNavigationPrediction() {
    // Track navigation patterns
    let currentPath = window.location.pathname;
    const navigationHistory = [];

    // Listen for navigation changes
    const observer = new MutationObserver(() => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        navigationHistory.push({
          from: currentPath,
          to: newPath,
          timestamp: Date.now()
        });

        // Keep only last 10 navigations
        if (navigationHistory.length > 10) {
          navigationHistory.shift();
        }

        currentPath = newPath;
        this.predictNextNavigation(navigationHistory);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also listen for popstate events
    window.addEventListener('popstate', () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        navigationHistory.push({
          from: currentPath,
          to: newPath,
          timestamp: Date.now()
        });
        currentPath = newPath;
        this.predictNextNavigation(navigationHistory);
      }
    });
  }

  /**
   * Predict next navigation based on patterns
   */
  predictNextNavigation(history) {
    if (history.length < 2) return;

    // Analyze navigation patterns
    const recentNavigations = history.slice(-3);
    const currentPath = window.location.pathname;

    // Predict based on common navigation flows
    const predictions = this.analyzeNavigationPatterns(recentNavigations, currentPath);

    // Prefetch predicted routes
    predictions.forEach(route => {
      this.prefetchRoute(route);
    });
  }

  /**
   * Analyze navigation patterns to predict next routes
   */
  analyzeNavigationPatterns(history, currentPath) {
    const predictions = new Set();

    // Common navigation flows
    const navigationFlows = {
      '/': ['/features', '/cryptos', '/market'],
      '/features': ['/cryptos', '/market', '/games'],
      '/cryptos': ['/market', '/profile'],
      '/market': ['/profile', '/cryptos'],
      '/games': ['/tiamat', '/elven-river', '/nordic-superheroines']
    };

    // Add predictions based on current page
    if (navigationFlows[currentPath]) {
      navigationFlows[currentPath].forEach(route => predictions.add(route));
    }

    // Add predictions based on recent history
    history.forEach(nav => {
      if (nav.from === currentPath && navigationFlows[nav.to]) {
        navigationFlows[nav.to].forEach(route => predictions.add(route));
      }
    });

    return Array.from(predictions).slice(0, 3); // Limit to 3 predictions
  }

  /**
   * Prefetch a route and its critical resources
   */
  async prefetchRoute(route) {
    if (!route || this.prefetchedUrls.has(route)) return;

    try {
      // Prefetch the route HTML
      this.addPrefetch(route);

      // Prefetch critical resources for the route
      const criticalResources = this.getCriticalResourcesForRoute(route);
      criticalResources.forEach(resource => {
        this.addPrefetch(resource.url, resource.as, resource.type);
      });

      // Prefetch API data if applicable
      await this.prefetchRouteData(route);

    } catch (error) {
      console.warn('Failed to prefetch route:', route, error);
    }
  }

  /**
   * Get critical resources for a specific route
   */
  getCriticalResourcesForRoute(route) {
    const routeResources = {
      '/cryptos': [
        { url: '/coins.json', as: 'fetch' },
        { url: '/images/logo.png', as: 'image' }
      ],
      '/market': [
        { url: '/images/imxkeys.png', as: 'image' },
        { url: '/IMX-Wheel/large-gems.webp', as: 'image' }
      ],
      '/games': [
        { url: '/images/crystel-river.png', as: 'image' },
        { url: '/images/CWElvenRiver.png', as: 'image' },
        { url: '/images/crustaline-rune.png', as: 'image' }
      ]
    };

    return routeResources[route] || [];
  }

  /**
   * Prefetch API data for routes
   */
  async prefetchRouteData(route) {
    const routeDataEndpoints = {
      '/cryptos': '/api/cryptocurrencies',
      '/market': '/api/market-data'
    };

    const endpoint = routeDataEndpoints[route];
    if (endpoint) {
      try {
        // Use low priority fetch for prefetching
        const response = await fetch(endpoint, {
          priority: 'low',
          cache: 'force-cache'
        });

        if (response.ok) {
          // Cache the response for later use
          const data = await response.json();
          this.cacheRouteData(route, data);
        }
      } catch (error) {
        // Silently fail for prefetching
      }
    }
  }

  /**
   * Cache prefetched route data
   */
  cacheRouteData(route, data) {
    const cacheKey = `prefetch-${route}`;
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }

  /**
   * Get cached route data
   */
  getCachedRouteData(route) {
    const cacheKey = `prefetch-${route}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache for 5 minutes
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return data;
      } else {
        sessionStorage.removeItem(cacheKey);
      }
    }

    return null;
  }

  /**
   * Setup intersection observer for viewport-based prefetching
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;

            // Check for data-prefetch attribute
            const prefetchUrl = element.getAttribute('data-prefetch');
            if (prefetchUrl) {
              this.addPrefetch(prefetchUrl);
            }

            // Check for data-prefetch-route attribute
            const prefetchRoute = element.getAttribute('data-prefetch-route');
            if (prefetchRoute) {
              this.prefetchRoute(prefetchRoute);
            }

            // Stop observing after prefetching
            observer.unobserve(element);
          }
        });
      },
      { rootMargin: '50px' }
    );

    // Observe elements with prefetch attributes
    document.addEventListener('DOMContentLoaded', () => {
      const prefetchElements = document.querySelectorAll('[data-prefetch], [data-prefetch-route]');
      prefetchElements.forEach(element => observer.observe(element));
    });
  }

  /**
   * Setup user behavior tracking for intelligent prefetching
   */
  setupUserBehaviorTracking() {
    // Track hover events on navigation links
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href.startsWith(window.location.origin)) {
        const path = new URL(link.href).pathname;
        // Prefetch on hover with delay
        setTimeout(() => {
          this.prefetchRoute(path);
        }, 100);
      }
    });

    // Track scroll behavior to predict content needs
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScrollBehavior();
      }, 100);
    });
  }

  /**
   * Handle scroll behavior for prefetching
   */
  handleScrollBehavior() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // If user is near bottom, prefetch next page content
    if (scrollPosition + windowHeight > documentHeight - 1000) {
      this.prefetchNextPageContent();
    }
  }

  /**
   * Prefetch content for next page (pagination, infinite scroll)
   */
  prefetchNextPageContent() {
    // Find pagination links or infinite scroll triggers
    const nextPageLinks = document.querySelectorAll('a[data-page], .load-more, .infinite-scroll-trigger');

    nextPageLinks.forEach(link => {
      const nextPageUrl = link.getAttribute('data-page') || link.href;
      if (nextPageUrl && !this.prefetchedUrls.has(nextPageUrl)) {
        this.addPrefetch(nextPageUrl);
      }
    });
  }

  /**
   * Intelligent prefetching based on user engagement
   */
  prefetchBasedOnEngagement() {
    // Prefetch popular routes based on user behavior
    const popularRoutes = ['/cryptos', '/market', '/games', '/features'];

    // Prefetch top 2 popular routes that haven't been visited recently
    const unvisitedRoutes = popularRoutes.filter(route =>
      !this.hasVisitedRecently(route)
    ).slice(0, 2);

    unvisitedRoutes.forEach(route => {
      setTimeout(() => {
        this.prefetchRoute(route);
      }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
    });
  }

  /**
   * Check if route has been visited recently
   */
  hasVisitedRecently(route) {
    const lastVisit = localStorage.getItem(`last-visit-${route}`);
    if (!lastVisit) return false;

    const timeSinceLastVisit = Date.now() - parseInt(lastVisit);
    // Consider "recently" as within the last hour
    return timeSinceLastVisit < 60 * 60 * 1000;
  }

  /**
   * Update last visit timestamp for current route
   */
  updateLastVisit() {
    const currentRoute = window.location.pathname;
    localStorage.setItem(`last-visit-${currentRoute}`, Date.now().toString());
  }

  /**
   * Enable prefetching
   */
  enable() {
    this.isEnabled = true;
    this.initialize();
  }

  /**
   * Disable prefetching
   */
  disable() {
    this.isEnabled = false;
    // Clear prefetch queue and active prefetches
    this.prefetchQueue = [];
    this.activePrefetches = 0;
  }

  /**
   * Get prefetching statistics
   */
  getStats() {
    return {
      enabled: this.isEnabled,
      prefetchedUrls: this.prefetchedUrls.size,
      activePrefetches: this.activePrefetches,
      queuedPrefetches: this.prefetchQueue.length
    };
  }
}

// Create singleton instance
export const prefetchService = new PrefetchService();

// Update last visit on page load
prefetchService.updateLastVisit();

// Prefetch based on engagement after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    prefetchService.prefetchBasedOnEngagement();
  }, 2000);
});

export default prefetchService;