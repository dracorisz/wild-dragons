<template>
  <div class="nft-grid-layout">
    <!-- Empty State -->
    <div v-if="empty && !loading" class="empty-state">
      <p class="empty-message">No items match your current filters</p>
      <slot name="empty-actions">
        <button @click="$emit('reset-filters')" class="reset-filters-button">
          Reset Filters
        </button>
      </slot>
    </div>

    <!-- NFT Grid -->
    <div v-else class="nft-grid">
      <div
        v-for="nft in nfts"
        :key="nft.id"
        :class="['nft-card', `nft-card--${nft.traits?.element?.toLowerCase()}`, `nft-card--${nft.traits?.rarity?.toLowerCase()}`]"
        @click="$emit('select-nft', nft)"
      >
        <!-- NFT Image with Badges -->
        <div class="nft-card__image">
          <img
            :src="getDynamicImageUrl(nft)"
            :alt="nft.name"
            class="nft-card__image-img"
            loading="lazy"
            @error="handleImageError(nft, $event)"
          />
          
          <!-- Rarity Badge -->
          <div class="nft-card__badge nft-card__badge--rarity">
            {{ nft.traits?.rarity || 'Unknown' }}
          </div>
          
          <!-- Element Badge -->
          <div class="nft-card__badge nft-card__badge--element">
            {{ nft.traits?.element || 'Unknown' }}
          </div>
        </div>

        <!-- NFT Info -->
        <div class="nft-card__info">
          <h3 class="nft-card__name">{{ nft.name }}</h3>
          <p class="nft-card__description">{{ nft.description }}</p>
          
          <div class="nft-card__stats">
            <div class="nft-card__price">
              {{ nft.price?.listed || 'N/A' }}
            </div>
            <div class="nft-card__power">
              <span class="nft-card__power-label">Power:</span>
              <span class="nft-card__power-value">{{ nft.traits?.power || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NFTGridLayout',
  props: {
    nfts: {
      type: Array,
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    },
    imageSource: {
      type: String,
      default: 'internal'
    }
  },
  methods: {
    getDynamicImageUrl(nft) {
      // Extract collection and ID from nft.id (format: collection_id)
      const parts = nft.id.split('_');
      const collection = parts[0] || 'default';
      const itemId = parts[1] || '1';

      // Use the image source service logic
      switch (this.imageSource) {
        case 'unsplash':
          return `https://source.unsplash.com/800x800/?${encodeURIComponent(nft.collection || collection)}`;
        case 'pexels':
          return `https://www.pexels.com/photo/${collection}-${itemId}/`;
        case 'pinterest':
          return `https://www.pinterest.com/resource/${collection}/${itemId}/`;
        case 'grok':
          return `https://grok.imagine/api/generate?prompt=${encodeURIComponent(nft.name || nft.collection)}&size=800x800`;
        case 'internal':
        default:
          // Fallback to internal assets
          return nft.image?.preview || nft.image?.thumbnail || `/assets/${collection}/${collection}_${itemId}_preview.png`;
      }
    },
    handleImageError(nft, event) {
      // Fallback to internal assets if external image fails to load
      const parts = nft.id.split('_');
      const collection = parts[0] || 'default';
      const itemId = parts[1] || '1';

      event.target.src = `/assets/${collection}/${collection}_${itemId}_preview.png`;
      console.warn(`Failed to load image from ${this.imageSource}, falling back to internal assets`);
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/components/nft-card.css";

.nft-grid-layout {
  min-height: 300px;
  color: var(--color-text-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-4);
  text-align: center;
  color: var(--color-text-primary);
}

.empty-message {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-6);
  opacity: 0.8;
  color: var(--color-text-primary);
}

.reset-filters-button {
  background-color: var(--color-primary);
  color: var(--color-bg-secondary);
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-normal);
}

.reset-filters-button:hover {
  background-color: #00e1d9;
  transform: translateY(-2px);
}

/* Responsive Grid Layout */
.nft-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 640px) {
  .nft-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .nft-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .nft-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .nft-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>