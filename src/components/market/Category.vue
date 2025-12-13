<template>
  <div class="page">
    <div class="w-full mx-auto px-10">
      <router-link to="/market" class="mb-4 inline-block text-sm text-[#bbb]">← Back to Market</router-link>
      <div v-if="collection" class="mb-8">
        <div class="relative h-44 overflow-hidden">
          <img :src="collection.image" class="w-full h-full object-cover filter brightness-75" />
          <div class="absolute left-6 bottom-4 text-left text-white flex flex-col">
             <h2 class="!mb-0 -ml-px">{{ collection.title }}</h2>
              <p class="text-[#ddd]">{{ collection.desc }}</p>
            
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h2 class="text-xl mb-4">Items in {{ collection ? collection.title : 'collection' }}</h2>
        <ItemsGrid :items="collectionItems" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import collections from '../../../data/collections.json';
import items from '../../../data/items.json';
import ItemsGrid from '../../components/market/ItemsGrid.vue';

const route = useRoute();
const slug = route.params.slug;

const collection = computed(() => collections.find(c => c.slug === slug) || null);
const collectionItems = computed(() => items.filter(i => i.collection_slug === slug));

</script>
