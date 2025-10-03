<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
      <h3 class="text-xl font-bold mb-4">Buy NFT</h3>
      <img :src="nft.image" class="w-40 h-40 object-cover rounded mb-2 mx-auto" />
      <div class="font-bold text-lg mb-1">{{ nft.name }}</div>
      <div class="text-sm text-gray-600 mb-2">{{ nft.description }}</div>
      <div class="text-violet-600 font-semibold mb-4">Price: {{ nft.price }} ETH</div>
      <button class="w-full py-2 px-4 rounded bg-violet-600 text-white font-semibold" @click="handleBuyNFT">Confirm Purchase</button>
      <button class="w-full py-2 px-4 rounded bg-gray-300 text-black font-semibold mt-2" @click="$emit('close')">Cancel</button>
      <Toast v-if="toast.show" :type="toast.type" :message="toast.message" @close="toast.show = false" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { buyNFT as buyNFTAction } from '../../web3/nft'
import { useUserStore } from '../../stores/user'
import { supabase } from '../../main'
import Toast from '../../components/Toast.vue'

const props = defineProps({ nft: Object })
const toast = ref({ show: false, type: 'success', message: '' })
const userStore = useUserStore()

async function handleBuyNFT() {
  await buyNFTAction(props.nft)
  // Update owner in Supabase
  const user = userStore.user
  if (user) {
    await supabase.from('nfts').update({ owner_id: user.id, price: null }).eq('id', props.nft.id)
    toast.value = { show: true, type: 'success', message: 'NFT purchased successfully!' }
    setTimeout(() => { $emit('success', 'NFT purchased successfully!') }, 1000)
  } else {
    toast.value = { show: true, type: 'error', message: 'Connect wallet first' }
  }
}
</script>
