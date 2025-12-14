<template>
  <div class="cosmic-bg min-h-screen flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold mb-6 bg-gradient-to-r from-dragon to-accent bg-clip-text text-transparent">
      {{ title }}
    </h1>
    <p class="text-lg max-w-md text-center mb-8">
      {{ message }}
    </p>
    
    <div class="neon-border p-8 rounded-xl mb-8">
      <div class="spinner mx-auto"></div>
    </div>
    
    <router-link to="/" class="nft-btn">
      Return Home
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'PlaceholderView',
  props: {
    title: {
      type: String,
      default: "Coming Soon"
    },
    message: {
      type: String,
      default: "This page is under construction. Check back soon for updates."
    }
  }
}
</script>
