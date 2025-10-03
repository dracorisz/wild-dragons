<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
      <h3 class="text-xl font-bold mb-4">List NFT for Sale</h3>
      <div class="mb-4">NFT: <span class="font-semibold">{{ nft.name }}</span></div>
      <input v-model="listPrice" type="number" min="0" step="0.01" placeholder="Price (ETH)" class="w-full px-4 py-2 border rounded mb-4" />
      <button class="w-full py-2 px-4 rounded bg-violet-600 text-white font-semibold" @click="listNFTForSale">List</button>
      <button class="w-full py-2 px-4 rounded bg-gray-300 text-black font-semibold mt-2" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { listNFT } from '../../web3/nft'
const props = defineProps({ nft: Object })
const emit = defineEmits(['success', 'close'])
const listPrice = ref('')
async function listNFTForSale() {
  await listNFT(props.nft, listPrice.value)
  emit('success', 'NFT listed for sale!')
}
</script>
