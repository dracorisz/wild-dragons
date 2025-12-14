<template>
  <div class="nft-card flex flex-col items-center justify-between min-h-[525px] h-[525px]">
    <div class="w-full flex flex-col items-center pb-5">
      <div
        class="relative flex justify-center items-center w-full rounded-lg overflow-hidden mb-2 bg-cover bg-center saturate-200 hue-rotate-60"
        :style="{ height: '138px', minHeight: '138px', maxHeight: '138px', backgroundImage: `url(${nft.image || '/src/assets/chains/polygon-matic-logo.svg'})` }"
      >
        <div
          class="pointer-events-none absolute inset-0 h-full"
          style="background-image: linear-gradient(0deg, #000 15%, rgba(0,0,0,0.01) 100%)"
        ></div>
        <span class="absolute bottom-2 inset-x-0 text-xs text-gray text-center bg-black/30 px-2 py-1">Image Placeholder</span>
      </div>
      <div class="nft-details w-full mt-4 flex flex-col items-center">
        <div class="nft-name flex items-center mb-1 mt-3">
          <img src="/src/assets/chains/polygon-matic-logo.svg" class="nft-icon" />
          <span class="ml-2 font-semibold text-base text-white">{{ nft.name || 'NFT Name' }}</span>
        </div>
        <div class="nft-desc text-xs text-gray-400 mb-2 text-center whitespace-pre-line">
          {{ nft.description || 'Minimal cosmic collectible. Add your description here.' }}
        </div>
        <div class="nft-meta flex flex-col gap-1 text-xs text-gray-500 items-center">
          <span>Chain: Polygon</span>
          <span>Price: {{ nft.price || '--' }}</span>
          <span>Royalty: {{ nft.royalty || '--' }}</span>
          <span>Owner: {{ nft.owner || '---' }}</span>
        </div>
      </div>
    </div>
    <div class="nft-actions mt-4 flex flex-row gap-2 justify-center">
      <button v-if="showBuy" class="nft-btn" @click="$emit('buy', nft)">Buy</button>
      <button v-if="showMint" class="nft-btn" @click="$emit('mint', nft)">Mint</button>
      <button v-if="showList" class="nft-btn" @click="$emit('list', nft)">List</button>
      <button v-if="showTransfer" class="nft-btn" @click="$emit('transfer', nft)">Transfer</button>
      <button v-if="showView" class="nft-btn" @click="$emit('view', nft)">View</button>
    </div>
    <a
      :href="`https://tokentrove.com/search?q=${encodeURIComponent(nft.name)}`"
      target="_blank"
      class="nft-market-link mt-2 text-xs"
    >Browse on TokenTrove</a>
  </div>
</template>
<script setup>
defineProps({
  nft: Object,
  showBuy: Boolean,
  showMint: Boolean,
  showList: Boolean,
  showTransfer: Boolean,
  showView: Boolean
})
</script>
