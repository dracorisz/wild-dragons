<template>
  <section class="minting-view">
    <header class="minting-header">
      <h1>Minting Hub</h1>
      <p>Monitor auto-approved items and publish legendary collectibles.</p>
    </header>

    <section class="summary">
      <article>
        <span class="label">Success Rate</span>
        <span class="value">{{ successRate.toFixed(1) }}%</span>
      </article>
      <article>
        <span class="label">Total Minted</span>
        <span class="value">{{ mintingStore.totalCompletedMints }}</span>
      </article>
      <article>
        <span class="label">Queue Value</span>
        <span class="value">{{ formatCurrency(mintingStore.queueValue) }}</span>
      </article>
    </section>

    <section class="queue">
      <h2>Pending Queue ({{ mintingStore.totalPendingMints }})</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Priority</th>
            <th>Queued</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in mintingStore.mintingQueue" :key="item.id">
            <td>{{ item.type }}</td>
            <td>{{ item.priority }}</td>
            <td>{{ formatTimeAgo(item.queuedAt) }}</td>
            <td>
              <button class="link-btn" @click="remove(item.id)">Remove</button>
            </td>
          </tr>
          <tr v-if="mintingStore.mintingQueue.length === 0">
            <td colspan="4" class="empty">Queue is empty.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="history">
      <h2>Recent History</h2>
      <ul>
        <li v-for="entry in mintingStore.mintingHistory.slice(0, 10)" :key="entry.id">
          {{ entry.type }} — {{ entry.success ? 'Success' : 'Failed' }} · {{ formatTimeAgo(entry.timestamp) }}
        </li>
        <li v-if="mintingStore.mintingHistory.length === 0" class="empty">No minting history yet.</li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useMintingStore } from '../stores/mintingStore.js';

const mintingStore = useMintingStore();
const successRate = computed(() => mintingStore.successRate);

const remove = (id) => mintingStore.removeFromQueue(id);

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const formatTimeAgo = (iso) => {
  if (!iso) return 'just now';
  const diff = Date.now() - new Date(iso).getTime();
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
.minting-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.minting-header {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 107, 53, 0.3);
  text-align: center;
}

.summary {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.summary article {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.label {
  display: block;
  opacity: 0.6;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-family: 'Orbitron', monospace;
  font-size: 1.4rem;
}

.queue,
.history {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

th {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

.link-btn {
  background: none;
  border: none;
  color: #f7931e;
  cursor: pointer;
}

.link-btn:hover {
  text-decoration: underline;
}

ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty {
  text-align: center;
  opacity: 0.6;
  font-style: italic;
}
</style>
