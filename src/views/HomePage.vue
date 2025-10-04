<template> 
  <div class="cosmic-bg"> 
    <header class="py-12 text-center"> 
      <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-dragon to-accent bg-clip-text text-transparent">Heroine's Dragon</h1> 
      <p class="max-w-2xl mx-auto text-lg px-4"> 
        Explore the World of Tiamat, where legends awaken, dragons soar, and every heroine shapes the fate of realms untold. 
      </p> 
    </header> 
    
    <main class="container mx-auto py-8 px-4"> 
      <h2 class="section-title">NFT Marketplace</h2> 
      <NFTMarketplace /> 
    </main> 
    
    <footer class="bg-primary/30 py-6 mt-12 text-center"> 
      <p>© {{ new Date().getFullYear() }} Heroine's Dragon. All rights reserved.</p> 
    </footer> 
  </div> 
</template> 
 
<script> 
import NFTMarketplace from '../components/NFTMarketplace.vue' 
 
export default { 
  name: 'HomePage', 
  components: { 
    NFTMarketplace 
  } 
} 
</script>
    <footer class="bg-primary/30 py-6 mt-12 text-center"> 
      <p>© {{ new Date().getFullYear() }} Heroine's Dragon. All rights reserved.</p> 
    </footer> 
  </div> 
</template> 
 
<script> 
export default { 
  name: 'HomePage', 
  data() { 
    return { 
      collections: {}, 
      loading: true 
    } 
  }, 
  mounted() { 
    this.fetchCollections() 
  }, 
  methods: { 
    async fetchCollections() { 
      try { 
        const response = await fetch('/meta/index.json') 
        if (response.ok) { 
          const data = await response.json() 
          this.collections = data.collections 
        } else { 
          console.error('Failed to fetch collections') 
          this.useDefaultCollections() 
        } 
      } catch (error) { 
        console.error('Error fetching collections:', error) 
        this.useDefaultCollections() 
      } finally { 
        this.loading = false 
      } 
    }, 
    useDefaultCollections() { 
      this.collections = { 
        'dragons': { name: 'Wild Dragons', item_count: 10 }, 
        'cosmic': { name: 'Cosmic Entities', item_count: 10 }, 
        'elemental': { name: 'Elemental Guardians', item_count: 10 }, 
        'fantasy': { name: 'Fantasy Heroes', item_count: 10 }, 
        'mythical': { name: 'Mythical Creatures', item_count: 10 } 
      } 
    } 
  } 
} 
</script>
