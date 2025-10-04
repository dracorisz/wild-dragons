import { EventEmitter } from '../utils/EventEmitter.js';
import { AutoApprovalSystem } from '../systems/AutoApprovalSystem.js';
import { AutoImprovementSystem } from '../systems/AutoImprovementSystem.js';
import { useGameStore } from '../stores/gameStore.js';
import { useMintingStore } from '../stores/mintingStore.js';

export class GameEngine {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.autoApprovalSystem = new AutoApprovalSystem();
    this.autoImprovementSystem = new AutoImprovementSystem();
    this.gameStore = useGameStore();
    this.mintingStore = useMintingStore();
    this.isRunning = false;
    this.gameLoop = null;
    this.lastUpdate = 0;
    this.deltaTime = 0;
    this.gameState = {
      heroines: new Map(),
      dragons: new Map(),
      battles: [],
      currentBattle: null,
      world: {
        level: 1,
        difficulty: 'normal',
        events: []
      }
    };
    this.autoApprovalEnabled = true;
    this.performanceMetrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0
    };
  }

  async initialize() {
    console.log('🎮 Initializing Game Engine with auto-features...');
    
    // Auto-load game state
    await this.loadGameState();
    
    // Auto-setup performance monitoring
    this.setupPerformanceMonitoring();
    
    // Auto-initialize heroines and dragons
    this.initializeEntities();
    
    // Auto-setup event system
    this.setupEventSystem();
    
    console.log('✅ Game Engine initialized');
  }

  async start() {
    if (this.isRunning) return;
    
    console.log('🚀 Starting Game Engine...');
    this.isRunning = true;
    this.lastUpdate = performance.now();
    
    // Auto-start game loop
    this.startGameLoop();
    
    // Auto-enable auto-save
    this.enableAutoSave();
    
    // Auto-start background processes
    this.startBackgroundProcesses();
  }

  stop() {
    console.log('⏹️ Stopping Game Engine...');
    this.isRunning = false;
    
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
    
    // Auto-save on stop
    this.saveGameState();
  }

  startGameLoop() {
    const loop = (timestamp) => {
      if (!this.isRunning) return;
      
      this.deltaTime = timestamp - this.lastUpdate;
      this.lastUpdate = timestamp;
      
      // Auto-update game state
      this.update(this.deltaTime);
      
      // Auto-render if needed
      this.render();
      
      // Auto-monitor performance
      this.updatePerformanceMetrics();
      
      this.gameLoop = requestAnimationFrame(loop);
    };
    
    this.gameLoop = requestAnimationFrame(loop);
  }

  update(deltaTime) {
    // Auto-update entities
    this.updateEntities(deltaTime);
    
    // Auto-process battles
    this.processBattles(deltaTime);
    
    // Auto-handle world events
    this.processWorldEvents(deltaTime);
    
    // Auto-check for auto-approvals
    this.checkAutoApprovals();
  }

  render() {
    // Auto-render game canvas if active
    if (this.gameStore.isGameActive && window.gameCanvas) {
      this.renderGameCanvas();
    }
  }

  updateEntities(deltaTime) {
    // Auto-update heroine states
    this.gameState.heroines.forEach(heroine => {
      heroine.update(deltaTime);
      
      // Auto-check for level ups
      if (heroine.shouldLevelUp()) {
        heroine.levelUp();
        this.gameStore.unlockAchievement({
          id: `heroine_level_${heroine.level}`,
          title: `Heroine Level ${heroine.level}`,
          description: `Reach level ${heroine.level} with a heroine`,
          icon: '⬆️'
        });
      }
    });
    
    // Auto-update dragon states
    this.gameState.dragons.forEach(dragon => {
      dragon.update(deltaTime);
    });
  }

  processBattles(deltaTime) {
    if (this.gameState.currentBattle) {
      const battle = this.gameState.currentBattle;
      
      // Auto-update battle state
      battle.update(deltaTime);
      
      // Auto-check battle completion
      if (battle.isComplete()) {
        this.completeBattle(battle);
      }
    }
  }

  processWorldEvents(deltaTime) {
    // Auto-generate random events
    if (Math.random() < 0.001) { // 0.1% chance per frame
      this.generateRandomEvent();
    }
    
    // Auto-process active events
    this.gameState.world.events.forEach(event => {
      event.update(deltaTime);
      
      if (event.isExpired()) {
        this.removeEvent(event);
      }
    });
  }

  checkAutoApprovals() {
    // Auto-check for mintable entities
    this.checkMintableHeroines();
    this.checkMintableDragons();
    this.checkMintableBattles();
  }

  checkMintableHeroines() {
    this.gameState.heroines.forEach(heroine => {
      if (this.isHeroineMintable(heroine) && !heroine.minted) {
        const approval = this.autoApprove('heroine', heroine);
        if (approval.approved) {
          this.mintingStore.addToMintQueue({
            type: 'heroine',
            data: heroine.serialize(),
            autoApproved: true,
            estimatedValue: this.calculateHeroineValue(heroine)
          });
          heroine.minted = true;
        }
      }
    });
  }

  checkMintableDragons() {
    this.gameState.dragons.forEach(dragon => {
      if (this.isDragonMintable(dragon) && !dragon.minted) {
        const approval = this.autoApprove('dragon', dragon);
        if (approval.approved) {
          this.mintingStore.addToMintQueue({
            type: 'dragon',
            data: dragon.serialize(),
            autoApproved: true,
            estimatedValue: this.calculateDragonValue(dragon)
          });
          dragon.minted = true;
        }
      }
    });
  }

  checkMintableBattles() {
    // Auto-check recent battles for minting
    const recentBattles = this.gameState.battles.slice(-5); // Last 5 battles
    recentBattles.forEach(battle => {
      if (this.isBattleMintable(battle) && !battle.minted) {
        const approval = this.autoApprove('battle', battle);
        if (approval.approved) {
          this.mintingStore.addToMintQueue({
            type: 'battle',
            data: battle.serialize(),
            autoApproved: true,
            estimatedValue: this.calculateBattleValue(battle)
          });
          battle.minted = true;
        }
      }
    });
  }

  autoApprove(type, entity) {
    // Auto-get approval from system
    const autoApproval = window.HeroinesDragon?.autoApproval;
    if (autoApproval) {
      return autoApproval.processApproval(type, entity);
    }
    
    // Fallback approval logic
    return {
      approved: true,
      confidence: 0.8,
      reason: 'Auto-approved by fallback logic'
    };
  }

  isHeroineMintable(heroine) {
    return heroine.level >= 5 || heroine.rarity === 'legendary' || heroine.rarity === 'epic';
  }

  isDragonMintable(dragon) {
    return dragon.level >= 10 || dragon.rarity === 'legendary';
  }

  isBattleMintable(battle) {
    return battle.epic || battle.totalScore >= 150;
  }

  calculateHeroineValue(heroine) {
    let value = heroine.level * 10;
    if (heroine.rarity === 'epic') value *= 2;
    if (heroine.rarity === 'legendary') value *= 5;
    return value;
  }

  calculateDragonValue(dragon) {
    let value = dragon.power * 5;
    if (dragon.rarity === 'legendary') value *= 3;
    return value;
  }

  calculateBattleValue(battle) {
    return battle.totalScore * 2;
  }

  async startBattle(heroineId, dragonId) {
    const heroine = this.gameState.heroines.get(heroineId);
    const dragon = this.gameState.dragons.get(dragonId);
    
    if (!heroine || !dragon) {
      throw new Error('Invalid battle participants');
    }
    
    // Auto-create battle
    const battle = new Battle(heroine, dragon);
    this.gameState.currentBattle = battle;
    
    // Auto-notify UI
    this.gameStore.startGame();
    
    console.log(`⚔️ Auto-started battle: ${heroine.name} vs ${dragon.name}`);
  }

  completeBattle(battle) {
    // Auto-record battle result
    this.gameStore.recordBattle({
      heroineId: battle.heroine.id,
      dragonId: battle.dragon.id,
      winner: battle.winner,
      heroineScore: battle.heroineScore,
      dragonScore: battle.dragonScore,
      experienceGained: battle.experienceReward,
      epic: battle.epic
    });
    
    // Auto-add to battles history
    this.gameState.battles.push(battle);
    
    // Auto-reset current battle
    this.gameState.currentBattle = null;
    
    // Auto-check achievements
    this.checkBattleAchievements(battle);
    
    console.log(`🏆 Battle completed: ${battle.winner} wins!`);
  }

  checkBattleAchievements(battle) {
    if (battle.epic) {
      this.gameStore.unlockAchievement({
        id: 'epic_battle',
        title: 'Epic Battle',
        description: 'Win an epic battle',
        icon: '⚡'
      });
    }
    
    if (battle.perfectVictory) {
      this.gameStore.unlockAchievement({
        id: 'perfect_victory',
        title: 'Perfect Victory',
        description: 'Win a battle with maximum score difference',
        icon: '💯'
      });
    }
  }

  createHeroine(config = {}) {
    const heroine = new Heroine({
      id: `heroine_${Date.now()}`,
      name: config.name || this.generateHeroineName(),
      level: config.level || 1,
      attributes: config.attributes || this.generateAttributes(),
      skills: config.skills || [],
      rarity: config.rarity || this.calculateRarity(config.attributes)
    });
    
    this.gameState.heroines.set(heroine.id, heroine);
    this.gameStore.addHeroine(heroine);
    
    return heroine;
  }

  createDragon(config = {}) {
    const dragon = new Dragon({
      id: `dragon_${Date.now()}`,
      name: config.name || this.generateDragonName(),
      type: config.type || this.randomDragonType(),
      level: config.level || 1,
      power: config.power || this.calculateDragonPower(config.level),
      abilities: config.abilities || [],
      rarity: config.rarity || this.calculateRarity({ power: config.power })
    });
    
    this.gameState.dragons.set(dragon.id, dragon);
    this.gameStore.addDragon(dragon);
    
    return dragon;
  }

  generateHeroineName() {
    const prefixes = ['Lady', 'Princess', 'Warrior', 'Mage', 'Huntress'];
    const suffixes = ['Fire', 'Storm', 'Shadow', 'Light', 'Crystal'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }

  generateDragonName() {
    const prefixes = ['Ancient', 'Fierce', 'Mighty', 'Shadow', 'Crystal'];
    const suffixes = ['Drake', 'Wyrm', 'Serpent', 'Beast', 'Guardian'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }

  generateAttributes() {
    return {
      strength: Math.floor(Math.random() * 20) + 1,
      agility: Math.floor(Math.random() * 20) + 1,
      intelligence: Math.floor(Math.random() * 20) + 1,
      vitality: Math.floor(Math.random() * 20) + 1
    };
  }

  randomDragonType() {
    const types = ['fire', 'ice', 'lightning', 'earth', 'wind', 'shadow'];
    return types[Math.floor(Math.random() * types.length)];
  }

  calculateDragonPower(level) {
    return level * 10 + Math.floor(Math.random() * 50);
  }

  calculateRarity(attributes) {
    const total = Object.values(attributes).reduce((sum, val) => sum + val, 0);
    if (total >= 60) return 'legendary';
    if (total >= 45) return 'epic';
    if (total >= 30) return 'rare';
    if (total >= 20) return 'uncommon';
    return 'common';
  }

  generateRandomEvent() {
    const events = [
      { type: 'dragon_sighting', description: 'A wild dragon has been spotted!' },
      { type: 'treasure_found', description: 'Ancient treasure discovered!' },
      { type: 'heroine_training', description: 'Heroines gain bonus experience!' }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event.id = `event_${Date.now()}`;
    event.duration = 30000; // 30 seconds
    event.startTime = Date.now();
    
    this.gameState.world.events.push(event);
    
    // Auto-notify UI
    console.log(`🌟 Random event: ${event.description}`);
  }

  removeEvent(event) {
    const index = this.gameState.world.events.indexOf(event);
    if (index > -1) {
      this.gameState.world.events.splice(index, 1);
    }
  }

  setupPerformanceMonitoring() {
    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'measure') {
          this.performanceMetrics.frameTime = entry.duration;
        }
      });
    });
    
    this.performanceObserver.observe({ entryTypes: ['measure'] });
  }

  updatePerformanceMetrics() {
    // Auto-calculate FPS
    if (this.deltaTime > 0) {
      this.performanceMetrics.fps = Math.round(1000 / this.deltaTime);
    }
    
    // Auto-monitor memory usage
    if (performance.memory) {
      this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
    }
  }

  setupEventSystem() {
    // Auto-setup game event listeners
    window.addEventListener('beforeunload', () => {
      this.saveGameState();
    });
    
    // Auto-handle visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseGameLoop();
      } else {
        this.resumeGameLoop();
      }
    });
  }

  pauseGameLoop() {
    this.isRunning = false;
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  resumeGameLoop() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startGameLoop();
    }
  }

  enableAutoSave() {
    setInterval(() => {
      this.saveGameState();
    }, 60000); // Auto-save every minute
  }

  startBackgroundProcesses() {
    // Auto-regeneration
    setInterval(() => {
      this.regenerateEntities();
    }, 10000); // Every 10 seconds
    
    // Auto-cleanup
    setInterval(() => {
      this.cleanupOldData();
    }, 300000); // Every 5 minutes
  }

  regenerateEntities() {
    // Auto-regenerate heroine health/mana
    this.gameState.heroines.forEach(heroine => {
      heroine.regenerate();
    });
    
    // Auto-regenerate dragon energy
    this.gameState.dragons.forEach(dragon => {
      dragon.regenerate();
    });
  }

  cleanupOldData() {
    // Auto-remove old battles (keep last 50)
    if (this.gameState.battles.length > 50) {
      this.gameState.battles = this.gameState.battles.slice(-50);
    }
    
    // Auto-remove expired events
    this.gameState.world.events = this.gameState.world.events.filter(event => !event.isExpired());
  }

  async loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.gameState = { ...this.gameState, ...state };
      
      // Auto-reconstruct entities
      this.reconstructEntities();
    }
  }

  saveGameState() {
    const stateToSave = {
      ...this.gameState,
      heroines: Array.from(this.gameState.heroines.entries()),
      dragons: Array.from(this.gameState.dragons.entries())
    };
    
    localStorage.setItem('gameState', JSON.stringify(stateToSave));
  }

  reconstructEntities() {
    // Auto-reconstruct heroines
    if (this.gameState.heroines && Array.isArray(this.gameState.heroines)) {
      this.gameState.heroines = new Map(this.gameState.heroines.map(([id, data]) => [id, new Heroine(data)]));
    } else {
      this.gameState.heroines = new Map();
    }
    
    // Auto-reconstruct dragons
    if (this.gameState.dragons && Array.isArray(this.gameState.dragons)) {
      this.gameState.dragons = new Map(this.gameState.dragons.map(([id, data]) => [id, new Dragon(data)]));
    } else {
      this.gameState.dragons = new Map();
    }
  }

  initializeEntities() {
    // Auto-create starter entities if none exist
    if (this.gameState.heroines.size === 0) {
      this.createHeroine({ name: 'Starter Heroine', level: 1 });
    }
    
    if (this.gameState.dragons.size === 0) {
      this.createDragon({ name: 'Starter Dragon', level: 1 });
    }
  }

  renderGameCanvas() {
    // Auto-render basic game canvas (placeholder)
    const canvas = window.gameCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Auto-render current battle if active
    if (this.gameState.currentBattle) {
      this.renderBattle(ctx, this.gameState.currentBattle);
    } else {
      this.renderWorld(ctx);
    }
  }

  renderBattle(ctx, battle) {
    // Auto-render battle scene
    ctx.fillStyle = '#1a0a2e';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Auto-render heroine
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(50, 200, 100, 100);
    
    // Auto-render dragon
    ctx.fillStyle = '#f7931e';
    ctx.fillRect(350, 150, 150, 150);
    
    // Auto-render battle info
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px MedievalSharp';
    ctx.fillText(`Battle: ${battle.heroine.name} vs ${battle.dragon.name}`, 50, 50);
  }

  renderWorld(ctx) {
    // Auto-render world map
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Auto-render entities
    this.gameState.heroines.forEach(heroine => {
      ctx.fillStyle = '#ff6b35';
      ctx.fillRect(heroine.x || 100, heroine.y || 200, 50, 50);
    });
    
    this.gameState.dragons.forEach(dragon => {
      ctx.fillStyle = '#f7931e';
      ctx.fillRect(dragon.x || 300, dragon.y || 150, 75, 75);
    });
  }

  getStats() {
    return {
      heroines: this.gameState.heroines.size,
      dragons: this.gameState.dragons.size,
      battles: this.gameState.battles.length,
      currentBattle: !!this.gameState.currentBattle,
      worldLevel: this.gameState.world.level,
      performance: this.performanceMetrics,
      isRunning: this.isRunning
    };
  }

  pauseToggle() {
    if (this.isRunning) {
      this.pauseGameLoop();
    } else {
      this.resumeGameLoop();
    }
  }

  navigateNext() {
    // Auto-navigate to next screen/area
    console.log('🧭 Auto-navigating to next area...');
  }

  navigatePrevious() {
    // Auto-navigate to previous screen/area
    console.log('🧭 Auto-navigating to previous area...');
  }

  optimizeRendering() {
    // Auto-optimize rendering performance
    console.log('⚡ Auto-optimizing rendering...');
  }
}

// Entity classes
class Heroine {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.level = config.level;
    this.attributes = config.attributes;
    this.skills = config.skills || [];
    this.rarity = config.rarity;
    this.experience = config.experience || 0;
    this.health = config.health || 100;
    this.mana = config.mana || 100;
    this.minted = config.minted || false;
    this.createdAt = config.createdAt || new Date().toISOString();
  }

  update(deltaTime) {
    // Auto-regenerate over time
    this.health = Math.min(100, this.health + deltaTime * 0.01);
    this.mana = Math.min(100, this.mana + deltaTime * 0.005);
  }

  shouldLevelUp() {
    const expNeeded = this.level * 100;
    return this.experience >= expNeeded;
  }

  levelUp() {
    this.level++;
    this.experience = 0;
    
    // Auto-boost attributes
    Object.keys(this.attributes).forEach(attr => {
      this.attributes[attr] += Math.floor(Math.random() * 3) + 1;
    });
    
    console.log(`⬆️ ${this.name} leveled up to ${this.level}!`);
  }

  regenerate() {
    this.health = Math.min(100, this.health + 5);
    this.mana = Math.min(100, this.mana + 3);
  }

  serialize() {
    return { ...this };
  }
}

class Dragon {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this.level = config.level;
    this.power = config.power;
    this.abilities = config.abilities || [];
    this.rarity = config.rarity;
    this.energy = config.energy || 100;
    this.minted = config.minted || false;
    this.tamedAt = config.tamedAt || new Date().toISOString();
  }

  update(deltaTime) {
    // Auto-regenerate energy
    this.energy = Math.min(100, this.energy + deltaTime * 0.008);
  }

  regenerate() {
    this.energy = Math.min(100, this.energy + 8);
  }

  serialize() {
    return { ...this };
  }
}

class Battle {
  constructor(heroine, dragon) {
    this.heroine = heroine;
    this.dragon = dragon;
    this.startTime = Date.now();
    this.duration = 0;
    this.heroineScore = 0;
    this.dragonScore = 0;
    this.winner = null;
    this.epic = false;
    this.perfectVictory = false;
    this.experienceReward = 0;
    this.minted = false;
  }

  update(deltaTime) {
    this.duration += deltaTime;
    
    // Auto-simulate battle progression
    const heroinePower = this.heroine.level * 10 + Object.values(this.heroine.attributes).reduce((a, b) => a + b, 0);
    const dragonPower = this.dragon.power;
    
    this.heroineScore += heroinePower * (deltaTime / 1000) * (0.8 + Math.random() * 0.4);
    this.dragonScore += dragonPower * (deltaTime / 1000) * (0.8 + Math.random() * 0.4);
    
    // Auto-check for completion (after 10 seconds or clear winner)
    if (this.duration >= 10000 || Math.abs(this.heroineScore - this.dragonScore) >= 50) {
      this.complete();
    }
  }

  complete() {
    // Auto-determine winner
    if (this.heroineScore > this.dragonScore) {
      this.winner = 'heroine';
      this.experienceReward = Math.floor(this.dragonScore / 10);
    } else {
      this.winner = 'dragon';
      this.experienceReward = Math.floor(this.heroineScore / 20);
    }
    
    // Auto-check for epic battle
    this.epic = (this.heroineScore + this.dragonScore) >= 150;
    
    // Auto-check for perfect victory
    this.perfectVictory = Math.abs(this.heroineScore - this.dragonScore) >= 50;
    
    // Auto-calculate total score
    this.totalScore = this.heroineScore + this.dragonScore;
  }

  isComplete() {
    return this.winner !== null;
  }

  serialize() {
    return {
      heroineId: this.heroine.id,
      dragonId: this.dragon.id,
      winner: this.winner,
      heroineScore: Math.floor(this.heroineScore),
      dragonScore: Math.floor(this.dragonScore),
      duration: this.duration,
      epic: this.epic,
      perfectVictory: this.perfectVictory,
      experienceReward: this.experienceReward,
      totalScore: this.totalScore
    };
  }
}