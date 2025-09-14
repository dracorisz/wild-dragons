import { themeManager } from './themeManager.js'

export class GameEngine {
  constructor() {
    // Get enemies data from current theme
    const theme = themeManager.getTheme()
    this.enemies = theme.enemies || {}
    this.scaling = theme.scaling || { health: 1.2, damage: 1.1, xp: 1.0, gold: 1.0 }
    this.lootItems = theme.loot || {}
    this.battleTypes = ['normal', 'elite', 'boss', 'legendary']
    this.statusEffects = ['poison', 'burn', 'freeze', 'stun', 'rage', 'shield']
    this.criticalHitChance = 0.15
    this.dodgeChance = 0.08
  }

  // Generate battle seed for anti-cheat
  generateBattleSeed() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  // Generate enhanced battle with multiple features
  generateBattle(playerLevel, dragon, battleType = 'normal') {
    const battleSeed = this.generateBattleSeed()
    let enemy = this.selectEnemy(playerLevel, battleType)
    enemy = this.scaleEnemy(enemy, playerLevel, battleType)
    
    const playerStats = this.calculatePlayerStats(playerLevel, dragon)
    
    // Add environmental effects for elite+ battles
    const environment = battleType !== 'normal' ? this.generateEnvironment() : null
    
    return {
      battleSeed,
      enemy,
      playerStats,
      environment,
      battleType,
      startTime: Date.now()
    }
  }

  // Enhanced enemy selection with battle types
  selectEnemy(playerLevel, battleType = 'normal') {
    let availableEnemies = Object.entries(this.enemies).filter(([_, enemy]) => {
      const [minLevel, maxLevel] = enemy.level_brackets
      return playerLevel >= minLevel && playerLevel <= maxLevel
    })

    // Filter by battle type
    if (battleType === 'elite') {
      availableEnemies = availableEnemies.filter(([_, enemy]) => 
        enemy.rarity === 'rare' || enemy.rarity === 'elite'
      )
    } else if (battleType === 'boss') {
      availableEnemies = availableEnemies.filter(([_, enemy]) => 
        enemy.rarity === 'elite' || enemy.rarity === 'legendary'
      )
    } else if (battleType === 'legendary') {
      availableEnemies = availableEnemies.filter(([_, enemy]) => 
        enemy.rarity === 'legendary'
      )
    }

    if (availableEnemies.length === 0) {
      // Fallback to any available enemy
      availableEnemies = Object.entries(this.enemies).filter(([_, enemy]) => {
        const [minLevel, maxLevel] = enemy.level_brackets
        return playerLevel >= minLevel && playerLevel <= maxLevel
      })
    }

    // Weighted random selection
    const totalWeight = availableEnemies.reduce((sum, [_, enemy]) => sum + enemy.spawn_chance, 0)
    let random = Math.random() * totalWeight
    
    for (const [type, enemy] of availableEnemies) {
      random -= enemy.spawn_chance
      if (random <= 0) {
        return { type, ...enemy }
      }
    }

    // Fallback
    const [type, enemy] = availableEnemies[0]
    return { type, ...enemy }
  }

  // Enhanced enemy scaling with battle type modifiers
  scaleEnemy(enemy, playerLevel, battleType = 'normal') {
    const typeMultipliers = {
      normal: 1.0,
      elite: 1.5,
      boss: 2.0,
      legendary: 3.0
    }
    
    const multiplier = typeMultipliers[battleType] || 1.0
    
    const hp = Math.round(enemy.base_hp * Math.pow(playerLevel, this.scaling.hp_exponent) * multiplier)
    const attack = Math.round(enemy.base_attack * Math.pow(playerLevel, this.scaling.attack_exponent) * multiplier)
    const xp = Math.round(enemy.base_xp * Math.pow(playerLevel, this.scaling.xp_exponent) * multiplier)
    const points = Math.round(enemy.base_points * Math.pow(playerLevel, this.scaling.points_exponent) * multiplier)

    // Add special abilities for elite+ enemies
    const abilities = battleType !== 'normal' ? this.generateEnemyAbilities(enemy, battleType) : []
    
    return {
      ...enemy,
      hp,
      maxHp: hp,
      attack,
      xp_reward: xp,
      points_reward: points,
      level: playerLevel,
      battleType,
      abilities,
      statusEffects: []
    }
  }

  // Enhanced player stats calculation with equipment bonuses
  calculatePlayerStats(level, dragon) {
    const baseAttack = dragon.attack || 10
    const baseDefense = dragon.defense || 5
    const baseHp = dragon.max_hp || 100
    const baseSpeed = dragon.speed || 50
    const baseCritRate = dragon.crit_rate || 0.05
    const baseDodgeRate = dragon.dodge_rate || 0.03

    // Equipment bonuses (if equipped)
    const equipmentBonus = this.calculateEquipmentBonus(dragon.equipment || {})

    return {
      attack: Math.round((baseAttack * (1 + 0.04 * (level - 1))) + equipmentBonus.attack),
      defense: Math.round((baseDefense * (1 + 0.03 * (level - 1))) + equipmentBonus.defense),
      maxHp: Math.round((baseHp * (1 + 0.05 * (level - 1))) + equipmentBonus.hp),
      currentHp: dragon.current_hp || Math.round(baseHp * (1 + 0.05 * (level - 1))),
      speed: Math.round((baseSpeed * (1 + 0.02 * (level - 1))) + equipmentBonus.speed),
      critRate: Math.min(0.75, baseCritRate + (level * 0.001) + equipmentBonus.critRate),
      dodgeRate: Math.min(0.5, baseDodgeRate + (level * 0.0005) + equipmentBonus.dodgeRate),
      statusEffects: [],
      abilities: dragon.abilities || []
    }
  }

  // Calculate equipment bonuses
  calculateEquipmentBonus(equipment) {
    const bonus = {
      attack: 0,
      defense: 0,
      hp: 0,
      speed: 0,
      critRate: 0,
      dodgeRate: 0
    }

    Object.values(equipment).forEach(item => {
      if (item && item.stats) {
        Object.keys(bonus).forEach(stat => {
          bonus[stat] += item.stats[stat] || 0
        })
      }
    })

    return bonus
  }

  // Enhanced battle simulation with status effects, crits, dodges
  simulateBattle(playerStats, enemy, battleSeed, environment = null) {
    // Use seed for deterministic randomness (anti-cheat)
    let seedValue = this.hashCode(battleSeed)
    const random = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280
      return seedValue / 233280
    }

    let playerHp = playerStats.currentHp
    let enemyHp = enemy.hp
    let turns = 0
    const maxTurns = 150 // Prevent infinite battles

    const battleLog = []
    
    // Initialize status effects
    let playerStatusEffects = [...playerStats.statusEffects]
    let enemyStatusEffects = [...enemy.statusEffects]

    while (playerHp > 0 && enemyHp > 0 && turns < maxTurns) {
      turns++

      // Apply status effect damage at turn start
      const playerStatusDamage = this.applyStatusEffects(playerStatusEffects, random)
      const enemyStatusDamage = this.applyStatusEffects(enemyStatusEffects, random)
      
      playerHp -= playerStatusDamage
      enemyHp -= enemyStatusDamage
      
      if (playerStatusDamage > 0) {
        battleLog.push({ 
          turn: turns, 
          type: 'status_damage', 
          target: 'player',
          damage: playerStatusDamage, 
          playerHp: Math.max(0, playerHp) 
        })
      }
      
      if (enemyStatusDamage > 0) {
        battleLog.push({ 
          turn: turns, 
          type: 'status_damage', 
          target: 'enemy',
          damage: enemyStatusDamage, 
          enemyHp: Math.max(0, enemyHp) 
        })
      }

      if (playerHp <= 0 || enemyHp <= 0) break

      // Determine turn order based on speed
      const playerFirst = playerStats.speed >= enemy.speed || random() < 0.5

      if (playerFirst) {
        // Player turn
        const playerAction = this.executePlayerTurn(playerStats, enemy, random, environment)
        enemyHp -= playerAction.damage
        
        if (playerAction.statusEffect) {
          enemyStatusEffects.push(playerAction.statusEffect)
        }
        
        battleLog.push({ 
          turn: turns, 
          type: 'player_attack', 
          ...playerAction,
          enemyHp: Math.max(0, enemyHp) 
        })

        if (enemyHp <= 0) break

        // Enemy turn
        const enemyAction = this.executeEnemyTurn(enemy, playerStats, random, environment)
        playerHp -= enemyAction.damage
        
        if (enemyAction.statusEffect) {
          playerStatusEffects.push(enemyAction.statusEffect)
        }
        
        battleLog.push({ 
          turn: turns, 
          type: 'enemy_attack', 
          ...enemyAction,
          playerHp: Math.max(0, playerHp) 
        })
      } else {
        // Enemy first (same logic but reversed order)
        const enemyAction = this.executeEnemyTurn(enemy, playerStats, random, environment)
        playerHp -= enemyAction.damage
        
        if (enemyAction.statusEffect) {
          playerStatusEffects.push(enemyAction.statusEffect)
        }
        
        battleLog.push({ 
          turn: turns, 
          type: 'enemy_attack', 
          ...enemyAction,
          playerHp: Math.max(0, playerHp) 
        })

        if (playerHp <= 0) break

        const playerAction = this.executePlayerTurn(playerStats, enemy, random, environment)
        enemyHp -= playerAction.damage
        
        if (playerAction.statusEffect) {
          enemyStatusEffects.push(playerAction.statusEffect)
        }
        
        battleLog.push({ 
          turn: turns, 
          type: 'player_attack', 
          ...playerAction,
          enemyHp: Math.max(0, enemyHp) 
        })
      }

      // Reduce status effect durations
      playerStatusEffects = this.reduceStatusEffectDurations(playerStatusEffects)
      enemyStatusEffects = this.reduceStatusEffectDurations(enemyStatusEffects)
    }

    const result = enemyHp <= 0 ? 'win' : (playerHp <= 0 ? 'lose' : 'timeout')
    const duration = turns * 2 // Roughly 2 seconds per turn

    // Calculate rewards with bonuses
    const baseXp = result === 'win' ? enemy.xp_reward : Math.round(enemy.xp_reward * 0.1)
    const basePoints = result === 'win' ? enemy.points_reward : Math.round(enemy.points_reward * 0.1)
    
    // Apply environment bonuses
    const xpBonus = environment?.xpBonus || 1.0
    const pointsBonus = environment?.pointsBonus || 1.0
    
    return {
      result,
      duration,
      turns,
      battleLog,
      finalPlayerHp: Math.max(0, playerHp),
      finalEnemyHp: Math.max(0, enemyHp),
      xpGained: Math.round(baseXp * xpBonus),
      pointsGained: Math.round(basePoints * pointsBonus),
      loot: result === 'win' ? this.generateLoot(enemy, battleSeed) : [],
      environment,
      battleType: enemy.battleType || 'normal'
    }
  }

  // Execute player turn with enhanced mechanics
  executePlayerTurn(playerStats, enemy, random, environment) {
    let damage = 0
    let actionType = 'attack'
    let isCritical = false
    let statusEffect = null

    // Check for dodge
    if (random() < enemy.dodgeRate || 0.05) {
      return {
        damage: 0,
        actionType: 'miss',
        isCritical: false,
        statusEffect: null
      }
    }

    // Check for critical hit
    isCritical = random() < (playerStats.critRate || this.criticalHitChance)
    
    // Calculate base damage
    let baseDamage = playerStats.attack * (0.8 + random() * 0.4)
    
    // Apply enemy defense
    baseDamage = Math.max(1, baseDamage - (enemy.defense || enemy.attack * 0.1))
    
    // Apply critical hit multiplier
    if (isCritical) {
      baseDamage *= 2.0
    }
    
    // Environmental effects
    if (environment?.playerDamageMultiplier) {
      baseDamage *= environment.playerDamageMultiplier
    }
    
    damage = Math.round(baseDamage)

    // Chance for status effects based on abilities
    if (playerStats.abilities && playerStats.abilities.length > 0) {
      const ability = playerStats.abilities[Math.floor(random() * playerStats.abilities.length)]
      if (random() < (ability.chance || 0.1)) {
        statusEffect = {
          type: ability.effect,
          duration: ability.duration || 3,
          damage: ability.damage || 0
        }
      }
    }

    return {
      damage,
      actionType,
      isCritical,
      statusEffect
    }
  }

  // Execute enemy turn with enhanced mechanics
  executeEnemyTurn(enemy, playerStats, random, environment) {
    let damage = 0
    let actionType = 'attack'
    let isCritical = false
    let statusEffect = null

    // Check for player dodge
    if (random() < (playerStats.dodgeRate || this.dodgeChance)) {
      return {
        damage: 0,
        actionType: 'miss',
        isCritical: false,
        statusEffect: null
      }
    }

    // Enemy abilities (elite+ enemies)
    if (enemy.abilities && enemy.abilities.length > 0 && random() < 0.3) {
      const ability = enemy.abilities[Math.floor(random() * enemy.abilities.length)]
      actionType = 'ability'
      
      damage = Math.round(ability.damage || enemy.attack * 1.5)
      
      if (ability.statusEffect) {
        statusEffect = {
          type: ability.statusEffect,
          duration: 3,
          damage: Math.round(enemy.attack * 0.2)
        }
      }
    } else {
      // Normal attack
      isCritical = random() < 0.1 // Enemy crit chance
      
      let baseDamage = enemy.attack * (0.8 + random() * 0.4)
      baseDamage = Math.max(1, baseDamage - playerStats.defense * 0.1)
      
      if (isCritical) {
        baseDamage *= 1.8
      }
      
      if (environment?.enemyDamageMultiplier) {
        baseDamage *= environment.enemyDamageMultiplier
      }
      
      damage = Math.round(baseDamage)
    }

    return {
      damage,
      actionType,
      isCritical,
      statusEffect
    }
  }

  // Apply status effects and return damage
  applyStatusEffects(statusEffects, random) {
    let totalDamage = 0
    
    statusEffects.forEach(effect => {
      switch (effect.type) {
        case 'poison':
          totalDamage += effect.damage || 5
          break
        case 'burn':
          totalDamage += (effect.damage || 8) + Math.round(random() * 3)
          break
        case 'freeze':
          // Freeze reduces next attack damage by 50%
          break
        case 'stun':
          // Stun skips next turn (handled in battle logic)
          break
      }
    })
    
    return totalDamage
  }

  // Reduce status effect durations
  reduceStatusEffectDurations(statusEffects) {
    return statusEffects
      .map(effect => ({ ...effect, duration: effect.duration - 1 }))
      .filter(effect => effect.duration > 0)
  }

  // Generate environment for special battles
  generateEnvironment() {
    const environments = [
      {
        name: 'Burning Battlefield',
        description: 'Flames engulf the arena',
        playerDamageMultiplier: 1.2,
        enemyDamageMultiplier: 1.1,
        xpBonus: 1.15,
        pointsBonus: 1.1
      },
      {
        name: 'Frozen Wasteland',
        description: 'Ice slows all movements',
        playerDamageMultiplier: 0.9,
        enemyDamageMultiplier: 0.9,
        xpBonus: 1.1,
        pointsBonus: 1.2
      },
      {
        name: 'Lightning Storm',
        description: 'Electric energy crackles in the air',
        playerDamageMultiplier: 1.5,
        enemyDamageMultiplier: 1.3,
        xpBonus: 1.25,
        pointsBonus: 1.15
      },
      {
        name: 'Shadow Realm',
        description: 'Darkness obscures vision',
        playerDamageMultiplier: 0.8,
        enemyDamageMultiplier: 1.4,
        xpBonus: 1.3,
        pointsBonus: 1.25
      }
    ]
    
    return environments[Math.floor(Math.random() * environments.length)]
  }

  // Generate enemy abilities based on type and battle tier
  generateEnemyAbilities(enemy, battleType) {
    const abilities = []
    
    const commonAbilities = [
      {
        name: 'Heavy Strike',
        damage: enemy.base_attack * 1.5,
        chance: 0.2
      },
      {
        name: 'Poison Spit',
        damage: enemy.base_attack * 0.8,
        statusEffect: 'poison',
        chance: 0.15
      }
    ]
    
    const eliteAbilities = [
      {
        name: 'Flame Breath',
        damage: enemy.base_attack * 2.0,
        statusEffect: 'burn',
        chance: 0.25
      },
      {
        name: 'Ice Blast',
        damage: enemy.base_attack * 1.2,
        statusEffect: 'freeze',
        chance: 0.2
      }
    ]
    
    const legendaryAbilities = [
      {
        name: 'Devastating Roar',
        damage: enemy.base_attack * 3.0,
        statusEffect: 'stun',
        chance: 0.3
      },
      {
        name: 'Ancient Magic',
        damage: enemy.base_attack * 2.5,
        statusEffect: 'curse',
        chance: 0.25
      }
    ]
    
    switch (battleType) {
      case 'elite':
        abilities.push(...commonAbilities.slice(0, 1), ...eliteAbilities.slice(0, 1))
        break
      case 'boss':
        abilities.push(...commonAbilities, ...eliteAbilities.slice(0, 1))
        break
      case 'legendary':
        abilities.push(...eliteAbilities, ...legendaryAbilities.slice(0, 1))
        break
    }
    
    return abilities
  }
  // Enhanced loot generation with rarity bonuses
  generateLoot(enemy, battleSeed) {
    let seedValue = this.hashCode(battleSeed + '_loot')
    const random = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280
      return seedValue / 233280
    }

    const loot = []
    
    // Base loot from enemy table
    for (const [itemId, chance] of Object.entries(enemy.loot_table)) {
      let adjustedChance = chance
      
      // Increase chance for elite+ enemies
      if (enemy.battleType === 'elite') adjustedChance *= 1.5
      else if (enemy.battleType === 'boss') adjustedChance *= 2.0
      else if (enemy.battleType === 'legendary') adjustedChance *= 3.0
      
      if (random() < adjustedChance) {
        const item = this.lootItems[itemId]
        if (item) {
          const quantity = item.type === 'currency' ? 
            Math.round(10 + random() * 50 * (enemy.battleType === 'legendary' ? 3 : 1)) : 1
            
          loot.push({
            itemId,
            ...item,
            quantity
          })
        }
      }
    }

    // Bonus rare loot for elite+ battles
    if (enemy.battleType !== 'normal' && random() < 0.15) {
      const bonusLoot = this.generateBonusLoot(enemy, random)
      if (bonusLoot) loot.push(bonusLoot)
    }

    return loot
  }

  // Generate bonus loot for special battles
  generateBonusLoot(enemy, random) {
    const bonusItems = [
      {
        itemId: 'enchanted_gem',
        name: 'Enchanted Gem',
        type: 'upgrade',
        rarity: 'rare',
        description: 'A magical gem that enhances dragon abilities'
      },
      {
        itemId: 'ancient_scroll',
        name: 'Ancient Scroll',
        type: 'knowledge',
        rarity: 'epic',
        description: 'Contains forgotten dragon techniques'
      },
      {
        itemId: 'dragon_scale',
        name: 'Dragon Scale',
        type: 'crafting',
        rarity: 'legendary',
        description: 'A scale from an ancient dragon'
      }
    ]
    
    return bonusItems[Math.floor(random() * bonusItems.length)]
  }

  // Battle combo system
  calculateComboMultiplier(consecutiveWins) {
    if (consecutiveWins < 3) return 1.0
    if (consecutiveWins < 5) return 1.1
    if (consecutiveWins < 10) return 1.25
    if (consecutiveWins < 20) return 1.5
    return 2.0 // Max combo bonus
  }

  // Daily bonus system
  calculateDailyBonus(lastPlayDate) {
    const today = new Date().toDateString()
    const lastPlay = lastPlayDate ? new Date(lastPlayDate).toDateString() : null
    
    if (lastPlay !== today) {
      // First play of the day
      return {
        xpBonus: 1.5,
        pointsBonus: 1.3,
        message: 'Daily Bonus Active! +50% XP, +30% Points'
      }
    }
    
    return {
      xpBonus: 1.0,
      pointsBonus: 1.0,
      message: null
    }
  }

  // Achievement system integration
  checkBattleAchievements(battleResult, playerStats) {
    const achievements = []
    
    // Win streak achievements
    if (battleResult.consecutiveWins === 5) {
      achievements.push({
        id: 'win_streak_5',
        name: 'Unstoppable',
        description: 'Win 5 battles in a row',
        xpReward: 500,
        pointsReward: 100
      })
    }
    
    // Damage achievements
    const maxDamage = Math.max(...battleResult.battleLog
      .filter(log => log.type === 'player_attack')
      .map(log => log.damage)
    )
    
    if (maxDamage > 200) {
      achievements.push({
        id: 'heavy_hitter',
        name: 'Heavy Hitter',
        description: 'Deal over 200 damage in a single attack',
        xpReward: 250,
        pointsReward: 50
      })
    }
    
    // Perfect victory (no damage taken)
    if (battleResult.result === 'win' && battleResult.finalPlayerHp === playerStats.maxHp) {
      achievements.push({
        id: 'perfect_victory',
        name: 'Flawless Victory',
        description: 'Win a battle without taking damage',
        xpReward: 300,
        pointsReward: 75
      })
    }
    
    return achievements
  }

  // Hash function for deterministic randomness
  hashCode(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Calculate XP needed for next level (client-side mirror of server function)
  xpToNextLevel(level) {
    return Math.round(100 * Math.pow(level, 2.1))
  }

  // Calculate level from total XP
  levelFromXP(totalXp) {
    let level = 1
    let xpAccumulated = 0
    
    while (xpAccumulated + this.xpToNextLevel(level) <= totalXp) {
      xpAccumulated += this.xpToNextLevel(level)
      level++
    }
    
    return level
  }

  // Get XP progress for current level
  getXPProgress(totalXp, currentLevel) {
    let xpForCurrentLevel = 0
    for (let i = 1; i < currentLevel; i++) {
      xpForCurrentLevel += this.xpToNextLevel(i)
    }
    
    const xpInCurrentLevel = totalXp - xpForCurrentLevel
    const xpNeededForNext = this.xpToNextLevel(currentLevel)
    
    return {
      current: xpInCurrentLevel,
      needed: xpNeededForNext,
      percentage: Math.round((xpInCurrentLevel / xpNeededForNext) * 100)
    }
  }
}

export const gameEngine = new GameEngine()
