/**
 * DevSTon Unified Image Service
 * Consolidates Pexels and Unsplash APIs with provider strategy pattern
 *
 * @author DevSTon Team
 * @version 2.0.0
 */

class SSTokenImageService {
  constructor() {
    this.providers = {};
    this.cache = new Map();
    this.requests = new Map();
    this.isInitialized = false;

    // DevSTon optimized categories
    this.categories = {
      hero: ['landscape', 'technology innovation'],
      community: ['african people', 'african business', 'african community', 'african youth'],
      technology: ['african technology', 'african innovation', 'african developers', 'african startup'],
      finance: ['african finance', 'african banking', 'african investment', 'african economy'],
      empowerment: ['african women', 'african leadership', 'african education', 'african empowerment'],
      infrastructure: ['solar energy', 'digital infrastructure', 'internet connectivity', 'smart city']
    };

    this.loadConfig();
  }

  loadConfig() {
    // Configuration for both providers
    this.providers.unsplash = {
      baseURL: "https://api.unsplash.com",
      accessKey: import.meta.env.VITE_UNSPLASH_API_KEY,
      isDemoMode: !import.meta.env.VITE_UNSPLASH_API_KEY || import.meta.env.VITE_UNSPLASH_API_KEY === "demo-key",
      customQuery: "fintech innovation attractive female fresh modern curly curvature",
      lookstudioFilter: " @lookstudio",
      useLookstudioFilter: true
    };

    this.providers.pexels = {
      baseURL: 'https://api.pexels.com',
      accessKey: import.meta.env.VITE_PEXELS_API_KEY,
      isDemoMode: !import.meta.env.VITE_PEXELS_API_KEY || import.meta.env.VITE_PEXELS_API_KEY === 'demo-key'
    };

    // Performance settings
    this.imageWidth = parseInt(import.meta.env.VITE_UNSPLASH_IMAGE_WIDTH) || 1920;
    this.imageHeight = parseInt(import.meta.env.VITE_UNSPLASH_IMAGE_HEIGHT) || 1080;
    this.imageQuality = parseInt(import.meta.env.VITE_UNSPLASH_IMAGE_QUALITY) || 85;
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
    this.cacheEnabled = false; // Disable caching as requested

    // Enhanced DevSTon fallback images
    this.fallbackImages = {
      hero: "/images/pngegg.png",
      community: "/images/pngegg.png",
      technology: "/images/pngegg.png",
      finance: "/images/pngegg.png",
      empowerment: "/images/pngegg.png",
      infrastructure: "/images/pngegg.png",
    };

    this.isInitialized = true;
  }

  /**
   * Get images from the best available provider
   */
  async getImages(category, customQuery = null, count = 1) {
    if (!this.isInitialized) this.loadConfig();

    const query = customQuery || this.categories[category]?.[0] || 'african innovation';
    const cacheKey = `unified-${category}-${query}-${count}`;

    // Check cache first
    if (this.cacheEnabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (this.isCacheValid(cached)) {
        console.log(` DevSTon: Using cached image for ${category}`);
        return cached.data;
      }
    }

    // Request deduplication
    if (this.requests.has(cacheKey)) {
      console.log(` DevSTon: Using pending request for ${category}`);
      return this.requests.get(cacheKey);
    }

    console.log(` DevSTon: Starting unified image fetch for ${category}`);

    const requestPromise = this.fetchFromBestProvider(query, category, count)
      .then((data) => {
        if (this.cacheEnabled && data && data.length > 0) {
          this.cache.set(cacheKey, { data, timestamp: Date.now() });
          console.log(` DevSTon: Cached ${data.length} images for ${category}`);
        }
        return data;
      })
      .catch((error) => {
        console.warn(` DevSTon: Failed to fetch images for ${category}:`, error.message);
        console.log(` DevSTon: Using fallback image for ${category}`);
        return [this.getFallbackImage(category)];
      })
      .finally(() => {
        this.requests.delete(cacheKey);
      });

    this.requests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * Fetch from the best available provider
   */
  async fetchFromBestProvider(query, category, count = 1) {
    // Try Unsplash first (better quality)
    if (!this.providers.unsplash.isDemoMode) {
      try {
        const result = await this.fetchFromUnsplash(query, category, count);
        if (result && result.length > 0) {
          console.log(` DevSTon: Successfully fetched from Unsplash for ${category}`);
          return result;
        }
      } catch (error) {
        console.warn(` DevSTon: Unsplash failed for ${category}, trying Pexels:`, error.message);
      }
    }

    // Fallback to Pexels
    if (!this.providers.pexels.isDemoMode) {
      try {
        const result = await this.fetchFromPexels(query, category, count);
        if (result && result.length > 0) {
          console.log(` DevSTon: Successfully fetched from Pexels for ${category}`);
          return result;
        }
      } catch (error) {
        console.warn(` DevSTon: Pexels failed for ${category}:`, error.message);
      }
    }

    // Both providers failed or in demo mode
    console.log(` DevSTon: All providers failed or in demo mode for ${category}, using fallback`);
    return this.getFallbackImage(category);
  }

  /**
   * Fetch from Unsplash API
   */
  async fetchFromUnsplash(query, category, count = 1) {
    const config = this.providers.unsplash;
    const searchQuery = `${query} ${category}${config.useLookstudioFilter ? config.lookstudioFilter : ''}`;

    const url = new URL(`${config.baseURL}/search/photos`);
    url.searchParams.append("query", searchQuery);
    url.searchParams.append("per_page", Math.max(count, 1));
    url.searchParams.append("orientation", this.getOrientation(category));
    url.searchParams.append("content_filter", "high");
    url.searchParams.append("client_id", config.accessKey);

    console.log(` DevSTon Unsplash: Fetching ${category} images for "${searchQuery}"`);

    const response = await fetch(url.toString(), {
      headers: {
        "Accept-Version": "v1",
        Authorization: `Client-ID ${config.accessKey}`,
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Unsplash HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`No Unsplash images found for "${searchQuery}"`);
    }

    const processedImages = data.results.map((image) => this.processUnsplashImage(image, category));
    return processedImages.slice(0, count);
  }

  /**
   * Fetch from Pexels API
   */
  async fetchFromPexels(query, category, count = 1) {
    const config = this.providers.pexels;

    const url = new URL(`${config.baseURL}/v1/search`);
    url.searchParams.append('query', `${query} ${category}`);
    url.searchParams.append('per_page', Math.max(count, 1));
    url.searchParams.append('orientation', 'landscape');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': config.accessKey
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      throw new Error(`Pexels HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      throw new Error(`No Pexels images found for "${query} ${category}"`);
    }

    const processedImages = data.photos.map(photo => this.processPexelsImage(photo, category));
    console.log(` DevSTon Pexels: Found ${processedImages.length} images for ${category}`);

    return processedImages.slice(0, count);
  }

  /**
   * Process Unsplash image data
   */
  processUnsplashImage(image, category) {
    const { id, urls, alt_description, description, user, links } = image;

    const optimizedUrls = {
      thumbnail: this.optimizeImageUrl(urls.thumbnail, 300, 200),
      small: this.optimizeImageUrl(urls.small, 800, 600),
      regular: this.optimizeImageUrl(urls.regular, 1200, 900),
      full: this.optimizeImageUrl(urls.full, 1920, 1080),
    };

    return {
      id,
      urls: optimizedUrls,
      alt: alt_description || description || `DevSTon ${category} image`,
      description: description || alt_description,
      photographer: user.name,
      photographer_url: user.links.html,
      category,
      provider: 'unsplash',
      attribution: {
        photographer: user.name,
        photographer_url: user.links.html,
        unsplash_url: links.html,
        unsplash_id: id,
      },
    };
  }

  /**
   * Process Pexels image data
   */
  processPexelsImage(photo, category) {
    const { id, src, alt, photographer, photographer_url } = photo;

    return {
      id: `pexels-${id}`,
      urls: {
        thumbnail: src.small,
        small: src.medium,
        regular: src.large,
        full: src.large2x
      },
      alt: alt || `DevSTon ${category} image`,
      description: alt,
      photographer: photographer,
      photographer_url: photographer_url,
      category,
      provider: 'pexels',
      attribution: {
        photographer: photographer,
        photographer_url: photographer_url,
        pexels_url: `https://www.pexels.com/photo/${id}`,
        pexels_id: id
      }
    };
  }

  /**
   * Optimize image URL for Unsplash
   */
  optimizeImageUrl(originalUrl, width, height) {
    try {
      if (!originalUrl || typeof originalUrl !== "string" || originalUrl.length < 10) {
        return "/images/background01.jpg";
      }

      if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
        return "/images/background01.jpg";
      }

      const url = new URL(originalUrl);
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("crop", "entropy");
      url.searchParams.set("w", width);
      url.searchParams.set("h", height);
      url.searchParams.set("q", this.imageQuality);
      url.searchParams.set("fm", "webp");
      return url.toString();
    } catch (error) {
      console.warn(" DevSTon: Failed to optimize image URL:", error, "Input:", originalUrl);
      return "/images/background01.jpg";
    }
  }

  /**
   * Get orientation for category
   */
  getOrientation(category) {
    const orientations = {
      hero: "landscape",
      community: "landscape",
      technology: "landscape",
      finance: "landscape",
      empowerment: "portrait",
      infrastructure: "landscape",
    };
    return orientations[category] || "landscape";
  }

  /**
   * Get fallback image
   */
  getFallbackImage(category) {
    const fallbackUrl = this.fallbackImages[category] || this.fallbackImages.hero;
    return {
      id: `fallback-${category}`,
      urls: {
        thumbnail: fallbackUrl,
        small: fallbackUrl,
        regular: fallbackUrl,
        full: fallbackUrl,
      },
      alt: `DevSTon ${category} fallback`,
      description: `DevSTon ${category} placeholder`,
      photographer: "DevSTon Team",
      photographer_url: "https://dev.sstoken.space",
      category,
      provider: 'fallback',
      isFallback: true,
    };
  }

  /**
   * Check if cached data is still valid
   */
  isCacheValid(cacheEntry) {
    if (!cacheEntry) return false;
    return Date.now() - cacheEntry.timestamp < this.cacheTimeout;
  }

  /**
   * Clear expired cache
   */
  clearExpiredCache() {
    let clearedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (!this.isCacheValid(entry)) {
        this.cache.delete(key);
        clearedCount++;
      }
    }

    if (clearedCount > 0) {
      console.log(` DevSTon: Cleared ${clearedCount} expired cache entries`);
    }
  }

  /**
   * Get random image from category
   */
  async getRandomImage(category) {
    return this.getImages(category, null, 1).then((images) =>
      (images && images.length > 0 ? images[0] : this.getFallbackImage(category))
    );
  }

  /**
   * Preload critical images
   */
  async preloadImages(categories = ["hero"]) {
    console.log(" DevSTon: Preloading critical images...");

    const preloadPromises = categories.map(async (category) => {
      try {
        const images = await this.getImages(category, null, 1);
        if (images && images.length > 0) {
          const img = new Image();
          img.src = images[0].urls.regular;
          return img;
        }
      } catch (error) {
        console.warn(` DevSTon: Failed to preload ${category} images:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log(" DevSTon: Image preloading completed");
  }

  /**
   * Get provider status
   */
  getProviderStatus() {
    return {
      unsplash: {
        available: !this.providers.unsplash.isDemoMode,
        configured: !!this.providers.unsplash.accessKey
      },
      pexels: {
        available: !this.providers.pexels.isDemoMode,
        configured: !!this.providers.pexels.accessKey
      }
    };
  }
}

// Create singleton instance
const imageService = new SSTokenImageService();

// Auto-clear expired cache every hour
setInterval(
  () => {
    imageService.clearExpiredCache();
  },
  60 * 60 * 1000,
);

// Export singleton instance
export { imageService };
export default imageService;