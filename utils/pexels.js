/**
 * DevSTon Pexels API Integration
 * Professional image sourcing with caching and optimization
 */

class SSTokenPexels {
  constructor() {
    this.baseURL = 'https://api.pexels.com';
    this.cache = new Map();
    this.requests = new Map();
    this.isInitialized = false;
    
    // DevSTon optimized categories
    this.categories = {
      hero: ['landscape', ' technology innovation'],
      community: ['african people', 'african business', 'african community', 'african youth'],
      technology: ['african technology', 'african innovation', 'african developers', 'african startup'],
      finance: ['african finance', 'african banking', 'african investment', 'african economy'],
      empowerment: ['african women', 'african leadership', 'african education', 'african empowerment']
    };
    
    this.loadConfig();
  }
  
  loadConfig() {
    this.accessKey = import.meta.env.VITE_PEXELS_API_KEY;
    this.isDemoMode = !this.accessKey || this.accessKey === 'demo-key';
    
    this.imageWidth = 800;
    this.imageHeight = 600;
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
    
    // DevSTon fallback images
    this.fallbackImages = {
      hero: '/images/bg-gold.jpg',
      community: '/images/Flag_of_Global_Community.png',
      technology: '/images/night-flag.jpg',
      finance: '/images/bg-horse.jpg',
      empowerment: '/images/bulding.jpg'
    };
    
    if (this.isDemoMode) {
      console.log(' DevSTon Pexels: Demo mode - using fallback images');
    }
    
    this.isInitialized = true;
  }
  
  async getImages(category, customQuery = null, count = 1) {
    if (!this.isInitialized) this.loadConfig();
    
    const query = customQuery || this.categories[category]?.[0] || 'african innovation';
    const cacheKey = `pexels-${category}-${query}-${count}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }
    
    if (this.requests.has(cacheKey)) {
      return this.requests.get(cacheKey);
    }
    
    const requestPromise = this.fetchImages(query, category, count)
      .then(data => {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      })
      .catch(error => {
        console.warn(` DevSTon Pexels: Failed to fetch ${category}:`, error.message);
        return this.getFallbackImage(category);
      })
      .finally(() => this.requests.delete(cacheKey));
    
    this.requests.set(cacheKey, requestPromise);
    return requestPromise;
  }
  
  async fetchImages(query, category, count = 1) {
    if (this.isDemoMode) {
      return this.getFallbackImage(category);
    }
    
    const url = new URL(`${this.baseURL}/v1/search`);
    url.searchParams.append('query', `${query} ${category}`);
    url.searchParams.append('per_page', Math.max(count, 1));
    url.searchParams.append('orientation', 'landscape');
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': this.accessKey
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
    
    const processedImages = data.photos.map(photo => this.processImage(photo, category));
    console.log(` DevSTon Pexels: Found ${processedImages.length} images for ${category}`);
    
    return processedImages.slice(0, count);
  }
  
  processImage(photo, category) {
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
      attribution: {
        photographer: photographer,
        photographer_url: photographer_url,
        pexels_url: `https://www.pexels.com/photo/${id}`,
        pexels_id: id
      }
    };
  }
  
  getFallbackImage(category) {
    const fallbackUrl = this.fallbackImages[category] || this.fallbackImages.hero;
    return {
      id: `pexels-fallback-${category}`,
      urls: {
        thumbnail: fallbackUrl,
        small: fallbackUrl,
        regular: fallbackUrl,
        full: fallbackUrl
      },
      alt: `DevSTon ${category} fallback`,
      description: `DevSTon ${category} placeholder`,
      photographer: 'DevSTon Team',
      photographer_url: 'https://dev.sstoken.space',
      category,
      isFallback: true
    };
  }
}

// Create singleton instance
const devsPexels = new SSTokenPexels();

export { devsPexels };
export default SSTokenPexels;