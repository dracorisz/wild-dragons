<template>
  <div class="marketplace-page py-8 px-4">
    <div class="container mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-dragon to-accent bg-clip-text text-transparent">
        NFT Marketplace
      </h1>
      
      <p class="text-center max-w-2xl mx-auto mb-10">
        Explore the Wild Dragons NFT marketplace, where fantasy meets blockchain. 
        Discover rare dragon artifacts, cosmic entities and legendary creatures.
      </p>
      
      <NftGrid />
    </div>
  </div>
</template>

<script>
import NftGrid from '../components/NftGrid.vue'

export default {
  name: 'MarketplacePage',
  components: {
    NftGrid
  }
}
</script>
