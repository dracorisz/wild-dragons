import { defineStore } from 'pinia'
import { supabase, auth, game } from '../lib/supabase.js'
import { gameEngine } from '../lib/gameEngine.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    session: null,
    loading: false,
    heroes: [], // theme-agnostic: dragons/puppies/etc
    inventory: []
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentLevel: (state) => state.profile?.current_level ?? 1,
    totalXP: (state) => state.profile?.total_xp ?? 0,
    totalPoints: (state) => state.profile?.total_points ?? 0,
    activeHero: (state) => state.heroes.find(h => h.is_active) || state.heroes[0],
    xpProgress: (state) => {
      if (!state.profile) return { current: 0, needed: 100, percentage: 0 }
      return gameEngine.getXPProgress(state.profile.total_xp, state.profile.current_level)
    }
  },

  actions: {
    async initialize() {
      this.loading = true
      try {
        const { data: { session } } = await supabase.auth.getSession()
        this.session = session
        
        if (session?.user) {
          this.user = session.user
          await this.loadProfile()
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          this.session = session
          this.user = session?.user || null
          
          if (session?.user) {
            await this.loadProfile()
          } else {
            this.profile = null
            this.heroes = []
            this.inventory = []
          }
        })
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadProfile() {
      if (!this.user) return
      
      try {
        const profile = await game.getUserProfile(this.user.id)
        this.profile = profile
        
        // Load related data
        await Promise.all([
          this.loadHeroes(),
          this.loadInventory()
        ])
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    },

    async loadHeroes() {
      if (!this.user) return
      
      try {
        this.heroes = await game.getUserHeroes(this.user.id)
      } catch (error) {
        console.error('Failed to load heroes:', error)
      }
    },

    async loadInventory() {
      if (!this.user) return
      
      try {
        this.inventory = await game.getUserInventory(this.user.id)
      } catch (error) {
        console.error('Failed to load inventory:', error)
      }
    },

    async signUp(email, password, username, referralCode = null) {
      this.loading = true
      try {
        const result = await auth.signUp(email, password, username, referralCode)
        return result
      } catch (error) {
        console.error('Sign up error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async signIn(email, password) {
      this.loading = true
      try {
        await auth.signIn(email, password)
      } catch (error) {
        console.error('Sign in error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      this.loading = true
      try {
        await auth.signOut()
      } catch (error) {
        console.error('Sign out error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async awardXP(amount, reason, metadata = null) {
      if (!this.user) return
      
      try {
        const result = await game.awardXP(this.user.id, amount, reason, metadata)
        
        // Update local state
        if (this.profile) {
          this.profile.total_xp = result.total_xp
          this.profile.current_level = result.new_level
        }
        
        return result
      } catch (error) {
        console.error('Failed to award XP:', error)
        throw error
      }
    },

    async awardPoints(amount, reason, metadata = null) {
      if (!this.user) return
      
      try {
        const newTotal = await game.awardPoints(this.user.id, amount, reason, metadata)
        
        // Update local state
        if (this.profile) {
          this.profile.total_points = newTotal
        }
        
        return newTotal
      } catch (error) {
        console.error('Failed to award points:', error)
        throw error
      }
    }
  }
})

// Game Store for enhanced battle functionality
export const useGameStore = defineStore('game', {
  state: () => ({
    currentBattle: null,
    battleHistory: [],
    loading: false,
    consecutiveWins: 0,
    lastBattleDate: null,
    selectedBattleType: 'normal' // normal, elite, boss, legendary
  }),

  getters: {
    comboMultiplier: (state) => {
      return gameEngine.calculateComboMultiplier(state.consecutiveWins)
    },
    
    dailyBonus: (state) => {
      return gameEngine.calculateDailyBonus(state.lastBattleDate)
    }
  },

  actions: {
    async startBattle(playerLevel, dragon, battleType = 'normal') {
      this.loading = true
      try {
        const battle = gameEngine.generateBattle(playerLevel, dragon, battleType)
        this.currentBattle = battle
        this.selectedBattleType = battleType
        return battle
      } catch (error) {
        console.error('Failed to start battle:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async completeBattle(authStore) {
      if (!this.currentBattle || !authStore.user) return null
      
      try {
        const result = gameEngine.simulateBattle(
          this.currentBattle.playerStats,
          this.currentBattle.enemy,
          this.currentBattle.battleSeed,
          this.currentBattle.environment
        )
        
        // Apply combo and daily bonuses
        const comboBonus = this.comboMultiplier
        const dailyBonus = this.dailyBonus
        
        result.xpGained = Math.round(result.xpGained * comboBonus * dailyBonus.xpBonus)
        result.pointsGained = Math.round(result.pointsGained * comboBonus * dailyBonus.pointsBonus)
        
        // Update consecutive wins
        if (result.result === 'win') {
          this.consecutiveWins += 1
        } else {
          this.consecutiveWins = 0
        }
        
        this.lastBattleDate = new Date().toISOString()
        
        // Check for achievements
        const achievements = gameEngine.checkBattleAchievements(result, this.currentBattle.playerStats)
        result.achievements = achievements
        
        // Award achievement bonuses
        let achievementXP = 0
        let achievementPoints = 0
        achievements.forEach(achievement => {
          achievementXP += achievement.xpReward || 0
          achievementPoints += achievement.pointsReward || 0
        })
        
        result.xpGained += achievementXP
        result.pointsGained += achievementPoints
        
        // Log battle to database
        await game.logBattle(
          authStore.user.id,
          this.currentBattle.enemy.name,
          this.currentBattle.enemy.level,
          result.result === 'win' ? 'victory' : 'defeat',
          result.xpGained,
          result.pointsGained,
          result.loot,
          {
            ...this.currentBattle,
            battleType: this.selectedBattleType,
            environment: this.currentBattle.environment,
            consecutiveWins: this.consecutiveWins,
            achievements: achievements
          }
        )
        
        // Award XP and points
        if (result.xpGained > 0) {
          await authStore.awardXP(result.xpGained, 'Battle victory')
        }
        if (result.pointsGained > 0) {
          await authStore.awardPoints(result.pointsGained, 'Battle victory')
        }
        
        // Add loot to inventory
        if (result.loot && result.loot.length > 0) {
          await authStore.addToInventory(result.loot)
        }
        
        // Clear current battle
        this.currentBattle = null
        
        return result
      } catch (error) {
        console.error('Failed to complete battle:', error)
        throw error
      }
    },

    async completeBattleOffline(authStore) {
      if (!this.currentBattle || !authStore.user) return null
      
      try {
        // Same logic as online battle but without server communication
        const result = gameEngine.simulateBattle(
          this.currentBattle.playerStats,
          this.currentBattle.enemy,
          this.currentBattle.battleSeed,
          this.currentBattle.environment
        )
        
        // Apply combo and daily bonuses
        const comboBonus = this.comboMultiplier
        const dailyBonus = this.dailyBonus
        
        result.xpGained = Math.round(result.xpGained * comboBonus * dailyBonus.xpBonus)
        result.pointsGained = Math.round(result.pointsGained * comboBonus * dailyBonus.pointsBonus)
        
        // Update local state (will be synced later)
        if (result.result === 'win') {
          this.consecutiveWins += 1
        } else {
          this.consecutiveWins = 0
        }
        
        // Apply rewards locally (temporary until sync)
        if (authStore.awardXP && authStore.awardPoints) {
          await authStore.awardXP(result.xpGained, 'Offline Battle')
          await authStore.awardPoints(result.pointsGained, 'Offline Battle')
        }
        
        // Handle loot
        if (result.lootGained && result.lootGained.length > 0) {
          result.lootGained.forEach(loot => {
            authStore.addToInventory(loot.item_id, loot.quantity)
          })
        }
        
        // Clear current battle
        this.currentBattle = null
        
        // Mark result for sync
        result.needsSync = true
        result.offlineBattle = true
        
        return result
      } catch (error) {
        console.error('Failed to complete offline battle:', error)
        throw error
      }
    }
  }
})
