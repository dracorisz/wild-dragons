<template>
  <div class="nft-filters">
    <!-- Collection Filter -->
    <div class="collection-filter mb-6">
      <h2 class="text-2xl font-bold mb-4 text-dragon">Collections</h2>
      <div class="collections-slider flex overflow-x-auto gap-4 pb-4">
        <button
          v-for="(collection, id) in collections"
          :key="id"
          @click="$emit('collection-change', id)"
          class="collection-button px-4 py-2 rounded-lg whitespace-nowrap transition-all"
          :class="selectedCollection === id ? 'bg-accent text-white' : 'bg-primary/50 hover:bg-primary'"
        >
          {{ collection.name }} ({{ collection.item_count }})
        </button>
      </div>
    </div>

    <div class="filter-grid grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Element Filter -->
      <div class="element-filter">
        <h3 class="text-xl font-bold mb-3 text-sky">Elements</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="element in elements"
            :key="element"
            @click="$emit('element-change', element)"
            class="element-button px-3 py-1 rounded-md text-sm transition-all"
            :class="selectedElements.includes(element) ? 'bg-accent/80 text-white' : 'bg-primary/30 hover:bg-primary/50'"
          >
            {{ element }}
          </button>
        </div>
      </div>

      <!-- Rarity Filter -->
      <div class="rarity-filter">
        <h3 class="text-xl font-bold mb-3 text-dragon">Rarity</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="rarity in rarities"
            :key="rarity"
            @click="$emit('rarity-change', rarity)"
            class="rarity-button px-3 py-1 rounded-md text-sm transition-all"
            :class="selectedRarities.includes(rarity) ? 'bg-accent/80 text-white' : 'bg-primary/30 hover:bg-primary/50'"
          >
            {{ rarity }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reset Button -->
    <div class="reset-section mt-4">
      <button
        @click="$emit('reset-filters')"
        class="reset-button px-4 py-2 bg-primary/30 hover:bg-primary/50 rounded-md transition-all"
        :class="{ 'opacity-50': !hasActiveFilters }"
        :disabled="!hasActiveFilters"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NFTFilters',
  props: {
    collections: {
      type: Object,
      required: true
    },
    elements: {
      type: Array,
      required: true
    },
    rarities: {
      type: Array,
      required: true
    },
    selectedCollection: {
      type: String,
      default: null
    },
    selectedElements: {
      type: Array,
      default: () => []
    },
    selectedRarities: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    hasActiveFilters() {
      return this.selectedCollection !== null ||
             this.selectedElements.length > 0 ||
             this.selectedRarities.length > 0;
    }
  }
};
</script>

<style scoped>
.nft-filters {
  background: rgba(24, 24, 40, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  color: white; /* Ensure all text is white */
}

.collections-slider::-webkit-scrollbar {
  height: 4px;
}

.collections-slider::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.collections-slider::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.collections-slider::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.collection-button, .element-button, .rarity-button {
  transition: all 0.2s ease;
  color: white; /* White text on buttons */
}

.collection-button:hover, .element-button:hover, .rarity-button:hover {
  transform: translateY(-1px);
}

.reset-button {
  color: white;
  transition: all 0.2s ease;
}

.reset-button:not(:disabled):hover {
  background: rgba(30, 41, 59, 0.7);
}

.reset-button:disabled {
  cursor: not-allowed;
}
</style>