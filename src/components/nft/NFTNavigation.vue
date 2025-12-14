<!--
 * NFT Navigation Component
 * Comprehensive navigation system for NFT marketplace
 * Supports collection browsing, image source selection, and filtering
 -->
<template>
  <nav class="nft-navigation">
    <!-- Main Navigation Tabs -->
    <div class="nft-nav__tabs">
      <button
        v-for="tab in navigationTabs"
        :key="tab.id"
        @click="selectTab(tab.id)"
        :class="['nft-nav__tab', { 'nft-nav__tab--active': activeTab === tab.id }]"
        :aria-label="`Navigate to ${tab.label}`"
      >
        <span class="nft-nav__tab-icon">{{ tab.icon }}</span>
        <span class="nft-nav__tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Image Source Selector -->
    <div class="nft-nav__source-selector">
      <label class="nft-nav__source-label">Image Source:</label>
      <select
        v-model="selectedImageSource"
        @change="handleSourceChange"
        class="nft-nav__source-select"
        aria-label="Select image source"
      >
        <option v-for="source in imageSources" :key="source.id" :value="source.id">
          {{ source.name }}
        </option>
      </select>
    </div>

    <!-- Collection Browser -->
    <div v-if="activeTab === 'collections'" class="nft-nav__collection-browser">
      <div class="nft-nav__collection-grid">
        <button
          v-for="collection in collections"
          :key="collection.id"
          @click="navigateToCollection(collection.id)"
          :class="['nft-nav__collection-card', { 'nft-nav__collection-card--active': selectedCollection === collection.id }]"
          :aria-label="`Browse ${collection.name} collection`"
        >
          <div class="nft-nav__collection-icon">
            <img :src="getCollectionIcon(collection.id)" :alt="`${collection.name} icon`" loading="lazy">
          </div>
          <span class="nft-nav__collection-name">{{ collection.name }}</span>
          <span class="nft-nav__collection-count">{{ collection.item_count }} items</span>
        </button>
      </div>
    </div>

    <!-- Quick Filters -->
    <div class="nft-nav__quick-filters">
      <button
        v-for="filter in quickFilters"
        :key="filter.id"
        @click="applyQuickFilter(filter.id)"
        :class="['nft-nav__filter-btn', { 'nft-nav__filter-btn--active': activeQuickFilter === filter.id }]"
        :aria-label="`Apply ${filter.label} filter`"
      >
        {{ filter.label }}
      </button>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'NFTNavigation',
  props: {
    collections: {
      type: Object,
      required: true,
      default: () => ({})
    },
    activeCollection: {
      type: String,
      default: null
    }
  },
  emits: ['collection-change', 'source-change', 'filter-change'],
  setup(props, { emit }) {
    // Navigation state
    const activeTab = ref('collections');
    const selectedImageSource = ref('internal');
    const activeQuickFilter = ref(null);

    // Navigation tabs configuration
    const navigationTabs = [
      { id: 'collections', label: 'Collections', icon: '🗂️' },
      { id: 'explore', label: 'Explore', icon: '🔍' },
      { id: 'favorites', label: 'Favorites', icon: '❤️' },
      { id: 'activity', label: 'Activity', icon: '📊' }
    ];

    // Image source options
    const imageSources = [
      { id: 'internal', name: 'Internal Assets', api: null },
      { id: 'pinterest', name: 'Pinterest', api: 'https://www.pinterest.com/resource/' },
      { id: 'unsplash', name: 'Unsplash', api: 'https://source.unsplash.com/' },
      { id: 'pexels', name: 'Pexels', api: 'https://www.pexels.com/photo/' },
      { id: 'grok', name: 'Grok Imagine', api: 'https://grok.imagine/api/' }
    ];

    // Quick filter options
    const quickFilters = [
      { id: 'trending', label: 'Trending' },
      { id: 'new', label: 'New Arrivals' },
      { id: 'top', label: 'Top Rated' },
      { id: 'rare', label: 'Rare Finds' }
    ];

    // Collection icons mapping
    const collectionIcons = {
      dragons: '/assets/dragons/dragons_1_thumb.png',
      cosmic: '/assets/cosmic/cosmic_1_thumb.png',
      elemental: '/assets/elemental/elemental_1_thumb.png',
      fantasy: '/assets/fantasy/fantasy_1_thumb.png',
      mythical: '/assets/mythical/mythical_1_thumb.png'
    };

    // Computed property for selected collection
    const selectedCollection = computed(() => props.activeCollection);

    // Methods
    const selectTab = (tabId) => {
      activeTab.value = tabId;
      emit('filter-change', { type: 'tab', value: tabId });
    };

    const navigateToCollection = (collectionId) => {
      emit('collection-change', collectionId);
    };

    const handleSourceChange = () => {
      emit('source-change', selectedImageSource.value);
    };

    const applyQuickFilter = (filterId) => {
      activeQuickFilter.value = filterId;
      emit('filter-change', { type: 'quick', value: filterId });
    };

    const getCollectionIcon = (collectionId) => {
      return collectionIcons[collectionId] || '/icons/icon-192.png';
    };

    // Expose methods for external use
    const navigateToExplore = () => {
      selectTab('explore');
    };

    const setImageSource = (sourceId) => {
      selectedImageSource.value = sourceId;
      handleSourceChange();
    };

    return {
      activeTab,
      selectedImageSource,
      activeQuickFilter,
      selectedCollection,
      navigationTabs,
      imageSources,
      quickFilters,
      selectTab,
      navigateToCollection,
      handleSourceChange,
      applyQuickFilter,
      getCollectionIcon,
      navigateToExplore,
      setImageSource
    };
  }
};
</script>

<style scoped>
@import "../../assets/css/variables.css";

.nft-navigation {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  color: var(--color-text-primary);
}

.nft-nav__tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-2);
}

.nft-nav__tab {
  flex: 1;
  min-width: 100px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  cursor: pointer;
  transition: var(--transition-normal);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.nft-nav__tab:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--color-border-hover);
}

.nft-nav__tab--active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: var(--color-bg-secondary);
  border-color: transparent;
}

.nft-nav__tab-icon {
  font-size: var(--font-size-xl);
}

.nft-nav__source-selector {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding: var(--space-2);
  background: rgba(24, 24, 40, 0.3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-primary);
}

.nft-nav__source-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.nft-nav__source-select {
  flex: 1;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-2);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-normal);
}

.nft-nav__source-select:hover {
  border-color: var(--color-border-hover);
}

.nft-nav__collection-browser {
  margin-top: var(--space-4);
}

.nft-nav__collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-3);
  overflow-x: auto;
  padding-bottom: var(--space-2);
}

.nft-nav__collection-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  cursor: pointer;
  transition: var(--transition-normal);
  text-align: center;
}

.nft-nav__collection-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.nft-nav__collection-card--active {
  border-color: var(--color-primary);
  background: rgba(0, 255, 255, 0.1);
}

.nft-nav__collection-icon img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-primary);
}

.nft-nav__collection-name {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.nft-nav__collection-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.nft-nav__quick-filters {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-2);
}

.nft-nav__filter-btn {
  flex: 1;
  min-width: 100px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-normal);
  white-space: nowrap;
}

.nft-nav__filter-btn:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--color-border-hover);
}

.nft-nav__filter-btn--active {
  background: var(--color-primary);
  color: var(--color-bg-secondary);
  border-color: var(--color-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nft-nav__tabs {
    gap: var(--space-1);
  }
  
  .nft-nav__tab {
    min-width: 80px;
    padding: var(--space-1) var(--space-2);
    font-size: var(--font-size-xs);
  }
  
  .nft-nav__collection-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--space-2);
  }
}

/* Scrollbar styling */
.nft-nav__tabs::-webkit-scrollbar,
.nft-nav__collection-grid::-webkit-scrollbar,
.nft-nav__quick-filters::-webkit-scrollbar {
  height: 4px;
}

.nft-nav__tabs::-webkit-scrollbar-thumb,
.nft-nav__collection-grid::-webkit-scrollbar-thumb,
.nft-nav__quick-filters::-webkit-scrollbar-thumb {
  background: var(--color-border-primary);
  border-radius: var(--radius-full);
}

.nft-nav__tabs::-webkit-scrollbar-thumb:hover,
.nft-nav__collection-grid::-webkit-scrollbar-thumb:hover,
.nft-nav__quick-filters::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-hover);
}
</style>