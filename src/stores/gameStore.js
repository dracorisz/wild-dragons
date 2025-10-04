import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useGameStore = defineStore('game', () => {
  const isGameActive = ref(false);
  const currentScene = ref('menu');
  const playerData = ref({
    id: null,
    username: '',
    level: 1,
    experience: 0,
    currency: 0,
    autoSaveEnabled: true,
    lastAutoSave: null
  });
  const heroines = ref([]);
  const dragons = ref([]);
  const battles = ref([]);
  const achievements = ref([]);
  const gameStats = ref({
    totalPlayTime: 0,
    battlesWon: 0,
    battlesLost: 0,
    heroinesCreated: 0,
    dragonsTamed: 0,
    achievementsUnlocked: 0
  });

  const isPlayerLoggedIn = computed(() => !!playerData.value.id);
  const totalHeroines = computed(() => heroines.value.length);
  const totalDragons = computed(() => dragons.value.length);
  const playerLevel = computed(() => Math.floor(playerData.value.experience / 1000) + 1);
  const experienceToNextLevel = computed(() => (playerLevel.value * 1000) - (playerData.value.experience % 1000));
  const winRate = computed(() => {
    const total = battles.value.length;
    if (!total) return 0;
    const wins = battles.value.filter(b => b.winner === 'heroine').length;
    return (wins / total) * 100;
  });

  const initialize = async () => {
    await loadPlayerData();
    await loadGameAssets();
    setupAutoSave();
    await loadAchievements();
  };

  const setupAutoSave = () => {
    if (playerData.value.autoSaveEnabled) {
      setInterval(() => {
        savePlayerData();
        playerData.value.lastAutoSave = new Date().toISOString();
      }, 30000);
    }
  };

  const loadPlayerData = async () => {
    const saved = localStorage.getItem('playerData');
    if (saved) playerData.value = { ...playerData.value, ...JSON.parse(saved) };
    if (!playerData.value.id) {
      playerData.value.id = `player_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      playerData.value.username = `Heroine${Math.floor(Math.random() * 10000)}`;
    }
  };

  const savePlayerData = () => localStorage.setItem('playerData', JSON.stringify(playerData.value));

  const loadGameAssets = async () => {
    const savedHeroines = localStorage.getItem('heroines');
    const savedDragons = localStorage.getItem('dragons');
    const savedBattles = localStorage.getItem('battles');
    if (savedHeroines) heroines.value = JSON.parse(savedHeroines);
    if (savedDragons) dragons.value = JSON.parse(savedDragons);
    if (savedBattles) battles.value = JSON.parse(savedBattles);
    updateGameStats();
  };

  const loadAchievements = async () => {
    const saved = localStorage.getItem('achievements');
    if (saved) achievements.value = JSON.parse(saved);
    checkForNewAchievements();
  };

  const startGame = () => {
    isGameActive.value = true;
    currentScene.value = 'game';
    playerData.value.sessionStart = Date.now();
  };

  const endGame = () => {
    isGameActive.value = false;
    currentScene.value = 'menu';
    if (playerData.value.sessionStart) {
      gameStats.value.totalPlayTime += Date.now() - playerData.value.sessionStart;
      delete playerData.value.sessionStart;
    }
    savePlayerData();
  };

  const addHeroine = heroine => {
    const newHeroine = {
      ...heroine,
      id: `heroine_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      battlesWon: 0,
      battlesLost: 0
    };
    heroines.value.push(newHeroine);
    gameStats.value.heroinesCreated++;
    localStorage.setItem('heroines', JSON.stringify(heroines.value));
    checkHeroineAchievements(newHeroine);
  };

  const addDragon = dragon => {
    const newDragon = {
      ...dragon,
      id: `dragon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      tamedAt: new Date().toISOString(),
      battlesWon: 0,
      battlesLost: 0
    };
    dragons.value.push(newDragon);
    gameStats.value.dragonsTamed++;
    localStorage.setItem('dragons', JSON.stringify(dragons.value));
    checkDragonAchievements(newDragon);
  };

  const recordBattle = battleResult => {
    const battle = {
      ...battleResult,
      id: `battle_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    battles.value.unshift(battle);
    if (battles.value.length > 100) battles.value = battles.value.slice(0, 100);

    const heroine = heroines.value.find(h => h.id === battle.heroineId);
    const dragon = dragons.value.find(d => d.id === battle.dragonId);
    if (heroine) {
      heroine.lastBattle = battle.timestamp;
      battle.winner === 'heroine' ? heroine.battlesWon++ : heroine.battlesLost++;
    }
    if (dragon) {
      dragon.lastBattle = battle.timestamp;
      battle.winner === 'dragon' ? dragon.battlesWon++ : dragon.battlesLost++;
    }

    playerData.value.experience += battle.experienceGained || (battle.winner === 'heroine' ? 50 : 25);
    battle.winner === 'heroine' ? gameStats.value.battlesWon++ : gameStats.value.battlesLost++;

    localStorage.setItem('battles', JSON.stringify(battles.value));
    savePlayerData();
    checkBattleAchievements(battle);
    checkLevelUp();
  };

  const updateGameStats = () => {
    gameStats.value.heroinesCreated = heroines.value.length;
    gameStats.value.dragonsTamed = dragons.value.length;
    gameStats.value.achievementsUnlocked = achievements.value.length;
    gameStats.value.battlesWon = battles.value.filter(b => b.winner === 'heroine').length;
    gameStats.value.battlesLost = battles.value.filter(b => b.winner === 'dragon').length;
  };

  const unlockAchievement = achievement => {
    if (!achievements.value.find(a => a.id === achievement.id)) {
      achievements.value.push({ ...achievement, unlockedAt: new Date().toISOString() });
      localStorage.setItem('achievements', JSON.stringify(achievements.value));
      gameStats.value.achievementsUnlocked++;
      if (window.Toast) window.Toast.achievement(achievement.description, achievement.title);
    }
  };

  const checkForNewAchievements = () => {
    checkHeroineAchievements();
    checkDragonAchievements();
    checkBattleAchievements();
    checkStatAchievements();
  };

  const checkHeroineAchievements = (newHeroine) => {
    if (heroines.value.length >= 1) unlockAchievement({ id: 'first_heroine', title: 'First Heroine', description: 'Create your first heroine', icon: '👸' });
    if (heroines.value.length >= 5) unlockAchievement({ id: 'heroine_collector', title: 'Heroine Collector', description: 'Create 5 heroines', icon: '👑' });
    if (newHeroine && newHeroine.level >= 10) unlockAchievement({ id: 'powerful_heroine', title: 'Powerful Heroine', description: 'Create a level 10 heroine', icon: '💪' });
  };

  const checkDragonAchievements = (newDragon) => {
    if (dragons.value.length >= 1) unlockAchievement({ id: 'first_dragon', title: 'Dragon Tamer', description: 'Tame your first dragon', icon: '🐉' });
    if (dragons.value.length >= 3) unlockAchievement({ id: 'dragon_master', title: 'Dragon Master', description: 'Tame 3 dragons', icon: '🔥' });
    if (newDragon && newDragon.level >= 15) unlockAchievement({ id: 'ancient_bond', title: 'Ancient Bond', description: 'Bond with a level 15 dragon', icon: '🛡️' });
  };

  const checkBattleAchievements = (battle) => {
    if (battles.value.length >= 1) unlockAchievement({ id: 'first_battle', title: 'First Battle', description: 'Complete your first battle', icon: '⚔️' });
    if (gameStats.value.battlesWon >= 5) unlockAchievement({ id: 'victorious', title: 'Victorious', description: 'Win 5 battles', icon: '🏆' });
    if (gameStats.value.battlesWon >= 10) unlockAchievement({ id: 'champion', title: 'Champion', description: 'Win 10 battles', icon: '👑' });
    if (battle && battle.epic) unlockAchievement({ id: 'epic_battle', title: 'Epic Battle', description: 'Win an epic battle', icon: '⚡' });
  };

  const checkStatAchievements = () => {
    if (playerLevel.value >= 5) unlockAchievement({ id: 'experienced', title: 'Experienced', description: 'Reach level 5', icon: '⭐' });
    if (gameStats.value.totalPlayTime >= 3600000) unlockAchievement({ id: 'dedicated', title: 'Dedicated Player', description: 'Play for 1 hour', icon: '⏰' });
  };

  const checkLevelUp = () => {
    const newLevel = playerLevel.value;
    if (newLevel > playerData.value.level) {
      playerData.value.level = newLevel;
      if (window.Toast) window.Toast.success(`Reached level ${newLevel}!`, 'Level Up');
      checkStatAchievements();
    }
  };

  return {
    isGameActive,
    currentScene,
    playerData,
    heroines,
    dragons,
    battles,
    achievements,
    gameStats,
    isPlayerLoggedIn,
    totalHeroines,
    totalDragons,
    playerLevel,
    experienceToNextLevel,
    winRate,
    initialize,
    startGame,
    endGame,
    addHeroine,
    addDragon,
    recordBattle,
    unlockAchievement,
    updateGameStats,
    checkLevelUp
  };
});
    
   
  
  const updateParticipantStats = (battle) => {
    // Auto-update heroine stats
    const heroine = heroines.value.find(h => h.id === battle.heroineId);
    if (heroine) {
      heroine.lastBattle = battle.timestamp;
      if (battle.winner === 'heroine') {
        heroine.battlesWon++;
      } else {
        heroine.battlesLost++;
      }
    }
    
    // Auto-update dragon stats
    const dragon = dragons.value.find(d => d.id === battle.dragonId);
    if (dragon) {
      dragon.lastBattle = battle.timestamp;
      if (battle.winner === 'dragon') {
        dragon.battlesWon++;
      } else {
        dragon.battlesLost++;
      }
    }
  };
  
  const updateGameStats = () => {
    gameStats.value.heroinesCreated = heroines.value.length;
    gameStats.value.dragonsTamed = dragons.value.length;
    gameStats.value.achievementsUnlocked = achievements.value.length;
    gameStats.value.battlesWon = battles.value.filter(b => b.winner === 'heroine').length;
    gameStats.value.battlesLost = battles.value.filter(b => b.winner === 'dragon').length;
  };
  
  const unlockAchievement = (achievement) => {
    if (!achievements.value.find(a => a.id === achievement.id)) {
      const newAchievement = {
        ...achievement,
        unlockedAt: new Date().toISOString()
      };
      
      achievements.value.push(newAchievement);
      gameStats.value.achievementsUnlocked++;
      
      // Auto-save
      localStorage.setItem('achievements', JSON.stringify(achievements.value));
      
      console.log(`🏆 Achievement auto-unlocked: ${achievement.title}`);
    }
  };
  
  // Auto-achievement checking
  const checkForNewAchievements = () => {
    checkHeroineAchievements();
    checkDragonAchievements();
    checkBattleAchievements();
    checkStatAchievements();
  };
  
  const checkHeroineAchievements = (newHeroine = null) => {
    const totalHeroines = heroines.value.length;
    
    // Auto-unlock based on total count
    if (totalHeroines >= 1 && !achievements.value.find(a => a.id === 'first_heroine')) {
      unlockAchievement({
        id: 'first_heroine',
        title: 'First Heroine',
        description: 'Create your first heroine',
        icon: '👸'
      });
    }
    
    if (totalHeroines >= 5 && !achievements.value.find(a => a.id === 'heroine_collector')) {
      unlockAchievement({
        id: 'heroine_collector',
        title: 'Heroine Collector',
        description: 'Create 5 heroines',
        icon: '👸👸👸👸👸'
      });
    }
    
    // Auto-check new heroine specific achievements
    if (newHeroine) {
      if (newHeroine.level >= 10) {
        unlockAchievement({
          id: 'powerful_heroine',
          title: 'Powerful Heroine',
          description: 'Create a level 10+ heroine',
          icon: '💪'
        });
      }
    }
  };
  
  const checkDragonAchievements = (newDragon = null) => {
    const totalDragons = dragons.value.length;
    
    if (totalDragons >= 1 && !achievements.value.find(a => a.id === 'first_dragon')) {
      unlockAchievement({
        id: 'first_dragon',
        title: 'Dragon Tamer',
        description: 'Tame your first dragon',
        icon: '🐉'
      });
    }
    
    if (totalDragons >= 3 && !achievements.value.find(a => a.id === 'dragon_master')) {
      unlockAchievement({
        id: 'dragon_master',
        title: 'Dragon Master',
        description: 'Tame 3 dragons',
        icon: '🐉🐉🐉'
      });
    }
  };
  
  const checkBattleAchievements = (newBattle = null) => {
    const totalBattles = battles.value.length;
    const wins = battles.value.filter(b => b.winner === 'heroine').length;
    
    if (totalBattles >= 1 && !achievements.value.find(a => a.id === 'first_battle')) {
      unlockAchievement({
        id: 'first_battle',
        title: 'First Battle',
        description: 'Complete your first battle',
        icon: '⚔️'
      });
    }
    
    if (wins >= 5 && !achievements.value.find(a => a.id === 'victorious')) {
      unlockAchievement({
        id: 'victorious',
        title: 'Victorious',
        description: 'Win 5 battles',
        icon: '🏆'
      });
    }
    
    if (wins >= 10 && !achievements.value.find(a => a.id === 'champion')) {
      unlockAchievement({
        id: 'champion',
        title: 'Champion',
        description: 'Win 10 battles',
        icon: '👑'
      });
    }
  };
  
  const checkStatAchievements = () => {
    if (playerData.value.level >= 5 && !achievements.value.find(a => a.id === 'experienced')) {
      unlockAchievement({
        id: 'experienced',
        title: 'Experienced',
        description: 'Reach level 5',
        icon: '⭐'
      });
    }
    
    if (gameStats.value.totalPlayTime >= 3600000 && !achievements.value.find(a => a.id === 'dedicated')) {
      unlockAchievement({
        id: 'dedicated',
        title: 'Dedicated Player',
        description: 'Play for 1 hour',
        icon: '⏰'
      });
    }
  };
  
  // Auto-level up player
  const checkLevelUp = () => {
    const newLevel = playerLevel.value;
    if (newLevel > playerData.value.level) {
      playerData.value.level = newLevel;
      console.log(`⬆️ Auto-leveled up to level ${newLevel}`);
      
      // Auto-unlock level achievements
      checkStatAchievements();
    }
  };
  
  // Watch for level changes
  const unwatchLevel = () => {}; // Placeholder for reactivity
  
  return {
    // State
    isGameActive,
    currentScene,
    playerData,
    heroines,
    dragons,
    battles,
    achievements,
    gameStats,
    
    // Computed
    isPlayerLoggedIn,
    totalHeroines,
    totalDragons,
    playerLevel,
    experienceToNextLevel,
    winRate,
    
    // Actions
    initialize,
    loadPlayerData,
    savePlayerData,
    startGame,
    endGame,
    addHeroine,
    addDragon,
    recordBattle,
    unlockAchievement,
    updateGameStats,
    checkLevelUp
  };

