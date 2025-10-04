<template>
  <section class="achievements">
    <header>
      <h1>Achievements</h1>
      <p>Celebrate your legendary feats and unlock new milestones.</p>
    </header>

    <section class="achievement-grid">
      <article v-for="achievement in achievements" :key="achievement.id" class="achievement-card">
        <div class="icon">{{ achievement.icon || '🏆' }}</div>
        <h2>{{ achievement.title }}</h2>
        <p>{{ achievement.description }}</p>
        <span class="date">Unlocked {{ formatDate(achievement.unlockedAt) }}</span>
      </article>

      <article v-if="achievements.length === 0" class="empty-card">
        Begin your journey to unlock achievements.
      </article>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore.js';

const gameStore = useGameStore();
const achievements = computed(() => gameStore.achievements);

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : 'soon™');
</script>

<style scoped>
.achievements {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

header {
  text-align: center;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 107, 53, 0.3);
}

.achievement-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.achievement-card {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(255, 107, 53, 0.2);
  text-align: center;
}

.icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.date {
  display: block;
  margin-top: 1rem;
  opacity: 0.6;
  font-size: 0.85rem;
}

.empty-card {
  padding: 2rem;
  text-align: center;
  opacity: 0.6;
  font-style: italic;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
}
</style>
