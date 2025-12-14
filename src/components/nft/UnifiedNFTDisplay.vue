<template>
  <div class="unified-nft-display">
    <!-- Navigation Section - Using NFTNavigation subcomponent -->
    <NFTNavigation
      :collections="collections"
      :active-collection="selectedCollection"
      @collection-change="handleCollectionChange"
      @source-change="handleSourceChange"
      @filter-change="handleNavigationFilter"
    />

    <!-- Filters Section - Using NFTFilters subcomponent -->
    <NFTFilters
      :collections="collections"
      :elements="elements"
      :rarities="rarityLevels"
      :selected-collection="selectedCollection"
      :selected-elements="selectedElements"
      :selected-rarities="selectedRarities"
      @collection-change="handleCollectionChange"
      @element-change="handleElementChange"
      @rarity-change="handleRarityChange"
      @reset-filters="resetFilters"
    />

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading NFTs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="reloadData" class="retry-button">Retry</button>
    </div>

    <!-- NFT Grid - Using NFTGridLayout subcomponent -->
    <NFTGridLayout
      v-else
      :nfts="filteredNFTs"
      :loading="loading"
      :empty="filteredNFTs.length === 0"
      :image-source="currentSource"
      @select-nft="handleNFTSelect"
    />

    <!-- NFT Detail Modal - Using NFTDetailModal subcomponent -->
    <NFTDetailModal
      :nft="selectedNFT"
      @close="selectedNFT = null"
      @mint="handleMint"
    />
  </div>
</template>

<script>
import NFTFilters from './NFTFilters.vue';
import NFTGridLayout from './NFTGridLayout.vue';
import NFTDetailModal from './NFTDetailModal.vue';
import NFTNavigation from './NFTNavigation.vue';
import { useNFTData } from '../../composables/useNFTData.js';
import { useImageSources } from '../../composables/useImageSources.js';

export default {
  name: 'UnifiedNFTDisplay',
  components: {
    NFTFilters,
    NFTGridLayout,
    NFTDetailModal,
    NFTNavigation
  },
  props: {
    // Allow external data source or use internal fetching
    externalData: {
      type: Object,
      default: null
    },
    // Show mint button in modal
    showMint: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const nftData = useNFTData();
    const imageSources = useImageSources();
  
    return {
      ...nftData,
      ...imageSources,
      selectedCollection: null,
      selectedElements: [],
      selectedRarities: [],
      selectedNFT: null,
      elements: ["Fire", "Water", "Earth", "Air", "Light", "Dark", "Cosmic", "Nature", "Mechanical"],
      rarityLevels: ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
    };
  },
  computed: {
    filteredNFTs() {
      let filtered = [...this.nfts];

      // Filter by collection
      if (this.selectedCollection) {
        filtered = filtered.filter(nft => 
          nft.collection === this.collections[this.selectedCollection]?.name
        );
      }

      // Filter by element
      if (this.selectedElements.length > 0) {
        filtered = filtered.filter(nft => 
          this.selectedElements.includes(nft.traits?.element)
        );
      }

      // Filter by rarity
      if (this.selectedRarities.length > 0) {
        filtered = filtered.filter(nft => 
          this.selectedRarities.includes(nft.traits?.rarity)
        );
      }

      return filtered;
    }
  },
  watch: {
    externalData: {
      immediate: true,
      handler(newData) {
        if (newData) {
          this.processExternalData(newData);
        } else {
          this.fetchAllNFTs();
        }
      }
    }
  },
  methods: {
    // Handle filter changes from NFTFilters component
    handleCollectionChange(collectionId) {
      this.selectedCollection = this.selectedCollection === collectionId ? null : collectionId;
    },

    handleElementChange(element) {
      const index = this.selectedElements.indexOf(element);
      if (index === -1) {
        this.selectedElements.push(element);
      } else {
        this.selectedElements.splice(index, 1);
      }
    },

    handleRarityChange(rarity) {
      const index = this.selectedRarities.indexOf(rarity);
      if (index === -1) {
        this.selectedRarities.push(rarity);
      } else {
        this.selectedRarities.splice(index, 1);
      }
    },

    resetFilters() {
      this.selectedCollection = null;
      this.selectedElements = [];
      this.selectedRarities = [];
    },

    handleNFTSelect(nft) {
      this.selectedNFT = nft;
    },

    handleMint(nft) {
      this.$emit('mint', nft);
    },

    reloadData() {
      this.error = null;
      this.refreshData();
    },

    // Navigation event handlers
    handleSourceChange(sourceId) {
      this.setImageSource(sourceId);
      this.$emit('source-change', sourceId);
    },

    handleNavigationFilter(filter) {
      this.$emit('navigation-filter', filter);
      
      // Apply quick filters
      if (filter.type === 'quick') {
        switch (filter.value) {
          case 'trending':
            // Sort by some trending metric
            break;
          case 'new':
            // Sort by newest
            break;
          case 'top':
            // Sort by highest rated
            break;
          case 'rare':
            // Filter by rare items
            this.selectedRarities = ['Epic', 'Legendary', 'Mythic'];
            break;
        }
      }
    },

    processExternalData(data) {
      try {
        this.collections = data.collections || {};
        this.nfts = data.nfts || [];
        this.loading = false;
      } catch (error) {
        console.error('Error processing external data:', error);
        this.error = 'Invalid data format provided';
        this.loading = false;
      }
    },

    async fetchData() {
      try {
        this.loading = true;
        this.error = null;

        // Load master index
        const indexResponse = await fetch('/meta/index.json');
        if (!indexResponse.ok) throw new Error('Failed to fetch collections index');
        
        const indexData = await indexResponse.json();
        this.collections = indexData.collections;

        // Load NFTs from all collections
        const allNfts = [];
        for (const [id, collection] of Object.entries(this.collections)) {
          try {
            const nftResponse = await fetch(`/data/collections/${id}.json`);
            if (!nftResponse.ok) continue;
            const nftData = await nftResponse.json();
            allNfts.push(...nftData);
          } catch (err) {
            console.error(`Error loading collection ${id}:`, err);
          }
        }

        this.nfts = allNfts;
      } catch (error) {
        console.error('Error loading NFT data:', error);
        this.error = 'Failed to load NFT data. Using mock data.';
        this.useMockData();
      } finally {
        this.loading = false;
      }
    },

    useMockData() {
      // Generate mock collections and NFTs
      const mockCollections = {
        'dragons': { name: 'Wild Dragons', item_count: 12 },
        'cosmic': { name: 'Cosmic Creatures', item_count: 8 },
        'elemental': { name: 'Elemental Beings', item_count: 10 },
        'fantasy': { name: 'Fantasy Heroes', item_count: 10 },
        'mythical': { name: 'Mythical Creatures', item_count: 10 }
      };

      const mockNfts = [];

      // Generate mock NFTs for each collection
      for (const [collectionId, collection] of Object.entries(mockCollections)) {
        for (let i = 1; i <= collection.item_count; i++) {
          const element = this.elements[Math.floor(Math.random() * this.elements.length)];
          const rarity = this.rarityLevels[Math.floor(Math.random() * this.rarityLevels.length)];

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

      this.collections = mockCollections;
      this.nfts = mockNfts;
    }
  }
};
</script>

<style scoped>
.unified-nft-display {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 100vh;
  padding: 1rem;
  color: white; /* Ensure text is white on dark background */
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  color: white; /* White text for dark theme */
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--accent-color, #00fff7);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-message {
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.retry-button {
  background-color: var(--accent-color, #00fff7);
  color: #23234b; /* Dark text on light background */
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background-color: #00e1d9;
  transform: translateY(-2px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>