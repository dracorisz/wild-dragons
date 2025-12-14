/**
 * DevSTon Unsplash API Integration
 * Professional image sourcing with caching and optimization
 *
 * @author DevSTon Team
 * @version 1.0.0
 */

class SSTokenUnsplash {
  constructor() {
    this.baseURL = "https://api.unsplash.com";
    this.cache = new Map();
    this.requests = new Map();
    this.isInitialized = false;
    this.customQuery = "fintech innovation attractive NSFW female fresh modern curly curvature";
    // Optimized DevSTon categories with device-specific queries
    this.categories = {
      hero: ["landscape", " technology innovation"],
      community: [" community gathering", " students learning", " startup office", " digital inclusion"],
      technology: [" blockchain developer", " cryptocurrency", " fintech innovation", " mobile banking"],
      finance: [" business finance", " investment banking", " financial growth", " money digital"],
      empowerment: [" woman entrepreneur", " youth empowerment", " education technology", " leadership development"],
      infrastructure: [" solar energy", " digital infrastructure", " internet connectivity", " smart city"],
    };

    // Add @lookstudio filter to all queries
    this.lookstudioFilter = " @lookstudio";
    this.useLookstudioFilter = true; // Flag to toggle @lookstudio filter

    this.loadConfig();
  }

  loadConfig() {
    this.accessKey = import.meta.env.VITE_UNSPLASH_API_KEY;
    this.isDemoMode = !this.accessKey || this.accessKey === "demo-key";

    // Performance-optimized settings
    this.imageWidth = parseInt(import.meta.env.VITE_UNSPLASH_IMAGE_WIDTH) || 1920;
    this.imageHeight = parseInt(import.meta.env.VITE_UNSPLASH_IMAGE_HEIGHT) || 1080;
    this.imageQuality = parseInt(import.meta.env.VITE_UNSPLASH_IMAGE_QUALITY) || 85;
    this.cacheTimeout = 24 * 60 * 60 * 1000;
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

    if (this.isDemoMode) {
      console.log(" DevSTon: Demo mode - using fallback images");
    }

    this.isInitialized = true;
  }

  /**
   * Generate cache key for requests
   */
  getCacheKey(query, category, count = 1) {
    return `${category}-${query}-${count}`;
  }

  /**
   * Check if cached data is still valid
   */
  isCacheValid(cacheEntry) {
    if (!cacheEntry) return false;
    return Date.now() - cacheEntry.timestamp < this.cacheTimeout;
  }

  async getImages(category, customQuery = null, count = 1) {
    if (!this.isInitialized) this.loadConfig();
    var customQuery = "fintech innovation attractive NSFW female fresh modern curly curvature";
    const query = customQuery;
    const cacheKey = this.getCacheKey(query, category, count);

    // Optimized cache check
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

    console.log(` DevSTon: Starting image fetch for ${category}`);

    const requestPromise = this.fetchImages(query, category, count)
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

  async fetchImages(query, category, count = 1) {
    if (this.isDemoMode) {
      console.log(` DevSTon: Demo mode - using fallback for ${category}`);
      return this.getFallbackImage(category);
    }

    // Add @lookstudio filter to the query as requested
    const searchQuery = `${query} ${category}${this.useLookstudioFilter ? this.lookstudioFilter : ''}`;
    const url = new URL(`${this.baseURL}/search/photos`);

    url.searchParams.append("query", searchQuery);
    url.searchParams.append("per_page", Math.max(count, 1));
    url.searchParams.append("orientation", this.getOrientation(category));
    url.searchParams.append("content_filter", "high");
    url.searchParams.append("client_id", this.accessKey);

    console.log(` DevSTon: Fetching ${category} images for "${searchQuery}"`);

    try {
      const response = await fetch(url.toString(), {
        headers: {
          "Accept-Version": "v1",
          Authorization: `Client-ID ${this.accessKey}`,
        },
        signal: AbortSignal.timeout(15000), // Increased timeout
      });

      if (!response.ok) {
        console.warn(` DevSTon: API error ${response.status} for ${category}, using fallback`);
        return this.getFallbackImage(category);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.warn(` DevSTon: No images found for "${searchQuery}", using fallback`);
        return this.getFallbackImage(category);
      }

      const processedImages = data.results.map((image) => this.processImage(image, category));

      console.log(` DevSTon: Found ${processedImages.length} images for ${category}`);
      return processedImages.slice(0, count);
    } catch (error) {
      console.warn(` DevSTon: Network error for ${category}:`, error.message, "- using fallback");
      return this.getFallbackImage(category);
    }
  }

  processImage(image, category) {
    const { id, urls, alt_description, description, user, links } = image;

    // Optimized URL generation
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
      attribution: {
        photographer: user.name,
        photographer_url: user.links.html,
        unsplash_url: links.html,
        unsplash_id: id,
      },
    };
  }

  optimizeImageUrl(originalUrl, width, height) {
    try {
      // Validate URL format - only proceed if it looks like a valid URL
      if (!originalUrl || typeof originalUrl !== "string" || originalUrl.length < 10) {
        return "/images/background01.jpg"; // Fallback to local image
      }

      // Ensure URL has proper protocol
      if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
        return "/images/background01.jpg"; // Fallback to local image
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
      return "/images/background01.jpg"; // Always fallback to local image
    }
  }

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
      isFallback: true,
    };
  }

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
   * Toggle @lookstudio filter
   * @param {boolean} enable - Enable or disable @lookstudio filter
   */
  setLookstudioFilter(enable) {
    this.useLookstudioFilter = enable;
    console.log(` DevSTon: @lookstudio filter ${enable ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current @lookstudio filter status
   * @returns {boolean} Current filter status
   */
  getLookstudioFilterStatus() {
    return this.useLookstudioFilter;
  }

  getRandomImage(category) {
    return this.getImages(category, null, 1).then((images) => (images && images.length > 0 ? images[0] : this.getFallbackImage(category)));
  }
}

// Create singleton instance
const devsUnsplash = new SSTokenUnsplash();

// Auto-clear expired cache every hour
setInterval(
  () => {
    devsUnsplash.clearExpiredCache();
  },
  60 * 60 * 1000,
);

export { devsUnsplash };
export default SSTokenUnsplash;
