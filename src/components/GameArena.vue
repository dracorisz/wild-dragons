<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Game Header -->
    <div class="bg-foreground text-background border-b border-border p-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div>
            <Typography tag="h2" variant="title" size="xl" class="text-background">
              {{ authStore.activeHero?.name || yourHeroText }}
            </Typography>
            <Typography variant="caption" size="sm" class="text-background opacity-75">
              Level {{ authStore.currentLevel }}
            </Typography>
          </div>
        </div>
        
        <div class="flex items-center space-x-6">
          <!-- XP Progress -->
          <div class="text-right">
            <Typography variant="caption" size="sm" class="text-background opacity-75">
              XP Progress
            </Typography>
            <ProgressBar
              :current="authStore.xpProgress.current"
              :max="authStore.xpProgress.needed"
              variant="secondary"
              :show-value="false"
              class="w-32"
            />
            <Typography variant="caption" size="xs" class="text-background opacity-75">
              {{ authStore.xpProgress.current }}/{{ authStore.xpProgress.needed }}
            </Typography>
          </div>
          
          <!-- Points -->
          <div class="text-right">
            <Typography variant="caption" size="sm" class="text-background opacity-75">
              Points
            </Typography>
            <Typography variant="body" size="lg" weight="bold" class="text-background">
              {{ authStore.totalPoints.toLocaleString() }}
            </Typography>
          </div>
        </div>
      </div>
    </div>

    <!-- Battle Arena -->
    <div class="max-w-4xl mx-auto p-6">
      <Card variant="default">
        <!-- Battle Status -->
        <div v-if="!gameStore.currentBattle && !battling" class="text-center py-12">
          <Typography tag="h3" variant="title" size="2xl" class="mb-4">
            {{ arenaName }}
          </Typography>
          <Typography variant="body" size="md" class="text-muted-foreground mb-6">
            Ready to battle? Face fierce enemies and earn XP and points!
          </Typography>
          
          <!-- Battle Type Selection -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-2xl mx-auto">
            <Card 
              v-for="(battleType, key) in battleTypes" 
              :key="key"
              variant="outlined"
              :clickable="true"
              :class="{ 'border-primary': selectedBattleType === key }"
              @click="selectedBattleType = key"
            >
              <div class="text-center p-2">
                <Typography variant="label" size="sm" class="mb-1">
                  {{ battleType.name }}
                </Typography>
                <Typography variant="caption" size="xs" class="text-muted-foreground mb-2">
                  {{ battleType.description }}
                </Typography>
                <Typography variant="caption" size="xs" weight="bold">
                  {{ battleType.cost > 0 ? `Cost: ${battleType.cost} points` : 'Free' }}
                </Typography>
              </div>
            </Card>
          </div>
          
          <Button 
            @click="startBattle"
            variant="primary"
            size="lg"
            :disabled="!canAffordBattle"
          >
            Start {{ battleTypes[selectedBattleType]?.name || 'Battle' }}
          </Button>
        </div>

        <!-- Active Battle -->
        <div v-else-if="gameStore.currentBattle" class="space-y-6">
          <!-- Enemy Display -->
          <div class="text-center">
            <Card variant="outlined" class="inline-block">
              <Typography tag="h4" variant="title" size="xl" class="mb-2">
                {{ gameStore.currentBattle.enemy.name }}
              </Typography>
              <Typography variant="body" size="sm" class="text-muted-foreground mb-4">
                {{ gameStore.currentBattle.enemy.description }}
              </Typography>
              
              <!-- Enemy HP Bar -->
              <div class="w-48 mx-auto">
                <div class="flex justify-between mb-1">
                  <Typography variant="caption" size="xs" class="text-muted-foreground">
                    HP
                  </Typography>
                  <Typography variant="caption" size="xs" class="text-muted-foreground">
                    {{ currentEnemyHp }}/{{ gameStore.currentBattle.enemy.hp }}
                  </Typography>
                </div>
                <ProgressBar
                  :current="currentEnemyHp"
                  :max="gameStore.currentBattle.enemy.hp"
                  variant="destructive"
                  :show-value="false"
                />
              </div>
            </Card>
          </div>

          <!-- Battle Actions -->
          <div class="flex justify-center space-x-4">
            <Button 
              @click="attack" 
              :disabled="battling"
              variant="primary"
              size="md"
            >
              {{ battling ? 'Fighting...' : 'Attack' }}
            </Button>
            <Button 
              @click="defendAction" 
              :disabled="battling"
              variant="secondary"
              size="md"
            >
              Defend
            </Button>
            <Button 
              @click="usePotion" 
              :disabled="battling || !hasHealthPotion"
              variant="outline"
              size="md"
            >
              Use Potion
            </Button>
          </div>

          <!-- Player HP -->
          <div class="text-center">
            <Card variant="outlined" class="inline-block">
              <Typography tag="h4" variant="title" size="lg" class="mb-2">
                {{ yourHeroText }}
              </Typography>
              <div class="w-48 mx-auto">
                <div class="flex justify-between mb-1">
                  <Typography variant="caption" size="xs" class="text-muted-foreground">
                    HP
                  </Typography>
                  <Typography variant="caption" size="xs" class="text-muted-foreground">
                    {{ currentPlayerHp }}/{{ playerMaxHp }}
                  </Typography>
                </div>
                <ProgressBar
                  :current="currentPlayerHp"
                  :max="playerMaxHp"
                  variant="default"
                  :show-value="false"
                />
              </div>
            </Card>
          </div>
        </div>

        <!-- Battle Results -->
        <div v-if="battleResult" class="text-center py-8">
          <div class="mb-6">
            <Typography tag="h3" variant="title" size="2xl" class="mb-2">
              {{ getBattleResultText(battleResult.result) }}
            </Typography>
          </div>

          <!-- Rewards -->
          <div v-if="battleResult.result === 'win'" class="space-y-4">
            <Card variant="outlined" class="inline-block">
              <Typography variant="label" size="md" weight="bold" class="mb-2">
                Rewards Earned!
              </Typography>
              <div class="space-y-1">
                <Typography variant="body" size="sm">
                  +{{ battleResult.xpGained }} XP
                </Typography>
                <Typography variant="body" size="sm">
                  +{{ battleResult.pointsGained }} Points
                </Typography>
              </div>
            </Card>

            <!-- Loot -->
            <div v-if="battleResult.loot && battleResult.loot.length > 0" class="space-y-2">
              <Typography variant="label" size="md" weight="semibold">
                Loot Found:
              </Typography>
              <div class="space-y-1">
                <Card
                  v-for="item in battleResult.loot" 
                  :key="item.id"
                  variant="muted"
                  class="inline-block mr-2 mb-2"
                >
                  <Typography variant="caption" size="sm">
                    {{ item.name }} ({{ item.rarity }})
                  </Typography>
                </Card>
              </div>
            </div>
          </div>

          <Button 
            @click="battleResult = null" 
            variant="primary"
            size="lg"
            class="mt-6"
          >
            {{ continueText }}
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore, useGameStore } from '../stores'
import { Button, Card, Typography, ProgressBar } from './ui'
import { pwaManager } from '../lib/pwa.js'
import { offlineUtils } from '../lib/offlineStorage.js'
import themeManager from '../lib/themeManager.js'

const authStore = useAuthStore()
const gameStore = useGameStore()

// Theme-aware content
const yourHeroText = computed(() => themeManager.getText('ui.your_hero'))
const arenaName = computed(() => themeManager.getText('ui.arena_name'))
const continueText = computed(() => themeManager.getText('ui.continue'))

const getBattleResultText = (result) => {
  switch(result) {
    case 'win': return themeManager.getText('ui.battle_victory')
    case 'lose': return themeManager.getText('ui.battle_defeat') 
    default: return themeManager.getText('ui.battle_timeout')
  }
}

const battling = ref(false)
const battleResult = ref(null)
const currentPlayerHp = ref(100)
const currentEnemyHp = ref(100)
const playerMaxHp = ref(100)
const selectedBattleType = ref('normal')
const isOnline = ref(navigator.onLine)
const battleData = ref(null)
const offlineBattlesSaved = ref(0)

const battleTypes = computed(() => themeManager.getTheme().battle_types)

const canAffordBattle = computed(() => {
  const battleType = battleTypes.value[selectedBattleType.value]
  if (!battleType) return false
  return authStore.totalPoints >= (battleType.cost || 0)
})

const hasHealthPotion = computed(() => {
  return authStore.inventory.some(item => item.item_id === 'health_potion' && item.quantity > 0)
})

async function startBattle() {
  try {
    battleResult.value = null
    
    if (!authStore.activeHero) {
      alert(`No ${themeManager.getText('ui.hero_single').toLowerCase()} available for battle!`)
      return
    }

    // Check if player can afford battle
    const battleType = battleTypes.value[selectedBattleType.value]
    if (battleType.cost > 0 && authStore.totalPoints < battleType.cost) {
      alert(`Not enough points! Need ${battleType.cost} points.`)
      return
    }

    // Deduct battle cost
    if (battleType.cost > 0) {
      await authStore.awardPoints(-battleType.cost, `${battleType.name} entry fee`)
    }

    const battle = await gameStore.startBattle(
      authStore.currentLevel, 
      authStore.activeHero, 
      selectedBattleType.value
    )
    
    // Set initial HP values
    currentPlayerHp.value = battle.playerStats.currentHp
    playerMaxHp.value = battle.playerStats.maxHp
    currentEnemyHp.value = battle.enemy.hp
    
  } catch (error) {
    console.error('Failed to start battle:', error)
    alert('Failed to start battle. Please try again.')
  }
}

async function attack() {
  if (!gameStore.currentBattle || battling.value) return
  
  battling.value = true
  
  try {
    // Simulate attack animation delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Complete the battle
    let result
    try {
      result = await gameStore.completeBattle(authStore)
    } catch (error) {
      // If online battle fails and we're offline, save it for later sync
      if (!isOnline.value) {
        console.log('Offline - saving battle for later sync')
        result = await gameStore.completeBattleOffline(authStore)
        await saveOfflineBattle(result)
      } else {
        throw error // Re-throw if online but failed for other reasons
      }
    }
    
    // Update HP for display
    currentPlayerHp.value = result.finalPlayerHp
    currentEnemyHp.value = result.finalEnemyHp
    
    // Show result after a brief delay
    setTimeout(() => {
      battleResult.value = result
    }, 500)
    
  } catch (error) {
    console.error('Battle failed:', error)
    alert('Battle failed. Please try again.')
  } finally {
    battling.value = false
  }
}

function defendAction() {
  alert('Defend action - coming soon!')
}

function usePotion() {
  if (!hasHealthPotion.value) return
  
  // Heal player
  const healAmount = 50
  currentPlayerHp.value = Math.min(currentPlayerHp.value + healAmount, playerMaxHp.value)
  
  alert(`Used health potion! Restored ${healAmount} HP.`)
}

// PWA and offline functionality
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
  if (isOnline.value) {
    syncOfflineBattles()
  }
}

const syncOfflineBattles = async () => {
  if (!authStore.profile?.id) return
  
  try {
    const pendingBattles = await offlineUtils.getPendingBattles(authStore.profile.id)
    console.log(`Found ${pendingBattles.length} battles to sync`)
    
    for (const battle of pendingBattles) {
      try {
        // Attempt to sync with server
        const response = await fetch('/api/battle/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.accessToken}`
          },
          body: JSON.stringify(battle.battleData)
        })
        
        if (response.ok) {
          await offlineUtils.markBattleSynced(battle.id)
          console.log(`Battle ${battle.id} synced successfully`)
        }
      } catch (error) {
        console.error(`Failed to sync battle ${battle.id}:`, error)
      }
    }
    
    if (pendingBattles.length > 0) {
      pwaManager.showThemeNotification('Offline battles synced!', 'success')
    }
  } catch (error) {
    console.error('Failed to sync offline battles:', error)
  }
}

const saveOfflineBattle = async (battleResult) => {
  if (!authStore.profile?.id) return
  
  try {
    const battleId = await offlineUtils.saveBattleOffline(authStore.profile.id, {
      ...battleResult,
      timestamp: Date.now(),
      battleType: selectedBattleType.value,
      heroUsed: authStore.activeHero
    })
    
    if (battleId) {
      offlineBattlesSaved.value++
      pwaManager.showThemeNotification('Battle saved offline', 'info')
      
      // Request background sync when online
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        if ('sync' in registration) {
          registration.sync.register('background-battle')
        }
      }
    }
  } catch (error) {
    console.error('Failed to save offline battle:', error)
  }
}

onMounted(() => {
  // Load saved battle data if available
  loadOfflineGameState()
  
  // Set up online/offline event listeners
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  
  // Initial sync check
  if (isOnline.value) {
    syncOfflineBattles()
  }
})

onUnmounted(() => {
  // Save current game state when component unmounts
  saveOfflineGameState()
  
  // Clean up event listeners
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})

const loadOfflineGameState = async () => {
  if (!authStore.profile?.id) return
  
  try {
    const savedState = await offlineUtils.loadGameState(authStore.profile.id)
    if (savedState && savedState.gameArena) {
      const arenaState = savedState.gameArena
      if (arenaState.currentBattle) {
        // Restore battle state
        currentPlayerHp.value = arenaState.currentPlayerHp
        playerMaxHp.value = arenaState.playerMaxHp
        currentEnemyHp.value = arenaState.currentEnemyHp
        selectedBattleType.value = arenaState.selectedBattleType
        // Note: Actual battle state would need more complex restoration
      }
    }
  } catch (error) {
    console.error('Failed to load offline game state:', error)
  }
}

const saveOfflineGameState = async () => {
  if (!authStore.profile?.id) return
  
  try {
    const currentState = await offlineUtils.loadGameState(authStore.profile.id) || {}
    
    const gameArenaState = {
      currentPlayerHp: currentPlayerHp.value,
      playerMaxHp: playerMaxHp.value,
      currentEnemyHp: currentEnemyHp.value,
      selectedBattleType: selectedBattleType.value,
      lastSaved: Date.now()
    }
    
    await offlineUtils.saveGameState(authStore.profile.id, {
      ...currentState,
      gameArena: gameArenaState
    })
  } catch (error) {
    console.error('Failed to save offline game state:', error)
  }
}

// ...existing code...
</script>
