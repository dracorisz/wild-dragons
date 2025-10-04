<template>
  <div class="nft-marketplace">
    <div class="filter-section mb-6">
      <h2 class="text-2xl font-bold mb-4 text-dragon">Collections</h2>
      <div class="collections-slider flex overflow-x-auto gap-4 pb-4">
        <button
          v-for="(collection, id) in collections"
          :key="id"
          @click="selectedCollection = id === selectedCollection ? null : id"
          class="collection-button px-4 py-2 rounded-lg whitespace-nowrap"
          :class="selectedCollection === id ? 'bg-accent text-white' : 'bg-primary/50 hover:bg-primary'"
        >
          {{ collection.name }} ({{ collection.item_count }})
        </button>
      </div>
      
      <div class="element-filters mt-4">
        <h3 class="text-xl font-bold mb-2 text-sky">Elements</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="element in elements"
            :key="element"
            @click="toggleElement(element)"
            class="element-button px-3 py-1 rounded-md text-sm"
            :class="selectedElements.includes(element) ? 'bg-accent/80 text-white' : 'bg-primary/30 hover:bg-primary/50'"
          >
            {{ element }}
          </button>
        </div>
      </div>
      
      <div class="rarity-filters mt-4">
        <h3 class="text-xl font-bold mb-2 text-dragon">Rarity</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="rarity in rarityLevels"
            :key="rarity"
            @click="toggleRarity(rarity)"
            class="rarity-button px-3 py-1 rounded-md text-sm"
            :class="selectedRarities.includes(rarity) ? 'bg-accent/80 text-white' : 'bg-primary/30 hover:bg-primary/50'"
          >
            {{ rarity }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="nft-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="nft in filteredNfts" 
        :key="nft.id" 
        class="nft-card bg-primary/20 rounded-xl overflow-hidden border border-primary/30 hover:border-accent transition-all"
        @click="selectNft(nft)"
      >
        <div class="nft-image aspect-square overflow-hidden relative">
          <img 
            :src="nft.image.preview || nft.image.thumbnail" 
            :alt="nft.name"
            class="w-full h-full object-cover" 
            loading="lazy"
          />
          <div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
            {{ nft.traits.rarity }}
          </div>
          <div class="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
            {{ nft.traits.element }}
          </div>
        </div>
        <div class="nft-info p-4">
          <h3 class="text-lg font-bold mb-1 truncate">{{ nft.name }}</h3>
          <p class="text-sm opacity-80 mb-3 line-clamp-2">{{ nft.description }}</p>
          <div class="flex justify-between items-center">
            <div class="price text-dragon font-medium">
              {{ nft.price.listed }}
            </div>
            <div class="power flex items-center">
              <span class="text-sm mr-1">Power:</span>
              <span class="text-accent font-bold">{{ nft.traits.power }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="filteredNfts.length === 0" class="empty-state text-center py-12">
      <p class="text-xl">No items match your current filters</p>
      <button @click="resetFilters" class="mt-4 px-4 py-2 bg-accent text-white rounded-md">
        Reset Filters
      </button>
    </div>
    
    <!-- NFT Detail Modal -->
    <div v-if="selectedNft" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-primary max-w-2xl w-full rounded-xl overflow-hidden relative">
        <button 
          @click="selectedNft = null"
          class="absolute top-4 right-4 bg-black/50 hover:bg-accent p-2 rounded-full"
        >
          ✕
        </button>
        
        <div class="grid md:grid-cols-2">
          <div class="nft-modal-image">
            <img 
              :src="selectedNft.image.full || selectedNft.image.preview" 
              :alt="selectedNft.name"
              class="w-full h-full object-contain" 
            />
          </div>
          
          <div class="nft-modal-info p-6">
            <h2 class="text-2xl font-bold mb-1">{{ selectedNft.name }}</h2>
            <p class="text-sm text-dragon mb-4">{{ selectedNft.collection }}</p>
            
            <p class="mb-4">{{ selectedNft.description }}</p>
            
            <div class="traits-grid grid grid-cols-2 gap-3 mb-4">
              <div class="trait p-2 bg-primary/30 rounded-md">
                <span class="block text-xs opacity-70">Rarity</span>
                <span class="font-medium">{{ selectedNft.traits.rarity }}</span>
              </div>
              <div class="trait p-2 bg-primary/30 rounded-md">
                <span class="block text-xs opacity-70">Element</span>
                <span class="font-medium">{{ selectedNft.traits.element }}</span>
              </div>
              <div class="trait p-2 bg-primary/30 rounded-md">
                <span class="block text-xs opacity-70">Power</span>
                <span class="font-medium">{{ selectedNft.traits.power }}</span>
              </div>
              <div class="trait p-2 bg-primary/30 rounded-md">
                <span class="block text-xs opacity-70">Chakra</span>
                <span class="font-medium">{{ selectedNft.spiritual.chakra }}</span>
              </div>
            </div>
            
            <div class="pricing border-t border-primary/30 pt-4 mt-4">
              <div class="flex justify-between mb-2">
                <span>Listed Price:</span>
                <span class="text-dragon font-bold">{{ selectedNft.price.listed }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Floor Price:</span>
                <span>{{ selectedNft.price.floor }}</span>
              </div>
              <div class="flex justify-between mb-4">
                <span>Last Sale:</span>
                <span>{{ selectedNft.price.last_sale }}</span>
              </div>
              
              <button class="w-full py-3 bg-accent text-white rounded-lg font-bold">
                Mint Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NftGrid',
  data() {
    return {
      collections: {},
      nfts: [],
      selectedCollection: null,
      selectedElements: [],
      selectedRarities: [],
      elements: ["Fire", "Water", "Earth", "Air", "Light", "Dark", "Cosmic", "Nature", "Mechanical"],
      rarityLevels: ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"],
      selectedNft: null,
      loading: true,
      error: null
    }
  },
  computed: {
    filteredNfts() {
      let filtered = this.nfts;
      
      // Filter by collection
      if (this.selectedCollection) {
        filtered = filtered.filter(nft => nft.collection === this.collections[this.selectedCollection].name);
      }
      
      // Filter by element
      if (this.selectedElements.length > 0) {
        filtered = filtered.filter(nft => this.selectedElements.includes(nft.traits.element));
      }
      
      // Filter by rarity
      if (this.selectedRarities.length > 0) {
        filtered = filtered.filter(nft => this.selectedRarities.includes(nft.traits.rarity));
      }
      
      return filtered;
    }
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        
        // Load master index
        const indexResponse = await fetch('/meta/index.json');
        const indexData = await indexResponse.json();
        
        this.collections = indexData.collections;
        let allNfts = [];
        
        // Load each collection's data
        for (const [id, collection] of Object.entries(this.collections)) {
          const collectionResponse = await fetch(`/data/collections/${id}.json`);
          const collectionData = await collectionResponse.json();
          allNfts = [...allNfts, ...collectionData];
        }
        
        this.nfts = allNfts;
      } catch (err) {
        console.error('Error loading NFT data:', err);
        this.error = 'Failed to load NFT data. Please try again later.';
        
        // Fall back to using mock data if files don't exist yet
        this.useMockData();
      } finally {
        this.loading = false;
      }
    },
    
    useMockData() {
      // Generate mock collections and NFTs if real data fails to load
      const mockCollections = {
        'dragons': { name: 'Wild Dragons', item_count: 12 },
        'cosmic': { name: 'Cosmic Creatures', item_count: 8 },
        'elements': { name: 'Elemental Beings', item_count: 10 }
      };
      
      const mockNfts = [];
      
      // Generate mock NFTs
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
              thumbnail: `/icons/icon-192.png`, // Use existing icon as placeholder
              preview: `/icons/icon-512.png`,
              full: `/icons/icon-512.png`
            },
            traits: {
              rarity: rarity,
              element: element,
              power: Math.floor(Math.random() * 80) + 20
            },
            spiritual: {
              chakra: "heart",
              frequency_hz: 639,
              color: "green",
              level_unlock: 4
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
    },
    
    toggleElement(element) {
      if (this.selectedElements.includes(element)) {
        this.selectedElements = this.selectedElements.filter(e => e !== element);
      } else {
        this.selectedElements.push(element);
      }
    },
    
    toggleRarity(rarity) {
      if (this.selectedRarities.includes(rarity)) {
        this.selectedRarities = this.selectedRarities.filter(r => r !== rarity);
      } else {
        this.selectedRarities.push(rarity);
      }
    },
    
    resetFilters() {
      this.selectedCollection = null;
      this.selectedElements = [];
      this.selectedRarities = [];
    },
    
    selectNft(nft) {
      this.selectedNft = nft;
    }
  },
  mounted() {
    this.loadData();
  }
}
</script>

<style scoped>
.collections-slider::-webkit-scrollbar {
  height: 4px;
}
.collections-slider::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
.collections-slider::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}
.collections-slider::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.nft-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.nft-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}
</style>
