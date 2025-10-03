<template>
  <div class="max-w-xl mx-auto py-10">
    <h2 class="text-2xl font-bold mb-6 text-center">Mint New NFT</h2>
    <MintForm @minted="onMinted" />
    <Toast v-if="toast.show" :type="toast.type" :message="toast.message" @close="toast.show = false" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import MintForm from './MintForm.vue'
import Toast from '../../components/Toast.vue'
import { useRouter } from 'vue-router'

const toast = ref({ show: false, type: 'success', message: '' })
const router = useRouter()

function onMinted(msg) {
  toast.value = { show: true, type: 'success', message: msg }
  setTimeout(() => router.push('/marketplace'), 1500)
}
</script>
