/**
 * Image Source Service
 * Dynamic image loading from multiple open-source platforms
 * Supports Pinterest, Unsplash, Pexels, Grok Imagine, and internal assets
 */

import { ref, computed } from 'vue';

/**
 * Image Source Service
 * @returns {Object} Image source service methods and state
 */
export function useImageSources() {
  // State management
  const currentSource = ref('internal');
  const loading = ref(false);
  const error = ref(null);
  const cache = ref({});
  
  // Image source configurations
  const sources = {
    internal: {
      name: 'Internal Assets',
      baseUrl: '',
      requiresApiKey: false,
      description: 'Local project assets'
    },
    pinterest: {
      name: 'Pinterest',
      baseUrl: 'https://www.pinterest.com/resource/',
      requiresApiKey: true,
      description: 'Pinterest image resources',
      apiKey: import.meta.env.VITE_PINTEREST_API_KEY || 'your-pinterest-api-key',
      searchUrl: 'https://api.pinterest.com/v1/images/search/'
    },
    unsplash: {
      name: 'Unsplash',
      baseUrl: 'https://source.unsplash.com/',
      requiresApiKey: true,
      description: 'High-quality Unsplash images',
      apiKey: import.meta.env.VITE_UNSPLASH_API_KEY || 'your-unsplash-api-key',
      searchUrl: 'https://api.unsplash.com/search/photos/'
    },
    pexels: {
      name: 'Pexels',
      baseUrl: 'https://www.pexels.com/photo/',
      requiresApiKey: true,
      description: 'Free stock photos from Pexels',
      apiKey: import.meta.env.VITE_PEXELS_API_KEY || 'your-pexels-api-key',
      searchUrl: 'https://api.pexels.com/v1/search'
    },
    grok: {
      name: 'Grok Imagine',
      baseUrl: 'https://grok.imagine/api/',
      requiresApiKey: true,
      description: 'AI-generated images from Grok',
      apiKey: import.meta.env.VITE_GROK_API_KEY || 'your-grok-api-key',
      searchUrl: 'https://grok.imagine/api/generate'
    }
  };
  
  // Cache configuration
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours cache
  const MAX_CACHE_SIZE = 200; // Maximum cached images

  /**
   * Set the current image source
   * @param {string} sourceId - Image source ID
   */
  const setImageSource = (sourceId) => {
    if (sources[sourceId]) {
      currentSource.value = sourceId;
      return true;
    }
    console.warn(`Unknown image source: ${sourceId}`);
    return false;
  };

  /**
   * Get image URL based on current source and parameters
   * @param {Object} params - Image parameters
   * @param {string} params.collection - Collection ID
   * @param {string} params.itemId - Item ID
   * @param {string} params.type - Image type (thumbnail, preview, full)
   * @param {string} params.query - Search query for external sources
   * @param {number} params.width - Desired width
   * @param {number} params.height - Desired height
   */
  const getImageUrl = (params) => {
    const { collection, itemId, type = 'preview', query, width = 800, height = 800 } = params;
    
    // Check cache first
    const cacheKey = `${currentSource.value}_${collection}_${itemId}_${type}`;
    if (cache.value[cacheKey] && isCacheValid(cache.value[cacheKey].timestamp)) {
      return cache.value[cacheKey].url;
    }

    const sourceConfig = sources[currentSource.value];
    
    try {
      let url = '';
      
      switch (currentSource.value) {
        case 'internal':
          // Internal asset paths
          const sizeMap = {
            thumbnail: '_thumb.png',
            preview: '_preview.png',
            full: '.png'
          };
          url = `/assets/${collection}/${collection}_${itemId}${sizeMap[type]}`;
          break;
          
        case 'unsplash':
          // Unsplash direct image URL
          url = `${sourceConfig.baseUrl}${width}x${height}/?${encodeURIComponent(query || collection)}`;
          break;
          
        case 'pexels':
          // Pexels image URL (would need API call in real implementation)
          url = `${sourceConfig.baseUrl}${collection}-${itemId}/`;
          break;
          
        case 'pinterest':
          // Pinterest image URL
          url = `${sourceConfig.baseUrl}${collection}/${itemId}/`;
          break;
          
        case 'grok':
          // Grok Imagine would need API call for generation
          url = `${sourceConfig.baseUrl}generate?prompt=${encodeURIComponent(query || collection)}&size=${width}x${height}`;
          break;
      }

      // Update cache
      cache.value[cacheKey] = {
        url,
        timestamp: Date.now(),
        source: currentSource.value
      };

      // Clean cache if too large
      cleanCache();

      return url;
      
    } catch (err) {
      console.error(`Error generating image URL for source ${currentSource.value}:`, err);
      // Fallback to internal assets
      return getFallbackImageUrl(collection, itemId, type);
    }
  };

  /**
   * Fetch image from external source (for sources requiring API calls)
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query
   * @param {number} params.page - Page number
   * @param {number} params.perPage - Items per page
   */
  const fetchExternalImages = async (params) => {
    const { query, page = 1, perPage = 20 } = params;
    const sourceConfig = sources[currentSource.value];
    
    if (!sourceConfig.requiresApiKey || !sourceConfig.apiKey) {
      console.warn(`API key required for ${currentSource.value} but not configured`);
      return [];
    }
    
    try {
      loading.value = true;
      error.value = null;
      
      const cacheKey = `${currentSource.value}_search_${query}_${page}_${perPage}`;
      
      // Check cache first
      if (cache.value[cacheKey] && isCacheValid(cache.value[cacheKey].timestamp)) {
        return cache.value[cacheKey].data;
      }
      
      // Build API request
      let url = '';
      let headers = {
        'Authorization': `Bearer ${sourceConfig.apiKey}`,
        'Accept': 'application/json'
      };
      
      switch (currentSource.value) {
        case 'unsplash':
          url = `${sourceConfig.searchUrl}?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
          break;
          
        case 'pexels':
          url = `${sourceConfig.searchUrl}?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
          break;
          
        case 'pinterest':
          url = `${sourceConfig.searchUrl}?query=${encodeURIComponent(query)}&page=${page}&limit=${perPage}`;
          headers = {
            ...headers,
            'X-Pinterest-API-Version': '2024-01-01'
          };
          break;
          
        case 'grok':
          // Grok would use a different approach for image generation
          url = `${sourceConfig.searchUrl}?prompt=${encodeURIComponent(query)}&count=${perPage}`;
          break;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process response based on source
      let images = [];
      
      switch (currentSource.value) {
        case 'unsplash':
          images = data.results.map(item => ({
            id: item.id,
            url: item.urls.regular,
            thumbnail: item.urls.thumb,
            description: item.description || item.alt_description,
            source: 'unsplash',
            author: item.user.name
          }));
          break;
          
        case 'pexels':
          images = data.photos.map(item => ({
            id: item.id,
            url: item.src.large,
            thumbnail: item.src.medium,
            description: item.alt || '',
            source: 'pexels',
            author: item.photographer
          }));
          break;
          
        case 'pinterest':
          images = data.data.map(item => ({
            id: item.id,
            url: item.images.orig.url,
            thumbnail: item.images['236x'].url,
            description: item.note || '',
            source: 'pinterest',
            author: item.pinner.username
          }));
          break;
          
        case 'grok':
          images = data.images.map((url, index) => ({
            id: `${Date.now()}_${index}`,
            url: url,
            thumbnail: url, // Grok might return same URL for all sizes
            description: `AI-generated image for ${query}`,
            source: 'grok',
            author: 'Grok Imagine'
          }));
          break;
      }
      
      // Update cache
      cache.value[cacheKey] = {
        data: images,
        timestamp: Date.now()
      };
      
      return images;
      
    } catch (err) {
      console.error(`Error fetching images from ${currentSource.value}:`, err);
      error.value = `Failed to load images from ${sourceConfig.name}. Using fallback.`;
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get fallback image URL
   * @param {string} collection - Collection ID
   * @param {string} itemId - Item ID
   * @param {string} type - Image type
   */
  const getFallbackImageUrl = (collection, itemId, type = 'preview') => {
    const fallbackImages = {
      thumbnail: '/icons/icon-192.png',
      preview: '/icons/icon-512.png',
      full: '/icons/icon-512.png'
    };
    return fallbackImages[type] || fallbackImages.preview;
  };

  /**
   * Check if cache is still valid
   * @param {number} timestamp - Cache timestamp
   */
  const isCacheValid = (timestamp) => {
    return Date.now() - timestamp < CACHE_TTL;
  };

  /**
   * Clean cache if it exceeds maximum size
   */
  const cleanCache = () => {
    const cacheKeys = Object.keys(cache.value);
    if (cacheKeys.length <= MAX_CACHE_SIZE) return;
    
    // Remove oldest items first
    const sortedKeys = cacheKeys.sort((a, b) => 
      cache.value[a].timestamp - cache.value[b].timestamp
    );
    
    const keysToRemove = sortedKeys.slice(0, cacheKeys.length - MAX_CACHE_SIZE);
    keysToRemove.forEach(key => delete cache.value[key]);
  };

  /**
   * Clear all cached images
   */
  const clearCache = () => {
    cache.value = {};
  };

  /**
   * Get current source information
   */
  const getCurrentSourceInfo = () => {
    return sources[currentSource.value];
  };

  /**
   * Get all available sources
   */
  const getAllSources = () => {
    return sources;
  };

  // Return public API
  return {
    currentSource,
    loading,
    error,
    sources,
    setImageSource,
    getImageUrl,
    fetchExternalImages,
    getFallbackImageUrl,
    getCurrentSourceInfo,
    getAllSources,
    clearCache
  };
}

/**
 * Image URL Builder - Helper function for direct URL construction
 * @param {string} source - Image source
 * @param {Object} params - Image parameters
 */
export function buildImageUrl(source, params) {
  const { collection, itemId, type = 'preview', query, width = 800, height = 800 } = params;
  
  const sourceConfigs = {
    internal: (c, i, t) => `/assets/${c}/${c}_${i}${t === 'thumbnail' ? '_thumb.png' : t === 'preview' ? '_preview.png' : '.png'}`,
    unsplash: (q, w, h) => `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(q)}`,
    pexels: (c, i) => `https://www.pexels.com/photo/${c}-${i}/`,
    pinterest: (c, i) => `https://www.pinterest.com/resource/${c}/${i}/`,
    grok: (q, w, h) => `https://grok.imagine/api/generate?prompt=${encodeURIComponent(q)}&size=${w}x${h}`
  };
  
  try {
    if (sourceConfigs[source]) {
      if (source === 'internal') {
        return sourceConfigs[source](collection, itemId, type);
      } else if (source === 'unsplash' || source === 'grok') {
        return sourceConfigs[source](query || collection, width, height);
      } else {
        return sourceConfigs[source](collection, itemId);
      }
    }
    return `/assets/${collection}/${collection}_${itemId}_preview.png`;
  } catch (err) {
    console.error('Error building image URL:', err);
    return `/icons/icon-512.png`;
  }
}