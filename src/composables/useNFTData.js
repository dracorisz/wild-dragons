/**
 * Centralized NFT Data Service
 * Provides unified data access, caching, and error handling for NFT collections
 */

import { ref, computed } from 'vue';

/**
 * Centralized NFT Data Service
 * @returns {Object} NFT data service methods and state
 */
export function useNFTData() {
  // State management
  const collections = ref({});
  const nfts = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const cache = ref({});
  
  // Cache configuration
  const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache
  const MAX_CACHE_SIZE = 100; // Maximum items in cache

  /**
   * Fetch all collections from meta index
   */
  const fetchCollections = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      // Check cache first
      if (cache.value.collections && isCacheValid(cache.value.collections.timestamp)) {
        collections.value = cache.value.collections.data;
        return collections.value;
      }
      
      // Fetch from API
      const response = await fetch('/meta/index.json');
      if (!response.ok) throw new Error('Failed to fetch collections index');
      
      const data = await response.json();
      
      // Update cache
      cache.value.collections = {
        data: data.collections,
        timestamp: Date.now()
      };
      
      collections.value = data.collections;
      return data.collections;
      
    } catch (err) {
      console.error('Error fetching collections:', err);
      error.value = 'Failed to load collections. Using fallback data.';
      useFallbackCollections();
      return collections.value;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch NFTs for a specific collection
   * @param {string} collectionId - Collection ID to fetch
   */
  const fetchCollectionNFTs = async (collectionId) => {
    try {
      // Check cache first
      const cacheKey = `collection_${collectionId}`;
      if (cache.value[cacheKey] && isCacheValid(cache.value[cacheKey].timestamp)) {
        return cache.value[cacheKey].data;
      }
      
      const response = await fetch(`/data/collections/${collectionId}.json`);
      if (!response.ok) throw new Error(`Failed to fetch collection ${collectionId}`);
      
      const data = await response.json();
      
      // Update cache
      cache.value[cacheKey] = {
        data,
        timestamp: Date.now()
      };
      
      // Clean cache if too large
      cleanCache();
      
      return data;
      
    } catch (err) {
      console.error(`Error fetching collection ${collectionId}:`, err);
      return []; // Return empty array on error
    }
  };

  /**
   * Fetch all NFTs from all collections
   */
  const fetchAllNFTs = async () => {
    try {
      loading.value = true;
      error.value = false;
      
      // Check cache first
      if (cache.value.allNFTs && isCacheValid(cache.value.allNFTs.timestamp)) {
        nfts.value = cache.value.allNFTs.data;
        return nfts.value;
      }
      
      // Fetch collections first
      await fetchCollections();
      
      const allNfts = [];
      
      // Fetch each collection's NFTs
      for (const [id, collection] of Object.entries(collections.value)) {
        const collectionNFTs = await fetchCollectionNFTs(id);
        allNfts.push(...collectionNFTs);
      }
      
      // Update cache
      cache.value.allNFTs = {
        data: allNfts,
        timestamp: Date.now()
      };
      
      nfts.value = allNfts;
      return allNfts;
      
    } catch (err) {
      console.error('Error fetching all NFTs:', err);
      error.value = 'Failed to load NFT data. Using fallback data.';
      useFallbackData();
      return nfts.value;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Filter NFTs by various criteria
   * @param {Object} filters - Filter criteria
   */
  const filterNFTs = (filters = {}) => {
    return computed(() => {
      let filtered = [...nfts.value];
      
      // Filter by collection
      if (filters.collection) {
        filtered = filtered.filter(nft => 
          nft.collection === collections.value[filters.collection]?.name
        );
      }
      
      // Filter by element
      if (filters.elements && filters.elements.length > 0) {
        filtered = filtered.filter(nft => 
          filters.elements.includes(nft.traits?.element)
        );
      }
      
      // Filter by rarity
      if (filters.rarities && filters.rarities.length > 0) {
        filtered = filtered.filter(nft => 
          filters.rarities.includes(nft.traits?.rarity)
        );
      }
      
      // Filter by search term
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(nft => 
          nft.name.toLowerCase().includes(term) ||
          nft.description.toLowerCase().includes(term) ||
          nft.collection.toLowerCase().includes(term)
        );
      }
      
      // Filter by price range
      if (filters.minPrice || filters.maxPrice) {
        filtered = filtered.filter(nft => {
          const price = parseFloat(nft.price?.listed || '0');
          const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
          const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
          return price >= min && price <= max;
        });
      }
      
      return filtered;
    });
  };

  /**
   * Get NFT by ID
   * @param {string} nftId - NFT ID to find
   */
  const getNFTById = (nftId) => {
    return computed(() => nfts.value.find(nft => nft.id === nftId));
  };

  /**
   * Clear cache
   */
  const clearCache = () => {
    cache.value = {};
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
   * Fallback collections data
   */
  const useFallbackCollections = () => {
    collections.value = {
      'dragons': { name: 'Wild Dragons', item_count: 12 },
      'cosmic': { name: 'Cosmic Creatures', item_count: 8 },
      'elemental': { name: 'Elemental Beings', item_count: 10 },
      'fantasy': { name: 'Fantasy Heroes', item_count: 10 },
      'mythical': { name: 'Mythical Creatures', item_count: 10 }
    };
  };

  /**
   * Fallback NFT data
   */
  const useFallbackData = () => {
    const elements = ["Fire", "Water", "Earth", "Air", "Light", "Dark", "Cosmic", "Nature", "Mechanical"];
    const rarityLevels = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];
    
    const mockNfts = [];
    
    // Generate mock NFTs for each collection
    for (const [collectionId, collection] of Object.entries(collections.value)) {
      for (let i = 1; i <= collection.item_count; i++) {
        const element = elements[Math.floor(Math.random() * elements.length)];
        const rarity = rarityLevels[Math.floor(Math.random() * rarityLevels.length)];

        mockNfts.push({
          id: `${collectionId}_${i}`,
          name: `${element} ${collection.name} #${i}`,
          collection: collection.name,
          description: `A powerful ${rarity.toLowerCase()} ${element.toLowerCase()} creature from the Wild Dragons universe.`,
          image: {
            thumbnail: `/assets/${collectionId}/${collectionId}_${i}_thumb.png`,
            preview: `/assets/${collectionId}/${collectionId}_${i}_preview.png`,
            full: `/assets/${collectionId}/${collectionId}_${i}.png`
          },
          traits: {
            rarity: rarity,
            element: element,
            power: Math.floor(Math.random() * 80) + 20
          },
          spiritual: {
            chakra: ["root", "sacral", "solar", "heart", "throat", "third", "crown"][Math.floor(Math.random() * 7)],
            frequency_hz: [396, 417, 528, 639, 741, 852, 963][Math.floor(Math.random() * 7)],
            color: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"][Math.floor(Math.random() * 7)],
            level_unlock: Math.floor(Math.random() * 5) + 1
          },
          price: {
            listed: `${(Math.random() * 2 + 0.1).toFixed(2)} ETH`,
            floor: `${(Math.random() * 1.5 + 0.1).toFixed(2)} ETH`,
            last_sale: `${(Math.random() * 1 + 0.1).toFixed(2)} ETH`
          }
        });
      }
    }

    nfts.value = mockNfts;
    return mockNfts;
  };
  
  /**
   * Normalize NFT data to unified format
   * @param {Object} rawData - Raw NFT data from API
   */
  const normalizeNFTData = (rawData) => {
    try {
      // Handle different data structures
      let items = [];
 
      // Check if data is in collection format (wild_dragons.json style)
      if (rawData.collection && rawData.collection.items) {
        items = rawData.collection.items.map(item => normalizeNFTItem(item, rawData.collection));
      }
      // Check if data is in array format
      else if (Array.isArray(rawData)) {
        items = rawData.map(item => normalizeNFTItem(item));
      }
      // Check if data is in simple object format
      else if (rawData.items) {
        items = rawData.items.map(item => normalizeNFTItem(item, rawData));
      }
 
      return items;
    } catch (err) {
      console.error('Error normalizing NFT data:', err);
      return [];
    }
  };
  
  /**
   * Normalize individual NFT item to unified format
   * @param {Object} item - Raw NFT item
   * @param {Object} collection - Collection metadata
   */
  const normalizeNFTItem = (item, collection = {}) => {
    // Validate required fields
    if (!item.name && !item.token_id) {
      console.warn('Invalid NFT item:', item);
      return null;
    }
 
    // Map different field names to unified format
    const rarity = item.rarity || item.traits?.rarity || 'Common';
    const element = item.metadata?.element || item.traits?.element || 'Unknown';
    const power = item.metadata?.power || item.traits?.power || Math.floor(Math.random() * 50) + 30;
 
    // Generate spiritual attributes if missing
    const chakras = ['root', 'sacral', 'solar', 'heart', 'throat', 'third', 'crown'];
    const frequencies = [396, 417, 528, 639, 741, 852, 963];
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
 
    const spiritual = item.spiritual || {
      chakra: chakras[Math.floor(Math.random() * chakras.length)],
      frequency_hz: frequencies[Math.floor(Math.random() * frequencies.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      level_unlock: Math.floor(Math.random() * 5) + 1
    };
 
    // Map price data
    const price = {
      listed: item.current_listing?.price || item.price?.listed || '0.50 ETH',
      floor: item.floor_price || collection.floor_price || '0.30 ETH',
      last_sale: item.price_history?.[item.price_history.length - 1]?.price || '0.20 ETH'
    };
 
    // Map image data
    const baseImage = item.image || item.thumbnail || item.preview || '/icons/icon-192.png';
    const images = {
      thumbnail: baseImage,
      preview: baseImage,
      full: baseImage
    };
 
    // Build unified NFT object
    return {
      id: item.token_id || item.id || `nft_${Math.random().toString(36).substr(2, 9)}`,
      name: item.name || 'Untitled NFT',
      collection: collection.name || item.collection || 'Unknown Collection',
      description: item.description || collection.description || 'A unique digital collectible from the Wild Dragons universe.',
      image: images,
      traits: {
        rarity: rarity,
        element: element,
        power: power
      },
      spiritual: spiritual,
      price: price
    };
  };
  
  /**
   * Validate NFT data structure
   * @param {Object} nft - NFT data to validate
   */
  const validateNFTData = (nft) => {
    const requiredFields = ['id', 'name', 'collection', 'image', 'traits', 'price'];
    const missingFields = requiredFields.filter(field => !nft[field]);
 
    if (missingFields.length > 0) {
      console.warn(`NFT data missing fields: ${missingFields.join(', ')}`, nft);
      return false;
    }
 
    return true;
  };
  
  /**
   * Enhanced fetch with data normalization
   */
  const fetchCollectionNFTsEnhanced = async (collectionId) => {
    try {
      const cacheKey = `collection_${collectionId}`;
      if (cache.value[cacheKey] && isCacheValid(cache.value[cacheKey].timestamp)) {
        return cache.value[cacheKey].data;
      }
 
      const response = await fetch(`/data/collections/${collectionId}.json`);
      if (!response.ok) throw new Error(`Failed to fetch collection ${collectionId}`);
 
      const rawData = await response.json();
      const normalizedData = normalizeNFTData(rawData);
 
      // Validate and filter invalid items
      const validItems = normalizedData.filter(item => item && validateNFTData(item));
 
      // Update cache
      cache.value[cacheKey] = {
        data: validItems,
        timestamp: Date.now()
      };
 
      // Clean cache if too large
      cleanCache();
 
      return validItems;
 
    } catch (err) {
      console.error(`Error fetching collection ${collectionId}:`, err);
      return [];
    }
  };
  
  /**
   * Enhanced fetch all NFTs with normalization
   */
  const fetchAllNFTsEnhanced = async () => {
    try {
      loading.value = true;
      error.value = false;
 
      // Check cache first
      if (cache.value.allNFTs && isCacheValid(cache.value.allNFTs.timestamp)) {
        nfts.value = cache.value.allNFTs.data;
        return nfts.value;
      }
 
      // Fetch collections first
      await fetchCollections();
 
      const allNfts = [];
 
      // Fetch each collection's NFTs using enhanced method
      for (const [id, collection] of Object.entries(collections.value)) {
        const collectionNFTs = await fetchCollectionNFTsEnhanced(id);
        allNfts.push(...collectionNFTs);
      }
 
      // Update cache
      cache.value.allNFTs = {
        data: allNfts,
        timestamp: Date.now()
      };
 
      nfts.value = allNfts;
      return allNfts;
 
    } catch (err) {
      console.error('Error fetching all NFTs:', err);
      error.value = 'Failed to load NFT data. Using fallback data.';
      useFallbackData();
      return nfts.value;
    } finally {
      loading.value = false;
    }
  };
  
  /**
   * Refresh data by clearing cache and refetching
   */
  const refreshData = async () => {
    clearCache();
    return await fetchAllNFTsEnhanced();
  };
  
  // Return public API
  return {
    collections,
    nfts,
    loading,
    error,
    fetchCollections,
    fetchCollectionNFTs: fetchCollectionNFTsEnhanced,
    fetchAllNFTs: fetchAllNFTsEnhanced,
    filterNFTs,
    getNFTById,
    clearCache,
    refreshData,
    normalizeNFTData,
    validateNFTData
  };
}