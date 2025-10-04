<template>
  <div class="loading-screen" role="status" aria-live="polite">
    <div class="loading-content">
      <div class="loading-logo">
        <div class="dragon-icon">🐉</div>
      </div>
      <h2 class="loading-title">Heroine's Dragon</h2>
      <p class="loading-subtitle">Awakening the legends...</p>
      <div class="loading-progress">
        <div class="loading-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="loading-spinner"></div>
      <p class="loading-tip">{{ currentTip }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'LoadingScreen',
  setup() {
    const progress = ref(0);
    const currentTip = ref('');
    const tips = [
      'Sharpening swords...',
      'Taming wild dragons...',
      'Brewing potions...',
      'Consulting ancient tomes...',
      'Forging legendary weapons...',
      'Summoning heroic spirits...'
    ];
    let progressInterval;
    let tipInterval;

    onMounted(() => {
      currentTip.value = tips[0];
      progressInterval = setInterval(() => {
        if (progress.value < 90) progress.value += Math.random() * 10;
      }, 200);
      tipInterval = setInterval(() => {
        currentTip.value = tips[Math.floor(Math.random() * tips.length)];
      }, 2000);
    });

    onBeforeUnmount(() => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    });

    return { progress, currentTip };
  }
};
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #1a0a2e, #16213e);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: #ffffff;
  max-width: 360px;
  padding: 2rem;
}

.dragon-icon {
  font-size: 4rem;
  animation: pulse 2s infinite;
}

.loading-title {
  font-family: 'MedievalSharp', cursive;
  margin: 1rem 0 0.5rem;
  color: #ff6b35;
}

.loading-progress {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin: 1.5rem 0;
  overflow: hidden;
}

.loading-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #f7931e);
  transition: width 0.3s ease;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #ff6b35;
  border-radius: 50%;
  margin: 1.5rem auto;
  animation: spin 1s linear infinite;
}

.loading-tip {
  font-style: italic;
  opacity: 0.8;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
