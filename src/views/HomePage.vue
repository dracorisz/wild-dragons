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
      <UnifiedNFTDisplay />
    </main>
    
    <footer class="bg-primary/30 py-6 mt-12 text-center"> 
      <p>© {{ new Date().getFullYear() }} Heroine's Dragon. All rights reserved.</p> 
    </footer> 
  </div> 
</template> 
 
<script> 

import UnifiedNFTDisplay from '../components/nft/UnifiedNFTDisplay.vue'
 
export default { 
  name: 'HomePage', 
  data() { 
    return { 
      collections: {}, 
      loading: true 
    } 
  }, 
  components: {
    UnifiedNFTDisplay
  } ,
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

<style scoped>
/* Fix contrast issues - ensure white text on dark background */
.cosmic-bg {
  color: white; /* Ensure all text is white */
}

.cosmic-bg p {
  color: white; /* White text for paragraphs */
  opacity: 0.9; /* Slightly transparent for better readability */
}

.cosmic-bg header p {
  color: white; /* Ensure header paragraph is white */
  opacity: 0.85; /* Match original opacity but with white color */
}

footer {
  color: white; /* White text for footer */
  opacity: 0.8; /* Subtle transparency */
}

/* Section title with gradient */
.section-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(90deg, #00fff7, #ff00cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Navigation link styling for better UX */
.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(0, 255, 255, 0.2);
  color: #00fff7;
}
</style>
