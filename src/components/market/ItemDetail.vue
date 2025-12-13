<template>
  <div class="page">
    <div class="mx-auto w-full px-10">
      <router-link to="/market" class="mb-4 inline-block text-sm text-[#bbb]">← Back to Market</router-link>

      <div v-if="item" class="overflow-hidden bg-[#1f2224] ah-72">
        <div class="md:flex">
          <img :src="item.image" alt="" class="h-64 w-full object-cover md:w-1/3" />
          <div class="flex w-full flex-col flex-wrap p-6">
            <h1 class="mb-2 text-2xl font-bold">{{ item.title }}</h1>
            <p class="mb-4 text-[#ccc]">{{ item.desc }}</p>

            <div class="mb-4 flex w-full flex-col">
              <h3 class="mb-2 text-sm text-[#bbb]">Payment / Mint options</h3>
              <div class="flex flex-wrap gap-3">
                <div v-for="opt in item.paymentOptions" :key="opt.currency" class="flex items-center gap-3 bg-[#101214] px-4 py-2">
                  <img :src="opt.icon" alt="" class="h-6 w-6 object-contain" />
                  <div>
                    <div class="font-semibold">{{ opt.price }}</div>
                    <div class="text-xs text-[#999]">{{ opt.currency }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3 w-full">
              <button class="bg-[#f9d423] px-4 py-2 font-semibold text-[#23272a]">Buy</button>
              <button class="bg-[#2b2f32] px-4 py-2 text-white">Place Offer</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-20 text-center text-[#bbb]">Item not found.</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import items from "../../../data/items.json";

const route = useRoute();
const id = route.params.id;

const item = computed(() => items.find((i) => String(i.id) === String(id)) || null);
</script>
