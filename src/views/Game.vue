<template>
  <section class="game-view">
    <header class="game-header">
      <h1>Battle Arena</h1>
      <p>Choose your champions and unleash epic encounters.</p>
      <div class="controls">
        <button class="btn btn-primary" @click="startGameSession">Start Session</button>
        <button class="btn btn-secondary" @click="spawnHeroine">Recruit Heroine</button>
        <button class="btn btn-secondary" @click="spawnDragon">Tame Dragon</button>
        <button class="btn btn-danger" @click="launchQuickBattle" :disabled="!canBattle">Quick Battle</button>
      </div>
    </header>

    <GameCanvas :game-active="gameStore.isGameActive" />

    <section class="roster">
      <article>
        <h2>Heroines</h2>
        <ul>
          <li v-for="heroine in gameStore.heroines" :key="heroine.id">
            {{ heroine.name }} — Lv. {{ heroine.level }} ({{ heroine.rarity }})
          </li>
          <li v-if="gameStore.heroines.length === 0" class="empty">Recruit your first heroine.</li>
        </ul>
      </article>

      <article>
        <h2>Dragons</h2>
        <ul>
          <li v-for="dragon in gameStore.dragons" :key="dragon.id">
            {{ dragon.name }} — Lv. {{ dragon.level }} ({{ dragon.type }})
          </li>
          <li v-if="gameStore.dragons.length === 0" class="empty">Tame your first dragon.</li>
        </ul>
      </article>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore.js';
import GameCanvas from '../components/game/GameCanvas.vue';

const gameStore = useGameStore();

const spawnHeroine = () => {
  gameStore.addHeroine({
    name: `Heroine ${gameStore.totalHeroines + 1}`,
    level: 1,
    attributes: {
      strength: 8 + Math.floor(Math.random() * 6),
      agility: 8 + Math.floor(Math.random() * 6),
      intelligence: 8 + Math.floor(Math.random() * 6),
      vitality: 8 + Math.floor(Math.random() * 6)
    }
  });
};

const spawnDragon = () => {
  gameStore.addDragon({
    name: `Dragon ${gameStore.totalDragons + 1}`,
    level: 1,
    power: 50 + Math.floor(Math.random() * 50),
    type: ['fire', 'ice', 'storm'][Math.floor(Math.random() * 3)]
  });
};

const canBattle = computed(() => gameStore.heroines.length > 0 && gameStore.dragons.length > 0);

const launchQuickBattle = () => {
  if (!canBattle.value) return;
  const heroine = gameStore.heroines[0];
  const dragon = gameStore.dragons[0];
  window.HeroinesDragon?.gameEngine?.startBattle(heroine.id, dragon.id);
};

const startGameSession = () => {
  gameStore.startGame();
  window.Toast?.info('Session started. Ready for battle!', 'Arena');
};
</script>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.game-header {
  text-align: center;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 107, 53, 0.3);
}

.controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1.5rem;
}

.roster {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.roster article {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.roster h2 {
  margin-bottom: 0.75rem;
}

.roster ul {
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
