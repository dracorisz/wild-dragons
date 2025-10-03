<template>
  <div class="cosmic-bg min-h-screen flex flex-col items-center justify-center px-10 py-10">
    <h1 class="text-4xl font-bold text-white mb-6">Wild Dragons Marketplace</h1>
    <div class="nft-slider mb-8 overflow-x-scroll">
      <div v-for="img in cc0Images" :key="img.src" class="nft-slider-item flex flex-col items-center justify-center p-6 gap-2" style="min-width:320px;max-width:320px;">
        <div class="w-full rounded-lg overflow-hidden mb-2" style="height:120px;position:relative;background: url(''+img.src+'') center center / cover no-repeat;">
          <div style="position:absolute;left:0;right:0;bottom:0;height:100%;background:linear-gradient(0deg,#000 80%,rgba(0,0,0,0.01) 100%);pointer-events:none;"></div>
        </div>
        <span class="text-white font-semibold text-lg">{{ img.title }}</span>
        <span class="text-xs text-gray-400">{{ img.credit }}</span>
      </div>
    </div>
    <p class="text-lg text-gray-300">Mint, buy, and trade cosmic NFTs. Powered by Supabase, Vite, and Vue. Explore legendary dragons and heroes in a cosmic, DAO-powered marketplace.</p>
    <div class="bg-black/60 rounded-lg p-4 mb-4 flex flex-wrap gap-4 mt-8">
      <div v-for="res in resources.slice(0,8)" :key="res.id" class="flex flex-col items-center justify-center w-24 h-24 bg-[#181828] border border-[#00fff7] rounded-lg p-2">
        <span class="font-bold text-[#00fff7] text-xs mb-1">{{ res.name }}</span>
        <span class="text-xs text-gray-400">{{ res.type }}</span>
      </div>
      <div class="flex items-center justify-center w-24 h-24">
        <a href="/resources.json" target="_blank" class="nft-market-link text-xs">All Resources</a>
      </div>
    </div>
  </div>
</template>
<script setup>
const cc0Images = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    title: "Cosmic Landscape",
    credit: "Photo by Johannes Plenio (Unsplash, CC0)"
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    title: "Fantasy Mountain",
    credit: "Photo by Samuel Ferrara (Unsplash, CC0)"
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    title: "Dragon Sky",
    credit: "Photo by Casey Horner (Unsplash, CC0)"
  }
];
const resources = [
  { id: 1, name: "Hydrogen", type: "Element" },
  { id: 2, name: "Helium", type: "Element" },
  { id: 3, name: "Lithium", type: "Element" },
  { id: 4, name: "Gold", type: "Element" },
  { id: 5, name: "Water", type: "Compound" },
  { id: 6, name: "Dark Matter", type: "Cosmic" },
  { id: 7, name: "Dragon Scale", type: "Fantasy" },
  { id: 8, name: "Stardust", type: "Cosmic" }
  // ...full list in resources.json
];
</script>
