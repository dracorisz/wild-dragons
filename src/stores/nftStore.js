import { defineStore } from 'pinia';

export const useNftStore = defineStore('nft', {
  state: () => ({
    collections: {},
    nfts: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getCollectionById: (state) => (id) => {
      return state.collections[id] || null;
    },
    getNftById: (state) => (id) => {
      return state.nfts.find(nft => nft.id === id) || null;
    },
    getNftsByCollection: (state) => (collectionId) => {
      const collection = state.collections[collectionId];
      if (!collection) return [];
      
      return state.nfts.filter(nft => nft.collection === collection.name);
    }
  },
  
  actions: {
    async fetchAllData() {
      this.loading = true;
      this.error = null;
      
      try {
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
        console.error('Error loading NFT data:', error);
        this.error = 'Failed to load NFT data';
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
      
      // Will be populated with mock NFT data if needed
      this.nfts = [];
    }
  }
});
