<template>
  <section class="settings">
    <header>
      <h1>Settings</h1>
      <p>Adjust auto-systems and personal preferences.</p>
    </header>

    <section class="settings-grid">
      <article>
        <h2>Auto Systems</h2>
        <label>
          <input type="checkbox" v-model="autoMinting" @change="toggleAutoMinting" />
          Auto publish minting data
        </label>
        <label>
          <input type="checkbox" v-model="autoImprovement" @change="toggleAutoImprovement" />
          Auto improvement cycle
        </label>
      </article>

      <article>
        <h2>Preferences</h2>
        <label>
          <input type="checkbox" v-model="autoSave" @change="toggleAutoSave" />
          Enable auto-save
        </label>
        <button class="btn btn-secondary" @click="exportData">Export Game Data</button>
        <button class="btn btn-danger" @click="clearData">Reset Local Data</button>
      </article>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useGameStore } from '../stores/gameStore.js';
import { useMintingStore } from '../stores/mintingStore.js';

const gameStore = useGameStore();
const mintingStore = useMintingStore();

const autoMinting = ref(mintingStore.autoPublishEnabled);
const autoImprovement = ref(window.HeroinesDragon?.autoImprovement?.autoImprovementEnabled ?? true);
const autoSave = ref(gameStore.playerData.autoSaveEnabled);

const toggleAutoMinting = () => mintingStore.toggleAutoPublish();
const toggleAutoImprovement = () => {
  const system = window.HeroinesDragon?.autoImprovement;
  if (!system) return;
  system.autoImprovementEnabled ? system.disableAutoImprovements() : system.enableAllImprovements();
  autoImprovement.value = system.autoImprovementEnabled;
};

const toggleAutoSave = () => {
  gameStore.playerData.autoSaveEnabled = autoSave.value;
  gameStore.savePlayerData();
};

const exportData = async () => {
  const data = await window.HeroinesDragon?.data?.exportData();
  if (!data) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `heroines-dragon-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  window.Toast?.success('Export completed', 'Settings');
};

const clearData = async () => {
  if (!confirm('This will clear all local progress. Continue?')) return;
  await window.HeroinesDragon?.data?.clearAllData();
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
};
</script>

<style scoped>
.settings {
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

.settings-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

article {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(255, 107, 53, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
}
</style>
