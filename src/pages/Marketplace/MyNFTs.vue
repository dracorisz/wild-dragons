<template>
  <div class="max-w-5xl mx-auto py-10">
    <h2 class="text-2xl font-bold mb-6 text-center">My NFTs</h2>
    <NFTGrid :nfts="myNFTs" :showActions="true" @list="openListModal" @transfer="openTransferModal" />
    <div v-if="showListModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">List NFT for Sale</h3>
        <div class="mb-4">NFT: <span class="font-semibold">{{ selectedNFT.name }}</span></div>
        <input v-model="listPrice" type="number" min="0" step="0.01" placeholder="Price (ETH)" class="w-full px-4 py-2 border rounded mb-4" />
        <button class="w-full py-2 px-4 rounded bg-violet-600 text-white font-semibold" @click="listNFTForSale">List</button>
        <button class="w-full py-2 px-4 rounded bg-gray-300 text-black font-semibold mt-2" @click="showListModal = false">Cancel</button>
      </div>
    </div>
    <div v-if="showTransferModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Transfer NFT</h3>
        <div class="mb-4">NFT: <span class="font-semibold">{{ selectedNFT.name }}</span></div>
        <input v-model="transferAddress" type="text" placeholder="Recipient Address" class="w-full px-4 py-2 border rounded mb-4" />
        <button class="w-full py-2 px-4 rounded bg-violet-600 text-white font-semibold" @click="transferNFTToAddress">Transfer</button>
        <button class="w-full py-2 px-4 rounded bg-gray-300 text-black font-semibold mt-2" @click="showTransferModal = false">Cancel</button>
      </div>
    </div>
    <Toast v-if="toast.show" :type="toast.type" :message="toast.message" @close="toast.show = false" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import NFTGrid from './NFTGrid.vue'
import { fetchMyNFTs, listNFT, transferNFT } from '../../web3/nft'
import Toast from '../../components/Toast.vue'

const myNFTs = ref([])
const toast = ref({ show: false, type: 'success', message: '' })
const showListModal = ref(false)
const showTransferModal = ref(false)
const selectedNFT = ref(null)
const listPrice = ref('')
const transferAddress = ref('')

function openListModal(nft) {
  selectedNFT.value = nft
  listPrice.value = ''
  showListModal.value = true
}

function openTransferModal(nft) {
  selectedNFT.value = nft
  transferAddress.value = ''
  showTransferModal.value = true
}

async function listNFTForSale() {
  if (!listPrice.value || isNaN(listPrice.value)) {
    toast.value = { show: true, type: 'error', message: 'Enter a valid price' }
    return
  }
  await listNFT(selectedNFT.value, listPrice.value)
  toast.value = { show: true, type: 'success', message: 'NFT listed for sale!' }
  showListModal.value = false
  await loadMyNFTs()
}

async function transferNFTToAddress() {
  if (!transferAddress.value) {
    toast.value = { show: true, type: 'error', message: 'Enter recipient address' }
    return
  }
  await transferNFT(selectedNFT.value, transferAddress.value)
  toast.value = { show: true, type: 'success', message: 'NFT transferred!' }
  showTransferModal.value = false
  await loadMyNFTs()
}

async function loadMyNFTs() {
  myNFTs.value = await fetchMyNFTs()
}

onMounted(loadMyNFTs)
</script>
