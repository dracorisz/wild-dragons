<template>
  <div class="grid gap-8 grid-cols-5">
    <div v-for="item in items" :key="item.id" class="flex flex-col overflow-hidden bg-[#23272a]">
      <img :src="item.image" class="h-80 w-full object-cover" />
      <div class="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <h3 class="mb-1 text-lg text-white">{{ item.title }}</h3>
          <p class="mb-3 text-sm text-[#bbb]">{{ item.desc }}</p>
        </div>
        <div class="mt-3 flex flex-col items-center justify-between">
          <div class="flex w-full flex-col">
            <div class="flex gap-3">
              <div v-for="opt in item.paymentOptions" :key="opt.currency" class="flex items-center gap-2 bg-[#151618] px-3 py-2">
                <img :src="opt.icon" alt="" class="h-5 w-5 object-contain" />
                <div class="text-sm">
                  <div class="font-semibold text-white">{{ opt.price }}</div>
                  <div class="text-xs text-[#bbb]">{{ opt.currency }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 flex w-full gap-2">
            <button class="bg-[#f9d423] px-4 py-2 font-semibold text-[#23272a]">Buy</button>
            <button @click="$router.push(`/market/item/${item.id}`)">Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  items: Array
});
</script>
