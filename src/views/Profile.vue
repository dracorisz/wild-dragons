<template>
  <section class="profile">
    <header class="profile-header">
      <div class="avatar">{{ initials }}</div>
      <div>
        <h1>{{ player.username || 'Anonymous Heroine' }}</h1>
        <p>Level {{ player.level }} · {{ player.experience }} XP</p>
      </div>
    </header>

    <section class="profile-grid">
      <article>
        <h2>Progress</h2>
        <ul>
          <li>Total Play Time: {{ formatDuration(stats.totalPlayTime) }}</li>
          <li>Heroines Created: {{ stats.heroinesCreated }}</li>
          <li>Dragons Tamed: {{ stats.dragonsTamed }}</li>
          <li>Battles Won: {{ stats.battlesWon }}</li>
        </ul>
      </article>

      <article>
        <h2>Achievements</h2>
        <ul>
          <li v-for="achievement in achievements" :key="achievement.id">
            {{ achievement.title }} — unlocked {{ formatDate(achievement.unlockedAt) }}
          </li>
          <li v-if="achievements.length === 0" class="empty">Earn your first achievement.</li>
        </ul>
      </article>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore.js';

const gameStore = useGameStore();
const player = computed(() => gameStore.playerData);
const stats = computed(() => gameStore.gameStats);
const achievements = computed(() => gameStore.achievements);

const initials = computed(() => (player.value.username || '?').slice(0, 2).toUpperCase());

const formatDuration = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : 'N/A');
</script>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 107, 53, 0.3);
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: bold;
}

.profile-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

article {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

h2 {
  margin-bottom: 0.75rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty {
  opacity: 0.6;
  font-style: italic;
}
</style>
