<template>
  <div class="profile-page min-h-screen bg-background">
    <!-- Profile Header -->
    <div class="bg-gradient-to-r from-primary to-accent text-background py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <!-- Avatar -->
            <div class="relative">
              <div class="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl">
                {{ profileData.avatar }}
              </div>
              <Button 
                @click="editAvatar"
                variant="secondary"
                size="sm"
                class="absolute bottom-0 right-0 w-10 h-10 rounded-full p-0"
              >
                ✏️
              </Button>
            </div>
            
            <!-- Profile Info -->
            <div class="flex-1 text-center md:text-left">
              <div class="flex items-center justify-center md:justify-start space-x-3 mb-2">
                <Typography tag="h1" variant="title" size="3xl" weight="bold" class="text-background">
                  {{ profileData.username }}
                </Typography>
                <span class="px-3 py-1 bg-white/20 rounded-full text-sm text-background">
                  Level {{ profileData.level }}
                </span>
              </div>
              <Typography variant="body" size="lg" class="opacity-90 mb-4 text-background">
                {{ profileData.title }}
              </Typography>
              <div class="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <div class="flex items-center space-x-1 text-background">
                  <span>📅</span>
                  <Typography variant="caption" size="sm" class="text-background">
                    Joined {{ profileData.joinDate }}
                  </Typography>
                </div>
                <div class="flex items-center space-x-1 text-background">
                  <span>🏆</span>
                  <Typography variant="caption" size="sm" class="text-background">
                    {{ profileData.achievements }} Achievements
                  </Typography>
                </div>
                <div class="flex items-center space-x-1 text-background">
                  <span>⭐</span>
                  <Typography variant="caption" size="sm" class="text-background">
                    {{ profileData.rating }} Rating
                  </Typography>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex flex-col space-y-3">
              <Button 
                @click="editProfile"
                variant="secondary"
                size="md"
                class="px-6"
              >
                Edit Profile
              </Button>
              <Button 
                @click="shareProfile"
                variant="outline"
                size="md"
                class="px-6 border-background text-background hover:bg-background hover:text-primary"
              >
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Stats Overview -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-xl font-semibold mb-6">Player Statistics</h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div class="stat-item">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-muted-foreground">Experience</span>
                      <span class="font-semibold">{{ profileData.experience.toLocaleString() }} XP</span>
                    </div>
                    <div class="bg-muted rounded-full h-2">
                      <div 
                        class="bg-accent h-2 rounded-full transition-all duration-500" 
                        :style="`width: ${(profileData.experience % 1000) / 10}%`"
                      ></div>
                    </div>
                  </div>

                  <div class="stat-item">
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">{{ totalBattlesText }}</span>
                      <span class="font-semibold">{{ profileData.battles.total }}</span>
                    </div>
                  </div>

                  <div class="stat-item">
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">{{ victoriesText }}</span>
                      <span class="font-semibold text-success">{{ profileData.battles.won }}</span>
                    </div>
                  </div>

                  <div class="stat-item">
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">{{ winRateText }}</span>
                      <span class="font-semibold text-accent">{{ Math.round((profileData.battles.won / profileData.battles.total) * 100) }}%</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="stat-item">
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">{{ heroesOwnedText }}</span>
                      <span class="font-semibold">{{ profileData.heroes.owned }}</span>
                    </div>
                  </div>

                  <div class="stat-item">
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">{{ rareHeroesText }}</span>
                      <span class="font-semibold text-accent">{{ profileData.heroes.rare }}</span>
                    </div>
                  </div>

                  <div class="stat-item">
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">{{ totalGoldText }}</span>
                      <span class="font-semibold">{{ profileData.gold.toLocaleString() }}</span>
                    </div>
                  </div>

                  <div class="stat-item">
                    <div class="flex justify-between items-center">
                      <span class="text-muted-foreground">{{ playTimeText }}</span>
                      <span class="font-semibold">{{ profileData.playTime }} {{ hoursText }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Achievements -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-xl font-semibold mb-6">Recent Achievements</h2>
              <div class="space-y-4">
                <div 
                  v-for="achievement in recentAchievements" 
                  :key="achievement.id"
                  class="achievement-item flex items-center space-x-4 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div class="text-3xl">{{ achievement.icon }}</div>
                  <div class="flex-1">
                    <h3 class="font-semibold">{{ achievement.title }}</h3>
                    <p class="text-sm text-muted-foreground">{{ achievement.description }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm text-accent font-semibold">+{{ achievement.points }} XP</div>
                    <div class="text-xs text-muted-foreground">{{ achievement.date }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Battle History -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-xl font-semibold mb-6">Recent Battles</h2>
              <div class="space-y-3">
                <div 
                  v-for="battle in battleHistory" 
                  :key="battle.id"
                  class="battle-item flex items-center justify-between p-4 rounded-lg bg-muted"
                >
                  <div class="flex items-center space-x-4">
                    <div 
                      class="w-3 h-3 rounded-full"
                      :class="battle.result === 'won' ? 'bg-success' : 'bg-destructive'"
                    ></div>
                    <div>
                      <div class="font-semibold">vs {{ battle.opponent }}</div>
                      <div class="text-sm text-muted-foreground">{{ battle.mode }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold capitalize" :class="battle.result === 'won' ? 'text-success' : 'text-destructive'">
                      {{ battle.result }}
                    </div>
                    <div class="text-sm text-muted-foreground">{{ battle.date }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-8">
            <!-- Hero Collection -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold mb-4">{{ collectionNameText }}</h2>
              <div class="grid grid-cols-3 gap-3">
                <div 
                  v-for="hero in heroCollection" 
                  :key="hero.id"
                  class="hero-card aspect-square rounded-lg border border-border bg-muted flex flex-col items-center justify-center text-center p-2 hover:bg-muted/80 transition-colors cursor-pointer"
                  @click="viewHero(hero)"
                >
                  <div class="text-2xl mb-1">{{ hero.icon }}</div>
                  <div class="text-xs font-medium">{{ hero.name }}</div>
                  <div class="text-xs text-muted-foreground">Lv.{{ hero.level }}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" class="w-full mt-4">
                {{ viewAllHeroesText }}
              </Button>
            </div>

            <!-- Friends/Guild -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold mb-4">Guild Members</h2>
              <div class="space-y-3">
                <div 
                  v-for="member in guildMembers" 
                  :key="member.id"
                  class="flex items-center space-x-3"
                >
                  <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                    {{ member.avatar }}
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-sm">{{ member.name }}</div>
                    <div class="text-xs text-muted-foreground">Level {{ member.level }}</div>
                  </div>
                  <div 
                    class="w-2 h-2 rounded-full"
                    :class="member.online ? 'bg-success' : 'bg-muted-foreground'"
                  ></div>
                </div>
              </div>
              <Button variant="outline" size="sm" class="w-full mt-4">
                Manage Guild
              </Button>
            </div>

            <!-- Settings -->
            <div class="bg-card rounded-lg border border-border p-6">
              <h2 class="text-lg font-semibold mb-4">Quick Settings</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm">Sound Effects</span>
                  <Checkbox v-model="settings.soundEffects" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Background Music</span>
                  <Checkbox v-model="settings.backgroundMusic" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Push Notifications</span>
                  <Checkbox v-model="settings.notifications" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Dark Theme</span>
                  <Checkbox v-model="settings.darkTheme" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Button, Card, Typography, ProgressBar, Checkbox } from '../components/ui'
import themeManager from '../lib/themeManager.js'

// Theme-aware content
const heroesOwnedText = computed(() => themeManager.getText('ui.heroes_owned'))
const viewAllHeroesText = computed(() => `View All ${themeManager.getText('ui.hero_plural')}`)
const rareHeroesText = computed(() => themeManager.getText('ui.rare_heroes'))
const collectionNameText = computed(() => themeManager.getText('ui.collection_name'))
const totalBattlesText = computed(() => themeManager.getText('ui.profile_total_battles'))
const victoriesText = computed(() => themeManager.getText('ui.profile_victories'))
const winRateText = computed(() => themeManager.getText('ui.profile_win_rate'))
const totalGoldText = computed(() => themeManager.getText('ui.profile_total_gold'))
const playTimeText = computed(() => themeManager.getText('ui.profile_play_time'))
const hoursText = computed(() => themeManager.getText('ui.profile_hours'))

const profileData = reactive({
  username: 'HeroMaster',
  avatar: '🧙‍♂️',
  title: `Legendary ${themeManager.getText('ui.hero_single')} Tamer`,
  level: 42,
  joinDate: 'March 2024',
  achievements: 127,
  rating: 2847,
  experience: 284750,
  battles: {
    total: 1247,
    won: 892
  },
  heroes: {
    owned: 23,
    rare: 8
  },
  gold: 156420,
  playTime: 342
})

const recentAchievements = ref([
  {
    id: 1,
    icon: '🏆',
    title: `${themeManager.getText('ui.hero_single')} Slayer`,
    description: `Defeated 100 ${themeManager.getText('ui.hero_plural').toLowerCase()} in battle`,
    points: 500,
    date: '2 days ago'
  },
  {
    id: 2,
    icon: '💎',
    title: 'Treasure Hunter',
    description: 'Found 50 rare treasures',
    points: 300,
    date: '1 week ago'
  },
  {
    id: 3,
    icon: '⭐',
    title: 'Rising Star',
    description: 'Reached level 40',
    points: 1000,
    date: '2 weeks ago'
  }
])

const battleHistory = ref([
  {
    id: 1,
    opponent: 'FireMaster99',
    mode: 'Ranked Arena',
    result: 'won',
    date: '2 hours ago'
  },
  {
    id: 2,
    opponent: 'IceQueen',
    mode: 'Tournament',
    result: 'lost',
    date: '5 hours ago'
  },
  {
    id: 3,
    opponent: 'ShadowLord',
    mode: 'Casual Battle',
    result: 'won',
    date: '1 day ago'
  },
  {
    id: 4,
    opponent: 'StormRider',
    mode: 'Guild War',
    result: 'won',
    date: '2 days ago'
  }
])

const heroCollection = ref([
  { id: 1, name: 'Flame', icon: '🔥', level: 25 },
  { id: 2, name: 'Frost', icon: '❄️', level: 23 },
  { id: 3, name: 'Storm', icon: '⚡', level: 28 },
  { id: 4, name: 'Earth', icon: '🌍', level: 22 },
  { id: 5, name: 'Light', icon: '✨', level: 30 },
  { id: 6, name: 'Shadow', icon: '🌑', level: 27 }
])

const guildMembers = ref([
  { id: 1, name: 'AlexTheGreat', avatar: '👑', level: 45, online: true },
  { id: 2, name: 'MysticMage', avatar: '🧙‍♀️', level: 38, online: true },
  { id: 3, name: 'IronWarrior', avatar: '⚔️', level: 41, online: false },
  { id: 4, name: 'NatureSpirit', avatar: '🧚‍♀️', level: 36, online: true }
])

const settings = reactive({
  soundEffects: true,
  backgroundMusic: true,
  notifications: true,
  darkTheme: false
})

// Methods
const editProfile = () => {
  console.log('Edit profile clicked')
}

const editAvatar = () => {
  console.log('Edit avatar clicked')
}

const shareProfile = () => {
  console.log('Share profile clicked')
}

const viewHero = (hero) => {
  console.log('View hero:', hero.name)
}
</script>

<style scoped>
.stat-item {
  transition: all 0.3s ease;
}

.achievement-item {
  transition: all 0.3s ease;
}

.achievement-item:hover {
  transform: translateX(5px);
}

.battle-item {
  transition: all 0.3s ease;
}

.hero-card {
  transition: all 0.3s ease;
}

.hero-card:hover {
  transform: scale(1.05);
}
</style>
