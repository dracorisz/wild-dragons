<template>
  <div class="placeholder-page min-h-screen flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold mb-6 bg-gradient-to-r from-dragon to-accent bg-clip-text text-transparent">
      {{ title }}
    </h1>
    <p class="text-lg max-w-md text-center mb-8">
      {{ message || "This page is under construction." }}
    </p>
    <div class="w-24 h-24 border-4 border-accent rounded-full border-t-transparent animate-spin mb-8"></div>
    <router-link to="/" class="px-6 py-3 bg-accent text-white rounded-lg font-bold">
      Return Home
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'PlaceholderPage',
  props: {
    title: {
      type: String,
      default: "Coming Soon"
    },
    message: {
      type: String,
      default: ""
    }
  }
}
</script>
