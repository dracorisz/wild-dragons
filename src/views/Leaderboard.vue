<template>
  <section class="leaderboard">
    <header>
      <h1>Leaderboard</h1>
      <p>Top heroines leading the charge across Tiamat.</p>
    </header>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Heroine</th>
          <th>Victories</th>
          <th>Power Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in entries" :key="entry.id">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.name }}</td>
          <td>{{ entry.victories }}</td>
          <td>{{ entry.power }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore.js';

const gameStore = useGameStore();

const entries = computed(() =>
  gameStore.heroines
    .map((heroine) => ({
      id: heroine.id,
      name: heroine.name,
      victories: heroine.battlesWon || 0,
      power: Object.values(heroine.attributes || {}).reduce((sum, val) => sum + val, 0)
    }))
    .sort((a, b) => b.victories - a.victories || b.power - a.power)
    .slice(0, 15)
);
</script>

<style scoped>
.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 107, 53, 0.3);
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

th,
td {
  padding: 0.85rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

th {
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.7;
}

tbody tr:nth-child(odd) {
  background: rgba(255, 255, 255, 0.03);
}
</style>
