<template>
  <div v-if="nft" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content max-w-4xl w-full">
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="close-button"
        aria-label="Close modal"
      >
        ✕
      </button>

      <div class="modal-grid">
        <!-- NFT Image -->
        <div class="modal-image">
          <img
            :src="nft.image.full || nft.image.preview"
            :alt="nft.name"
            class="w-full h-full object-contain"
            loading="eager"
          />
        </div>

        <!-- NFT Details -->
        <div class="modal-details">
          <h2 class="modal-title">{{ nft.name }}</h2>
          <p class="modal-collection">{{ nft.collection }}</p>

          <div class="modal-description">{{ nft.description }}</div>

          <!-- Traits Grid -->
          <div class="traits-grid">
            <div class="trait">
              <span class="trait-label">Rarity</span>
              <span class="trait-value">{{ nft.traits?.rarity || 'Unknown' }}</span>
            </div>
            <div class="trait">
              <span class="trait-label">Element</span>
              <span class="trait-value">{{ nft.traits?.element || 'Unknown' }}</span>
            </div>
            <div class="trait">
              <span class="trait-label">Power</span>
              <span class="trait-value">{{ nft.traits?.power || 'N/A' }}</span>
            </div>
            <div class="trait">
              <span class="trait-label">Chakra</span>
              <span class="trait-value">{{ nft.spiritual?.chakra || 'N/A' }}</span>
            </div>
            <div class="trait">
              <span class="trait-label">Frequency</span>
              <span class="trait-value">{{ nft.spiritual?.frequency_hz ? nft.spiritual.frequency_hz + ' Hz' : 'N/A' }}</span>
            </div>
            <div class="trait">
              <span class="trait-label">Color</span>
              <span class="trait-value">{{ nft.spiritual?.color || 'N/A' }}</span>
            </div>
            <div class="trait">
              <span class="trait-label">Unlock Level</span>
              <span class="trait-value">{{ nft.spiritual?.level_unlock || 'N/A' }}</span>
            </div>
          </div>

          <!-- Pricing Section -->
          <div class="pricing-section">
            <div class="price-row">
              <span class="price-label">Listed Price:</span>
              <span class="price-value">{{ nft.price?.listed || 'N/A' }}</span>
            </div>
            <div class="price-row">
              <span class="price-label">Floor Price:</span>
              <span class="price-value">{{ nft.price?.floor || 'N/A' }}</span>
            </div>
            <div class="price-row">
              <span class="price-label">Last Sale:</span>
              <span class="price-value">{{ nft.price?.last_sale || 'N/A' }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button v-if="canBuy" class="buy-button" @click="handleBuy">Buy Now</button>
            <button v-if="canList" class="list-button" @click="handleList">List for Sale</button>
            <button v-if="canTransfer" class="transfer-button" @click="handleTransfer">Transfer</button>
            <button v-if="canMint" class="mint-button" @click="handleMint">Mint Now</button>
            <button class="secondary-button" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NFTDetailModal',
  props: {
    nft: {
      type: Object,
      default: null
    },
    canBuy: {
      type: Boolean,
      default: false
    },
    canList: {
      type: Boolean,
      default: false
    },
    canTransfer: {
      type: Boolean,
      default: false
    },
    canMint: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    // Add escape key listener
    document.addEventListener('keydown', this.handleKeydown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  },
  beforeUnmount() {
    // Remove escape key listener
    document.removeEventListener('keydown', this.handleKeydown);
    // Restore body scroll
    document.body.style.overflow = '';
  },
  methods: {
    handleMint() {
      this.$emit('mint', this.nft);
    },
    handleBuy() {
      this.$emit('buy', this.nft);
    },
    handleList() {
      this.$emit('list', this.nft);
    },
    handleTransfer() {
      this.$emit('transfer', this.nft);
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.$emit('close');
      }
    },
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: rgba(24, 24, 40, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  color: white; /* Ensure all text is white */
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--accent-color, #00fff7);
  transform: rotate(90deg);
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.modal-image {
  background: rgba(0, 0, 0, 0.3);
  aspect-ratio: 1/1;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: white; /* White text */
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white; /* White text */
}

.modal-collection {
  color: var(--dragon-color, #ff6b35);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.modal-description {
  line-height: 1.6;
  margin-bottom: 1rem;
  opacity: 0.9;
  color: white; /* White text */
}

.traits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.trait {
  background: rgba(30, 41, 59, 0.5);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.1);
  color: white; /* White text */
}

.trait-label {
  display: block;
  font-size: 0.75rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
  color: rgba(255, 255, 255, 0.8); /* Light white text */
}

.trait-value {
  font-weight: 600;
  font-size: 0.875rem;
  color: white; /* White text */
}

.pricing-section {
  border-top: 1px solid rgba(0, 255, 255, 0.2);
  padding-top: 1.5rem;
  margin-top: 1rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: white; /* White text */
}

.price-label {
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.8); /* Light white text */
}

.price-value {
  font-weight: 600;
  color: var(--dragon-color, #ff6b35);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.mint-button {
  flex: 1;
  background: var(--accent-color, #00fff7);
  color: #23234b; /* Dark text on light background */
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.mint-button:hover {
  background: #00e1d9;
  transform: translateY(-2px);
}

.secondary-button {
  flex: 1;
  background: rgba(30, 41, 59, 0.7);
  color: white; /* White text */
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.secondary-button:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(0, 255, 255, 0.4);
}
.buy-button {
  flex: 1;
  background: #10b981;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}
.buy-button:hover {
  background: #059669;
  transform: translateY(-2px);
}
.list-button {
  flex: 1;
  background: #3b82f6;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}
.list-button:hover {
  background: #2563eb;
  transform: translateY(-2px);
}
.transfer-button {
  flex: 1;
  background: #f59e0b;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}
.transfer-button:hover {
  background: #d97706;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .modal-grid {
    grid-template-columns: 1fr;
  }

  .modal-image {
    aspect-ratio: 16/9;
  }
}
</style>