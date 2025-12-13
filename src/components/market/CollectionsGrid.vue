<template>
  <div class="mb-8 grid gap-8 grid-cols-4">
    <router-link v-for="col in collections" :key="col.id" :to="`/market/category/${col.slug}`" class="overflow-hidden bg-[#23272a]">
      <img :src="col.image" class="mb-3 h-32 w-full object-cover" />
      <div class="text-center">
        <h3 class="mb-1 text-lg text-white">{{ col.title }}</h3>
        <p class="mb-3 text-sm text-[#bbb] px-5">{{ col.desc }}</p>
        <div class="flex w-full justify-center gap-2">
          <button class="bg-[#f9d423] px-4 py-2 font-semibold text-[#23272a]">View</button>
          <button class="bg-[#2b2f32] px-4 py-2 text-white">Favorite</button>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  collections: Array,
});

</script>
