<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section py-20 hero-gradient">
      <div class="container mx-auto px-4 text-center">
        <div class="animate-fade-in">
          <Typography tag="h1" variant="display" size="7xl" weight="bold" class="mb-6 animate-hero-glow text-background">
            {{ gameIcon }} {{ gameTitle }}
          </Typography>
          <Typography variant="body" size="2xl" class="mb-8 opacity-90 text-background">
            {{ gameSubtitle }}
          </Typography>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              as="router-link"
              to="/play"
              variant="secondary"
              size="lg"
              class="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🎮 Start Playing
            </Button>
            <Button
              as="router-link"
              to="/profile"
              variant="outline"
              size="lg"
              class="px-8 py-4 text-lg font-semibold"
            >
              👤 View Profile
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-background">
      <div class="container mx-auto px-4">
        <Typography tag="h2" variant="title" size="4xl" weight="bold" class="text-center mb-12 hero-text-gradient">
          Game Features
        </Typography>
        <div class="grid md:grid-cols-3 gap-8">
          <Card variant="default" class="p-6 hover:shadow-lg transition-shadow animate-slide-up">
            <div class="text-4xl mb-4">{{ battleIcon }}</div>
            <Typography tag="h3" variant="title" size="xl" weight="semibold" class="mb-3">
              {{ epicBattlesTitle }}
            </Typography>
            <Typography variant="body" size="md" class="text-muted-foreground">
              {{ epicBattlesDesc }}
            </Typography>
          </Card>
          <Card variant="default" class="p-6 hover:shadow-lg transition-shadow animate-slide-up" style="animation-delay: 0.1s">
            <div class="text-4xl mb-4">{{ buildingIcon }}</div>
            <Typography tag="h3" variant="title" size="xl" weight="semibold" class="mb-3">
              {{ buildKingdomTitle }}
            </Typography>
            <Typography variant="body" size="md" class="text-muted-foreground">
              {{ buildKingdomDesc }}
            </Typography>
          </Card>
          <Card variant="default" class="p-6 hover:shadow-lg transition-shadow animate-slide-up" style="animation-delay: 0.2s">
            <div class="text-4xl mb-4">{{ treasureIcon }}</div>
            <Typography tag="h3" variant="title" size="xl" weight="semibold" class="mb-3">
              {{ collectTreasuresTitle }}
            </Typography>
            <Typography variant="body" size="md" class="text-muted-foreground">
              {{ collectTreasuresDesc }}
            </Typography>
          </Card>
        </div>
      </div>
    </section>

    <!-- PWA & Offline Features Section -->
    <section class="py-16 bg-accent/5">
      <div class="container mx-auto px-4">
        <Typography tag="h2" variant="title" size="4xl" weight="bold" class="text-center mb-12 text-accent">
          Play Anywhere, Anytime
        </Typography>
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card variant="default" class="p-8 hover:shadow-lg transition-shadow">
            <div class="text-5xl mb-4 text-center">📱</div>
            <Typography tag="h3" variant="title" size="xl" weight="semibold" class="mb-4 text-center">
              Progressive Web App
            </Typography>
            <Typography variant="body" size="md" class="text-muted-foreground text-center mb-4">
              Install {{ gameTitle }} on your device for a native app experience. Quick access from your home screen!
            </Typography>
            <div class="flex flex-wrap gap-2 justify-center">
              <span class="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">📲 Installable</span>
              <span class="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">⚡ Fast Loading</span>
              <span class="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">🔄 Auto Updates</span>
            </div>
          </Card>
          
          <Card variant="default" class="p-8 hover:shadow-lg transition-shadow">
            <div class="text-5xl mb-4 text-center">🌐</div>
            <Typography tag="h3" variant="title" size="xl" weight="semibold" class="mb-4 text-center">
              Offline Gaming
            </Typography>
            <Typography variant="body" size="md" class="text-muted-foreground text-center mb-4">
              Keep playing even without internet! Your battles are saved locally and synced when you're back online.
            </Typography>
            <div class="flex flex-wrap gap-2 justify-center">
              <span class="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">🎮 Offline Battles</span>
              <span class="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">💾 Auto Sync</span>
              <span class="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">📊 Progress Saved</span>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Game Mechanics Section -->
    <section class="py-16 bg-background">
      <div class="container mx-auto px-4">
        <Typography tag="h2" variant="title" size="4xl" weight="bold" class="text-center mb-12">
          How to Play
        </Typography>
        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card variant="outlined" class="p-6 text-center hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">⚔️</div>
            <Typography tag="h3" variant="title" size="lg" weight="semibold" class="mb-3">
              1. Choose Your {{ heroSingle }}
            </Typography>
            <Typography variant="body" size="sm" class="text-muted-foreground">
              Select from various {{ heroPluralLower }} with unique abilities and stats. Each {{ heroSingleLower }} has different strengths and weaknesses.
            </Typography>
          </Card>
          
          <Card variant="outlined" class="p-6 text-center hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">🏟️</div>
            <Typography tag="h3" variant="title" size="lg" weight="semibold" class="mb-3">
              2. Enter the {{ arenaName }}
            </Typography>
            <Typography variant="body" size="sm" class="text-muted-foreground">
              Battle enemies of increasing difficulty. Use strategy and timing to defeat powerful opponents and earn rewards.
            </Typography>
          </Card>
          
          <Card variant="outlined" class="p-6 text-center hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">🎁</div>
            <Typography tag="h3" variant="title" size="lg" weight="semibold" class="mb-3">
              3. Collect Rewards
            </Typography>
            <Typography variant="body" size="sm" class="text-muted-foreground">
              Gain XP, points, and rare loot. Level up your {{ heroSingleLower }} and climb the leaderboards!
            </Typography>
          </Card>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-muted">
      <div class="container mx-auto px-4">
        <Typography tag="h2" variant="title" size="4xl" weight="bold" class="text-center mb-12">
          Game Statistics
        </Typography>
        <div class="grid md:grid-cols-4 gap-6 text-center">
          <Card variant="muted" class="p-6 stat-card">
            <Typography variant="display" size="3xl" weight="bold" class="text-accent mb-2">
              {{ stats.players }}
            </Typography>
            <Typography variant="body" size="md" class="text-muted-foreground">
              {{ activePlayersText }}
            </Typography>
          </Card>
          <Card variant="muted" class="p-6 stat-card">
            <Typography variant="display" size="3xl" weight="bold" class="text-accent mb-2">
              {{ stats.heroes }}
            </Typography>
            <Typography variant="body" size="md" class="text-muted-foreground">
              {{ heroesTamedText }}
            </Typography>
          </Card>
          <Card variant="muted" class="p-6 stat-card">
            <Typography variant="display" size="3xl" weight="bold" class="text-accent mb-2">
              {{ stats.battles }}
            </Typography>
            <Typography variant="body" size="md" class="text-muted-foreground">
              {{ battlesFoughtText }}
            </Typography>
          </Card>
          <Card variant="muted" class="p-6 stat-card">
            <Typography variant="display" size="3xl" weight="bold" class="text-accent mb-2">
              {{ stats.treasures }}
            </Typography>
            <Typography variant="body" size="md" class="text-muted-foreground">
              {{ treasuresFoundText }}
            </Typography>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Button, Card, Typography } from '../components/ui'
import themeManager from '../lib/themeManager.js'

// Theme-aware text and icons
const gameTitle = computed(() => themeManager.getText('ui.game_title'))
const gameSubtitle = computed(() => themeManager.getText('ui.game_subtitle'))
const gameIcon = computed(() => themeManager.getAsset('hero_icon'))

// New game mechanics content
const heroSingle = computed(() => themeManager.getText('ui.hero_single'))
const heroPluralLower = computed(() => themeManager.getText('ui.hero_plural_lower'))
const heroSingleLower = computed(() => themeManager.getText('ui.hero_single_lower'))
const arenaName = computed(() => themeManager.getText('ui.arena_name'))

// Existing game mechanics content
const battleIcon = computed(() => themeManager.getAsset('battle_icon'))
const buildingIcon = computed(() => themeManager.getAsset('building_icon'))
const treasureIcon = computed(() => themeManager.getAsset('treasure_icon'))

const epicBattlesTitle = computed(() => themeManager.getText('ui.features_epic_battles'))
const epicBattlesDesc = computed(() => themeManager.getText('ui.features_epic_battles_desc'))
const buildKingdomTitle = computed(() => themeManager.getText('ui.features_build_kingdom'))
const buildKingdomDesc = computed(() => themeManager.getText('ui.features_build_kingdom_desc'))
const collectTreasuresTitle = computed(() => themeManager.getText('ui.features_collect_treasures'))
const collectTreasuresDesc = computed(() => themeManager.getText('ui.features_collect_treasures_desc'))

const activePlayersText = computed(() => themeManager.getText('ui.stats_active_players'))
const heroesTamedText = computed(() => themeManager.getText('ui.stats_heroes_tamed'))
const battlesFoughtText = computed(() => themeManager.getText('ui.stats_battles_fought'))
const treasuresFoundText = computed(() => themeManager.getText('ui.stats_treasures_found'))

const stats = ref({
  players: '0',
  heroes: '0',
  battles: '0',
  treasures: '0'
})

// Animate counting up numbers
const animateCount = (target, key, duration = 2000) => {
  const start = 0
  const increment = target / (duration / 16)
  let current = 0
  
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      stats.value[key] = target.toLocaleString()
      clearInterval(timer)
    } else {
      stats.value[key] = Math.floor(current).toLocaleString()
    }
  }, 16)
}

onMounted(() => {
  // Animate stats on page load
  setTimeout(() => {
    animateCount(15420, 'players')
    animateCount(8750, 'heroes')
    animateCount(124300, 'battles')
    animateCount(45600, 'treasures')
  }, 500)
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0.3;
}

.container {
  position: relative;
  z-index: 1;
}
</style>
