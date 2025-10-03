<template>
  <form class="flex flex-col gap-4" @submit.prevent="mintNFT">
    <input v-model="name" type="text" placeholder="NFT Name" class="px-4 py-2 border rounded" required />
    <textarea v-model="description" placeholder="Description" class="px-4 py-2 border rounded"></textarea>
    <input v-model="royalty" type="number" min="0" max="20" placeholder="Royalty (%)" class="px-4 py-2 border rounded" />
    <input type="file" accept="image/*" @change="onImageChange" class="px-4 py-2 border rounded" required />
    <div>
      <label class="block text-sm font-medium mb-1">Mint Chain</label>
      <select v-model="chain" class="w-full px-4 py-2 border rounded">
        <option value="eth">Ethereum Testnet (Goerli)</option>
        <option value="immutable">Immutable Testnet</option>
        <option value="ronin">Ronin Testnet</option>
      </select>
      <div v-if="chain === 'eth'" class="text-xs mt-2">
        <a href="https://goerlifaucet.com/" target="_blank" class="text-violet-600 underline">Get Goerli ETH (faucet)</a>
      </div>
      <div v-if="chain === 'immutable'" class="text-xs mt-2">
        <a href="https://faucet.testnet.immutable.com/" target="_blank" class="text-violet-600 underline">Get IMX Testnet tokens</a>
      </div>
      <div v-if="chain === 'ronin'" class="text-xs mt-2">
        <a href="https://faucet.roninchain.com/" target="_blank" class="text-violet-600 underline">Get Ronin Testnet tokens</a>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Mint Type</label>
      <select v-model="mintType" class="w-full px-4 py-2 border rounded">
        <option value="free">Free Mint</option>
        <option value="paid">Simulated Paid Mint</option>
      </select>
    </div>
    <button type="submit" class="py-2 px-4 rounded bg-violet-600 text-white font-semibold">Mint NFT</button>
    <Toast v-if="toast.show" :type="toast.type" :message="toast.message" @close="toast.show = false" />
  </form>
</template>
<script setup>
import { ref } from 'vue'
import { supabase } from '../../main'
import { useUserStore } from '../../stores/user'
import Toast from '../../components/Toast.vue'

const name = ref('')
const description = ref('')
const royalty = ref(5)
const imageFile = ref(null)
const chain = ref('eth')
const mintType = ref('free')
const toast = ref({ show: false, type: 'success', message: '' })
const emit = defineEmits(['minted'])
const userStore = useUserStore()

function onImageChange(e) {
  imageFile.value = e.target.files[0]
}

async function mintNFT() {
  if (!imageFile.value) {
    toast.value = { show: true, type: 'error', message: 'Image required' }
    return
  }
  const user = userStore.user
  if (!user) {
    toast.value = { show: true, type: 'error', message: 'Connect wallet first' }
    return
  }
  // Simulate paid mint
  if (mintType.value === 'paid') {
    toast.value = { show: true, type: 'success', message: `Simulated paid mint on ${chainLabel(chain.value)}` }
    // Simulate delay
    await new Promise(res => setTimeout(res, 1200))
  }
  // Upload image to Supabase storage
  const fileExt = imageFile.value.name.split('.').pop()
  const fileName = `nft-${Date.now()}.${fileExt}`
  const filePath = `nfts/${fileName}`
  const { error: uploadError } = await supabase.storage.from('nfts').upload(filePath, imageFile.value, { upsert: true })
  if (uploadError) {
    toast.value = { show: true, type: 'error', message: 'Image upload failed' }
    return
  }
  const { data: urlData } = supabase.storage.from('nfts').getPublicUrl(filePath)
  const imageUrl = urlData.publicUrl
  // Save metadata to Supabase DB
  const { error: dbError } = await supabase.from('nfts').insert({
    owner_id: user.id,
    name: name.value,
    description: description.value,
    image_url: imageUrl,
    royalty: royalty.value,
    attributes: { chain: chain.value, mintType: mintType.value },
    price: null,
    contract_address: null,
    token_id: null
  })
  if (dbError) {
    toast.value = { show: true, type: 'error', message: 'Mint failed' }
    return
  }
  toast.value = { show: true, type: 'success', message: `NFT minted on ${chainLabel(chain.value)}!` }
  emit('minted', `NFT minted successfully on ${chainLabel(chain.value)}!`)
}

function chainLabel(val) {
  if (val === 'eth') return 'Ethereum Testnet'
  if (val === 'immutable') return 'Immutable Testnet'
  if (val === 'ronin') return 'Ronin Testnet'
  return val
}
</script>
