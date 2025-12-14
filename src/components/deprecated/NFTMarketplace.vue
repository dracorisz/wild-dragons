<template>
  <div class="nft-marketplace p-4">
    <!-- Collection Filter -->
    <div class="collection-filters mb-8 overflow-x-auto">
      <h2 class="text-2xl font-bold mb-4 text-dragon">Collections</h2>
      <div class="nft-slider relative mb-4">
        <button
          v-for="(collection, id) in collections"
          :key="id"
          @click="selectedCollection = id === selectedCollection ? null : id"
          :class="[
            'nft-btn mx-2 whitespace-nowrap',
            selectedCollection === id ? 'bg-nft-border text-primary' : ''
          ]"
        >
          {{ collection.name }} ({{ collection.item_count }})
        </button>
      </div>
    </div>

    <!-- Element and Rarity Filters -->
    <div class="filters-section mb-8 flex flex-wrap gap-6">
      <!-- Element Filter -->
      <div class="element-filter">
        <h3 class="text-xl font-bold mb-2 text-sky">Elements</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="element in elements"
            :key="element"
            @click="toggleElement(element)"
            :class="[
              'px-3 py-1 rounded-md text-sm transition-all',
              selectedElements.includes(element)
                ? 'bg-accent/80 text-white'
                : 'bg-primary/20 hover:bg-primary/40 text-white'
            ]"
          >
            {{ element }}
          </button>
        </div>
      </div>
      
      <!-- Rarity Filter -->
      <div class="rarity-filter">
        <h3 class="text-xl font-bold mb-2 text-dragon">Rarity</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="rarity in rarityLevels"
            :key="rarity"
            @click="toggleRarity(rarity)"
            :class="[
              'px-3 py-1 rounded-md text-sm transition-all',
              selectedRarities.includes(rarity)
                ? 'bg-accent/80 text-white'
                : 'bg-primary/20 hover:bg-primary/40 text-white'
            ]"
          >
            {{ rarity }}
          </button>
        </div>
      </div>
    </div>

    <!-- NFT Grid -->
    <div v-if="!loading" class="marketplace-grid">
      <div
        v-for="nft in filteredNFTs"
        :key="nft.id"
        class="nft-card"
        @click="selectedNFT = nft"
      >
        <!-- NFT Image -->
        <div class="nft-image">
          <img 
            :src="nft.image.preview" 
            :alt="nft.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
            {{ nft.traits.rarity }}
          </div>
          <div class="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
            {{ nft.traits.element }}
          </div>
        </div>
        
        <!-- NFT Info -->
        <div class="nft-info">
          <h3 class="nft-name text-lg font-bold mb-1">{{ nft.name }}</h3>
          <p class="nft-desc">{{ truncateText(nft.description, 80) }}</p>
          <div class="flex justify-between items-center mt-4">
            <div class="price text-dragon font-medium">{{ nft.price.listed }}</div>
            <div class="power flex items-center">
              <span class="text-sm mr-1">Power:</span>
              <span class="text-accent font-bold">{{ nft.traits.power }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-else class="flex flex-col items-center justify-center py-12">
      <div class="spinner"></div>
      <p class="mt-4 text-lg">Loading NFTs...</p>
    </div>
    
    <!-- Empty State -->
    <div v-if="!loading && filteredNFTs.length === 0" class="text-center py-12">
      <p class="text-xl">No items match your current filters</p>
      <button @click="resetFilters" class="mt-4 px-4 py-2 bg-accent text-white rounded-md">
        Reset Filters
      </button>
    </div>

    <!-- NFT Details Modal -->
    <div v-if="selectedNFT" class="modal-container" @click.self="selectedNFT = null">
      <div class="nft-modal-content max-w-4xl w-full">
        <!-- Close Button -->
        <button 
          @click="selectedNFT = null" 
          class="absolute top-4 right-4 z-10 bg-black/50 hover:bg-accent p-2 rounded-full text-white"
        >
          ✕
        </button>
        
        <div class="grid md:grid-cols-2 gap-6">
          <!-- NFT Image -->
          <div class="bg-black aspect-square rounded-lg overflow-hidden">
            <img 
              :src="selectedNFT.image.full || selectedNFT.image.preview" 
              :alt="selectedNFT.name" 
              class="w-full h-full object-contain"
            />
          </div>
          
          <!-- NFT Details -->
          <div>
            <h2 class="text-2xl font-bold nft-name">{{ selectedNFT.name }}</h2>
            <p class="text-sm text-dragon mb-4">{{ selectedNFT.collection }}</p>
            
            <div class="my-4">
              <p>{{ selectedNFT.description }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 my-4">
              <div class="bg-primary/40 p-3 rounded-lg">
                <span class="block text-xs opacity-60">Rarity</span>
                <span class="font-semibold">{{ selectedNFT.traits.rarity }}</span>
              </div>
              <div class="bg-primary/40 p-3 rounded-lg">
                <span class="block text-xs opacity-60">Element</span>
                <span class="font-semibold">{{ selectedNFT.traits.element }}</span>
              </div>
              <div class="bg-primary/40 p-3 rounded-lg">
                <span class="block text-xs opacity-60">Power</span>
                <span class="font-semibold">{{ selectedNFT.traits.power }}</span>
              </div>
              <div class="bg-primary/40 p-3 rounded-lg">
                <span class="block text-xs opacity-60">Chakra</span>
                <span class="font-semibold">{{ selectedNFT.spiritual.chakra }}</span>
              </div>
            </div>
            
            <div class="border-t border-primary/30 pt-4 mt-4">
              <div class="flex justify-between mb-2">
                <span>Listed Price:</span>
                <span class="text-dragon font-bold">{{ selectedNFT.price.listed }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Floor Price:</span>
                <span>{{ selectedNFT.price.floor }}</span>
              </div>
              <div class="flex justify-between mb-4">
                <span>Last Sale:</span>
                <span>{{ selectedNFT.price.last_sale }}</span>
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
  name: 'NFTMarketplace',
  data() {
    return {
      loading: true,
      collections: {},
      nfts: [],
      selectedCollection: null,
      selectedRarities: [],
      selectedElements: [],
      selectedNFT: null,
      rarityLevels: ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"],
      elements: ["Fire", "Water", "Earth", "Air", "Light", "Dark", "Cosmic", "Nature", "Mechanical"]
    }
  },
  computed: {
    filteredNFTs() {
      let filtered = [...this.nfts];
      
      // Filter by collection
      if (this.selectedCollection) {
        filtered = filtered.filter(nft => 
          nft.collection === this.collections[this.selectedCollection].name
        );
      }
      
      // Filter by rarity
      if (this.selectedRarities.length > 0) {
        filtered = filtered.filter(nft => 
          this.selectedRarities.includes(nft.traits.rarity)
        );
      }
      
      // Filter by element
      if (this.selectedElements.length > 0) {
        filtered = filtered.filter(nft => 
          this.selectedElements.includes(nft.traits.element)
        );
      }
      
      return filtered;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        
        // Load master index
        const indexResponse = await fetch('/meta/index.json');
        if (!indexResponse.ok) throw new Error('Failed to fetch index');
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
        console.error('Error loading marketplace data:', error);
        this.loadMockData();
      } finally {
        this.loading = false;
      }
    },
    
    loadMockData() {
      this.collections = {
        'dragons': { name: 'Wild Dragons', item_count: 10 },
        'cosmic': { name: 'Cosmic Entities', item_count: 10 },
        'elemental': { name: 'Elemental Guardians', item_count: 10 },
        'fantasy': { name: 'Fantasy Heroes', item_count: 10 },
        'mythical': { name: 'Mythical Creatures', item_count: 10 }
      };
      
      // Generate mock NFTs
      this.nfts = [];
      for (const [id, collection] of Object.entries(this.collections)) {
        for (let i = 1; i <= collection.item_count; i++) {
          const rarity = this.rarityLevels[Math.floor(Math.random() * this.rarityLevels.length)];
          const element = this.elements[Math.floor(Math.random() * this.elements.length)];
          
          this.nfts.push({
            id: `${id}_${i}`,
            name: `${element} ${collection.name} #${i}`,
            collection: collection.name,
            description: `A powerful ${element.toLowerCase()} creature from another dimension.`,
            image: {
              thumbnail: `/assets/${id}/${id}_${i}_thumb.png`,
              preview: `/assets/${id}/${id}_${i}_preview.png`,
              full: `/assets/${id}/${id}_${i}.png`
            },
            traits: {
              rarity: rarity,
              element: element,
              power: Math.floor(Math.random() * 70) + 30
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
      this.selectedRarities = [];
      this.selectedElements = [];
    },
    
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
  }
}
</script>
