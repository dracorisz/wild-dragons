<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
      <h3 class="text-xl font-bold mb-4">NFT Details</h3>
      <img :src="nft.image" class="w-40 h-40 object-cover rounded mb-2 mx-auto" />
      <div class="font-bold text-lg mb-1">{{ nft.name }}</div>
      <div class="text-sm text-gray-600 mb-2">{{ nft.description }}</div>
      <div class="mb-2"><span class="font-semibold">Chain:</span> {{ chainLabel(nft.chain) }}</div>
      <div class="mb-2"><span class="font-semibold">Royalty:</span> {{ nft.royalty }}%</div>
      <div class="mb-2"><span class="font-semibold">Owner:</span> {{ nft.owner_id }}</div>
      <div class="mb-2" v-if="nft.price"><span class="font-semibold">Price:</span> {{ nft.price }} ETH</div>
      <button class="w-full py-2 px-4 rounded bg-gray-300 text-black font-semibold mt-2" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ nft: Object })
function chainLabel(val) {
  if (val === 'eth') return 'Ethereum Testnet'
  if (val === 'immutable') return 'Immutable Testnet'
  if (val === 'ronin') return 'Ronin Testnet'
  return val
}
</script>
