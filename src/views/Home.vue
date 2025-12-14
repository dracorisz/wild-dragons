<template>
  <section class="home">
    <header class="hero">
      <h1>Welcome, {{ playerName }}</h1>
      <p>Embark on quests, tame dragons, and forge legendary tales across Tiamat.</p>
      <div class="actions">
        <router-link to="/game" class="btn btn-primary">Enter the Arena</router-link>
        <router-link to="/minting" class="btn btn-secondary">Minting Hub</router-link>
      </div>
    </header>

    <section class="stats">
      <article class="stat-card" v-for="stat in statCards" :key="stat.label">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </article>
    </section>

    <section class="panels">
      <article class="panel">
        <h2>Recent Battles</h2>
        <ul>
          <li v-for="battle in recentBattles" :key="battle.id">
            <strong>{{ battle.winner.toUpperCase() }}</strong> victory — {{ formatTimeAgo(battle.timestamp) }}
          </li>
          <li v-if="recentBattles.length === 0" class="empty">No battles yet. Start one!</li>
        </ul>
      </article>

      <article class="panel">
        <h2>Minting Queue</h2>
        <ul>
          <li v-for="item in mintingQueue.slice(0, 5)" :key="item.id">
            {{ item.type }} · {{ item.priority }} priority
          </li>
          <li v-if="mintingQueue.length === 0" class="empty">Queue is empty.</li>
        </ul>
      </article>

      <article class="panel">
        <h2>Achievements</h2>
        <ul>
          <li v-for="achievement in achievements.slice(0, 5)" :key="achievement.id">
            {{ achievement.title }}
          </li>
          <li v-if="achievements.length === 0" class="empty">Unlock your first achievement.</li>
        </ul>
      </article>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore.js';
import { useMintingStore } from '../stores/mintingStore.js';

const gameStore = useGameStore();
const mintingStore = useMintingStore();

const playerName = computed(() => gameStore.playerData.username || 'Heroine');

const statCards = computed(() => [
  { label: 'Heroines', value: gameStore.totalHeroines },
  { label: 'Dragons', value: gameStore.totalDragons },
  { label: 'Win Rate', value: `${gameStore.winRate.toFixed(0)}%` },
  { label: 'Queued Mints', value: mintingStore.totalPendingMints }
]);

const recentBattles = computed(() => gameStore.battles.slice(0, 5));
const mintingQueue = computed(() => mintingStore.mintingQueue);
const achievements = computed(() => gameStore.achievements);

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'just now';
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(15, 52, 96, 0.4));
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.hero h1 {
  font-family: 'MedievalSharp', cursive;
  margin-bottom: 1rem;
}

.hero p {
  margin-bottom: 1.5rem;
  opacity: 0.85;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-value {
  font-family: 'Orbitron', monospace;
  font-size: 1.75rem;
  display: block;
}

.stat-label {
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panels {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.panel {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.panel h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.panel ul {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.panel li {
  font-size: 0.95rem;
}

.empty {
  opacity: 0.6;
  font-style: italic;
  color: white; /* Ensure empty state text is white */
}

/* Fix contrast issues - ensure white text on dark background */
.home {
  color: white; /* Ensure all text is white */
}

.hero {
  color: white; /* White text in hero section */
}

.hero h1 {
  color: white; /* White heading */
}

.hero p {
  color: rgba(255, 255, 255, 0.85); /* Light white for subtitle */
}

.stat-card {
  color: white; /* White text in stat cards */
}

.stat-value {
  color: white; /* White stat values */
}

.stat-label {
  color: rgba(255, 255, 255, 0.7); /* Light white labels */
}

.panel {
  color: white; /* White text in panels */
}

.panel h2 {
  color: white; /* White panel headings */
}

.panel li {
  color: white; /* White list items */
}

/* Button styling for better visibility */
.btn {
  color: white; /* White button text */
  background: rgba(24, 24, 40, 0.8);
  border: 1px solid #00fff7;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 600;
}

.btn:hover {
  background: #00fff7;
  color: #23234b; /* Dark text on light background */
  transform: translateY(-2px);
}

.btn-primary {
  background: #00fff7;
  color: #23234b; /* Dark text for primary buttons */
}

.btn-secondary {
  background: rgba(24, 24, 40, 0.8);
  color: white;
  border: 1px solid #ff00cc;
}

@media (max-width: 600px) {
  .actions {
    flex-direction: column;
  }
}
</style>
