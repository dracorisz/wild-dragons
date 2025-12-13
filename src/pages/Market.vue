<template>
  <div class="page">
    <!-- sidebar anchor -->
    <div class="fixed top-1/2 left-0 z-[1100] flex h-16 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-lg bg-[#f9d423] text-[#23272a]" @mouseenter="sidebarOpen = true" @mouseleave="sidebarOpen = false" @click="sidebarOpen = !sidebarOpen" aria-label="Open filters">☰</div>

    <MarketSidebar :open="sidebarOpen" :filters="filters" @update:filters="onUpdateFilters" class="z-[1000]" />

    <main class="px-10 pb-8">
      <MarketBanner />
      <!-- <MarketTabs v-model:activeTab="activeTab" /> -->
      <MarketControls :controls="{ search: searchQuery, myOrders: myOrdersOnly, sort: sortBy, currency: currencyFilter }" @update:controls="onUpdateControls" />
      <CollectionsGrid :collections="filteredCollections" />
      <ItemsGrid :items="filteredItems" />
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

import MarketSidebar from "../components/market/MarketSidebar.vue";
import MarketBanner from "../components/market/MarketBanner.vue";
import MarketTabs from "../components/market/MarketTabs.vue";
import MarketControls from "../components/market/MarketControls.vue";
import CollectionsGrid from "../components/market/CollectionsGrid.vue";
import ItemsGrid from "../components/market/ItemsGrid.vue";

import collections from "../../data/collections.json";
import items from "../../data/items.json";

// UI state
const sidebarOpen = ref(false);
const activeTab = ref("market"); // possible values: market, my-nfts, activity

// Filters / controls state
const searchQuery = ref("");
const myOrdersOnly = ref(false);
const sortBy = ref("price"); // placeholder
const currencyFilter = ref("All"); // All, USDC, IMX, RON
const filters = reactive({
  priceMin: null,
  priceMax: null,
  traits: {},
});

// Handler: when Sidebar emits filter updates
function onUpdateFilters(newFilters) {
  // Merge incoming filters into reactive filters
  Object.assign(filters, newFilters);
}

// Handler: when Controls emits search/myOrders/sort updates
function onUpdateControls(payload) {
  if (payload.search !== undefined) searchQuery.value = payload.search;
  if (payload.myOrders !== undefined) myOrdersOnly.value = payload.myOrders;
  if (payload.sort !== undefined) sortBy.value = payload.sort;
  if (payload.currency !== undefined) currencyFilter.value = payload.currency;
}

// Computed: filtered collections (search only for now)
const filteredCollections = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return collections;
  return collections.filter(
    (c) =>
      String(c.title).toLowerCase().includes(q) ||
      String(c.desc || "")
        .toLowerCase()
        .includes(q),
  );
});

// Computed: filtered items
const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();

  return (
    items
      .filter((item) => {
        // search match
        if (q) {
          const hay = (item.title + " " + (item.desc || "")).toLowerCase();
          if (!hay.includes(q)) return false;
        }

        // currency filter: if selected and not 'All', only include items that have that payment option
        if (currencyFilter.value && currencyFilter.value !== "All") {
          const has = (item.paymentOptions || []).some((opt) => opt.currency === currencyFilter.value);
          if (!has) return false;
        }

        // price range: uses chosen currency (or first payment option)
        const min = filters.priceMin ? parseFloat(filters.priceMin) : null;
        const max = filters.priceMax ? parseFloat(filters.priceMax) : null;
        let priceVal = null;
        if (currencyFilter.value && currencyFilter.value !== "All") {
          const opt = (item.paymentOptions || []).find((o) => o.currency === currencyFilter.value);
          if (opt) priceVal = parseFloat(opt.price);
        } else {
          // fallback to first payment option
          const opt = (item.paymentOptions || [])[0];
          if (opt) priceVal = parseFloat(opt.price);
        }

        if (priceVal != null) {
          if (min != null && priceVal < min) return false;
          if (max != null && priceVal > max) return false;
        }

        // myOrdersOnly is placeholder: no user data yet -> always include
        if (myOrdersOnly.value) {
          // keep items showing a "My Orders" badge would require user context
          // for now, do nothing (or you could filter to an empty result)
        }

        return true;
      })
      // sort
      .sort((a, b) => {
        if (sortBy.value === "price") {
          const pa = parseFloat(((a.paymentOptions || [])[0] || {}).price || 0);
          const pb = parseFloat(((b.paymentOptions || [])[0] || {}).price || 0);
          return pa - pb;
        }
        // default: keep original order
        return 0;
      })
  );
});
</script>
