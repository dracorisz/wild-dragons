<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
      <h3 class="text-xl font-bold mb-4">Transfer NFT</h3>
      <div class="mb-4">NFT: <span class="font-semibold">{{ nft.name }}</span></div>
      <input v-model="transferAddress" type="text" placeholder="Recipient Address" class="w-full px-4 py-2 border rounded mb-4" />
      <button class="w-full py-2 px-4 rounded bg-violet-600 text-white font-semibold" @click="transferNFTToAddress">Transfer</button>
      <button class="w-full py-2 px-4 rounded bg-gray-300 text-black font-semibold mt-2" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { transferNFT } from '../../web3/nft'
const props = defineProps({ nft: Object })
const emit = defineEmits(['success', 'close'])
const transferAddress = ref('')
async function transferNFTToAddress() {
  await transferNFT(props.nft, transferAddress.value)
  emit('success', 'NFT transferred!')
}
</script>
