<template>
  <aside :class="['fixed top-0 h-screen z-[1000] bg-[#181a1b] border-r border-[#222] transition-left', open ? 'left-0' : '-left-[260px]']" style="width:260px;">
    <div class="p-6">
      <h3 class="mb-4 text-lg font-semibold text-white">Filters</h3>

      <div class="mb-4">
        <label class="block mb-2 text-sm text-[#ddd]">Currency</label>
        <select v-model="local.currency" @change="emitUpdate" class="w-full p-2 bg-[#23272a] text-white border border-[#333] rounded">
          <option>All</option>
          <option>USDC</option>
          <option>IMX</option>
          <option>RON</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-sm text-[#ddd]">Price min / max</label>
        <div class="flex gap-2">
          <input v-model.number="local.priceMin" @input="emitUpdate" placeholder="Min" class="w-1/2 p-2 bg-[#23272a] text-white border border-[#333] rounded" />
          <input v-model.number="local.priceMax" @input="emitUpdate" placeholder="Max" class="w-1/2 p-2 bg-[#23272a] text-white border border-[#333] rounded" />
        </div>
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-sm text-[#ddd]">Traits (example)</label>
        <select v-model="local.trait" @change="emitUpdate" class="w-full p-2 bg-[#23272a] text-white border border-[#333] rounded">
          <option value="">Any</option>
          <option value="rare">Rare</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>

      <div class="mt-6">
        <button @click="resetFilters" class="w-full bg-[#f9d423] text-[#23272a] py-2 rounded font-semibold">Reset Filters</button>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'MarketSidebar',
  props: {
    open: { type: Boolean, default: false },
    filters: { type: Object, default: () => ({}) }
  },
  emits: ['update:filters'],
  data() {
    return {
      // create a local copy to avoid mutating prop directly
      local: {
        currency: this.filters.currency || 'All',
        priceMin: this.filters.priceMin || null,
        priceMax: this.filters.priceMax || null,
        trait: this.filters.trait || ''
      }
    };
  },
  watch: {
    filters: {
      deep: true,
      handler(v) {
        // sync incoming prop updates
        this.local.currency = v.currency || this.local.currency || 'All';
        this.local.priceMin = v.priceMin ?? this.local.priceMin;
        this.local.priceMax = v.priceMax ?? this.local.priceMax;
        this.local.trait = v.trait ?? this.local.trait;
      }
    }
  },
  methods: {
    emitUpdate() {
      this.$emit('update:filters', {
        currency: this.local.currency,
        priceMin: this.local.priceMin,
        priceMax: this.local.priceMax,
        trait: this.local.trait
      });
    },
    resetFilters() {
      this.local = { currency: 'All', priceMin: null, priceMax: null, trait: '' };
      this.emitUpdate();
    }
  }
};
</script>

<style scoped>
/* Styles moved to market.css */
</style>
