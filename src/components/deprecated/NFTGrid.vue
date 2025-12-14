<template>
  <div class="nft-grid cosmic-bg neon-border flex w-full flex-wrap">
    <NFTCard
      v-for="nft in nfts"
      :key="nft.id"
      :nft="nft"
      :showBuy="true"
      :showList="true"
      :showTransfer="true"
      :showMint="true"
      :showView="true"
      @buy="$emit('buy', nft)"
      @list="$emit('list', nft)"
      @transfer="$emit('transfer', nft)"
      @mint="$emit('mint', nft)"
      @view="$emit('view', nft)"
    />
    <!-- Toast notifications slot -->
    <slot name="toast"></slot>
    <!-- Modals slot -->
    <slot name="modals"></slot>
  </div>
</template>
<script setup>
import NFTCard from './NFTCard.vue'
defineProps({
  nfts: Array
})
</script>

