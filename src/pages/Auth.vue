<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <div v-if="isConfirming" class="text-center">
      <Typography tag="h2" variant="title" size="2xl" class="mb-4">
        Confirming your account...
      </Typography>
      <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
    </div>
    <AuthModal 
      v-else
      :visible="true"
      @close="handleClose"
      @update:visible="handleClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../lib/supabase.js'
import AuthModal from '../components/AuthModal.vue'
import { Typography } from '../components/ui'

const router = useRouter()
const route = useRoute()
const isConfirming = ref(false)

onMounted(async () => {
  // Check if this is an email confirmation callback
  if (route.query.confirmed === 'true' || route.hash) {
    isConfirming.value = true
    
    try {
      // Supabase automatically handles the token from the URL hash
      // We just need to get the current session after the redirect
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Email confirmation error:', error)
        isConfirming.value = false
        return
      }
      
      if (data.session) {
        // User is now authenticated, redirect to play page
        console.log('Email confirmed successfully, redirecting to play')
        router.push('/play')
      } else {
        // Check if URL contains auth tokens that need processing
        if (route.hash.includes('access_token') || route.hash.includes('type=signup')) {
          // Give supabase a moment to process the auth callback
          setTimeout(async () => {
            const { data: sessionData } = await supabase.auth.getSession()
            if (sessionData.session) {
              router.push('/play')
            } else {
              isConfirming.value = false
            }
          }, 1000)
        } else {
          // No auth tokens, confirmation failed or still pending
          isConfirming.value = false
        }
      }
    } catch (err) {
      console.error('Confirmation process error:', err)
      isConfirming.value = false
    }
  }
})

const handleClose = () => {
  // When used as a route, closing should navigate back to home
  router.push('/')
}
</script>