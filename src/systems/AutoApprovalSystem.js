import { EventEmitter } from '../utils/EventEmitter.js';

class AutoApprovalSystem {
  constructor() {
    this.trainingData = new Map();
    this.distributions = new Map();
    this.accuracy = 0;
    
    // Initialize workflows
    this.workflows = {
      heroine: new HeroineApprovalWorkflow(this),
      dragon: new DragonApprovalWorkflow(this),
      battle: new BattleApprovalWorkflow(this),
      achievement: new AchievementApprovalWorkflow(this),
      collection: new CollectionApprovalWorkflow(this)
    };
  }

  async processApproval(type, entity) {
    // Generic approval process
    const workflow = this.workflows[type];
    if (workflow) {
      return await workflow.process(entity);
    }
    
    return { status: 'rejected', reason: 'Unknown entity type' };
  }

  generateRecommendations(type, entity, successfulExamples) {
    const recommendations = [];
    
    if (successfulExamples.length === 0) {
      return ['More training data needed for accurate recommendations'];
    }
    
    // Analyze what makes successful examples different
    const averageSuccessful = this.calculateAverageEntity(successfulExamples.map(e => e.entity));
    const differences = this.findDifferences(entity, averageSuccessful);
    
    differences.forEach(diff => {
      if (diff.direction === 'lower') {
        recommendations.push(`Increase ${diff.field} (currently ${diff.currentValue}, successful average: ${diff.averageValue})`);
      } else if (diff.direction === 'higher') {
        recommendations.push(`Consider reducing ${diff.field} (currently ${diff.currentValue}, successful average: ${diff.averageValue})`);
      }
    });
    
    return recommendations;
  }

  calculateAverageEntity(entities) {
    if (entities.length === 0) return {};
    
    const average = {};
    const numericFields = new Set();
    
    // Collect all numeric fields
    entities.forEach(entity => {
      Object.entries(entity).forEach(([key, value]) => {
        if (typeof value === 'number') {
          numericFields.add(key);
        }
      });
    });
    
    // Calculate averages
    numericFields.forEach(field => {
      const values = entities.map(e => e[field]).filter(v => typeof v === 'number');
      average[field] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });
    
    return average;
  }

  findDifferences(entity, average) {
    const differences = [];
    
    Object.entries(average).forEach(([field, avgValue]) => {
      const currentValue = entity[field];
      if (typeof currentValue === 'number' && typeof avgValue === 'number') {
        const diff = currentValue - avgValue;
        const threshold = Math.abs(avgValue) * 0.2; // 20% difference threshold
        
        if (Math.abs(diff) > threshold) {
          differences.push({
            field,
            currentValue,
            averageValue: avgValue.toFixed(2),
            direction: diff > 0 ? 'higher' : 'lower',
            difference: Math.abs(diff)
          });
        }
      }
    });
    
    return differences.sort((a, b) => b.difference - a.difference);
  }

  addPositiveExample(type, entity) {
    const trainingData = this.trainingData.get(type) || [];
    trainingData.push({ entity, status: 'approved', timestamp: Date.now() });
    
    // Keep only recent examples
    if (trainingData.length > 1000) {
      trainingData.splice(0, trainingData.length - 1000);
    }
    
    this.trainingData.set(type, trainingData);
    this.updateDistributions(type, trainingData);
  }

  addNegativeExample(type, entity) {
    const trainingData = this.trainingData.get(type) || [];
    trainingData.push({ entity, status: 'rejected', timestamp: Date.now() });
    
    // Keep only recent examples
    if (trainingData.length > 1000) {
      trainingData.splice(0, trainingData.length - 1000);
    }
    
    this.trainingData.set(type, trainingData);
    this.updateDistributions(type, trainingData);
  }

  loadTrainingData(data) {
    Object.entries(data).forEach(([type, examples]) => {
      this.trainingData.set(type, examples);
      this.updateDistributions(type, examples);
    });
  }

  getDistributions() {
    return Object.fromEntries(this.distributions);
  }

  getAccuracy() {
    // Simplified accuracy calculation
    return this.accuracy;
  }
}

// Workflow classes for different entity types
class HeroineApprovalWorkflow {
  constructor(autoApprovalSystem) {
    this.system = autoApprovalSystem;
  }

  async process(entity) {
    // Heroine-specific approval logic
    const baseApproval = await this.system.processApproval('heroine', entity);
    
    // Additional heroine-specific checks
    if (baseApproval.status === 'approved') {
      // Check for legendary potential
      if (this.isLegendaryPotential(entity)) {
        baseApproval.priority = 'high';
        baseApproval.tags = ['legendary', 'rare'];
      }
      
      // Check for skill diversity
      if (this.hasDiverseSkills(entity)) {
        baseApproval.confidence += 0.1;
      }
    }
    
    return baseApproval;
  }

  isLegendaryPotential(heroine) {
    const totalAttributes = Object.values(heroine.attributes || {}).reduce((sum, val) => sum + val, 0);
    return heroine.level >= 15 && totalAttributes >= 60;
  }

  hasDiverseSkills(heroine) {
    const skills = heroine.skills || [];
    const skillTypes = new Set(skills.map(skill => skill.type));
    return skillTypes.size >= 3; // At least 3 different skill types
  }
}

class DragonApprovalWorkflow {
  constructor(autoApprovalSystem) {
    this.system = autoApprovalSystem;
  }

  async process(entity) {
    const baseApproval = await this.system.processApproval('dragon', entity);
    
    if (baseApproval.status === 'approved') {
      // Check for ancient dragon status
      if (this.isAncientDragon(entity)) {
        baseApproval.priority = 'high';
        baseApproval.tags = ['ancient', 'powerful'];
      }
      
      // Check for rare abilities
      if (this.hasRareAbilities(entity)) {
        baseApproval.confidence += 0.15;
      }
    }
    
    return baseApproval;
  }

  isAncientDragon(dragon) {
    return dragon.level >= 20 && dragon.power >= 150;
  }

  hasRareAbilities(dragon) {
    const rareAbilities = ['time_manipulation', 'reality_warping', 'soul_binding'];
    const abilities = dragon.abilities || [];
    return abilities.some(ability => rareAbilities.includes(ability.type));
  }
}

class BattleApprovalWorkflow {
  constructor(autoApprovalSystem) {
    this.system = autoApprovalSystem;
  }

  async process(entity) {
    const baseApproval = await this.system.processApproval('battle', entity);
    
    if (baseApproval.status === 'approved') {
      // Check for epic battle status
      if (this.isEpicBattle(entity)) {
        baseApproval.priority = 'high';
        baseApproval.tags = ['epic', 'legendary'];
      }
      
      // Check for perfect victory
      if (this.isPerfectVictory(entity)) {
        baseApproval.confidence += 0.2;
      }
    }
    
    return baseApproval;
  }

  isEpicBattle(battle) {
    const totalScore = (battle.heroineScore || 0) + (battle.dragonScore || 0);
    return totalScore >= 200;
  }

  isPerfectVictory(battle) {
    return battle.winner === 'heroine' && 
           battle.heroineScore > battle.dragonScore * 2;
  }
}

class AchievementApprovalWorkflow {
  constructor(autoApprovalSystem) {
    this.system = autoApprovalSystem;
  }

  async process(entity) {
    const baseApproval = await this.system.processApproval('achievement', entity);
    
    if (baseApproval.status === 'approved') {
      // Check for rare achievement
      if (this.isRareAchievement(entity)) {
        baseApproval.priority = 'medium';
        baseApproval.tags = ['rare', 'prestigious'];
      }
    }
    
    return baseApproval;
  }

  isRareAchievement(achievement) {
    return achievement.rarity === 'legendary' || 
           achievement.unlockRate < 0.01; // Less than 1% of players
  }
}

class CollectionApprovalWorkflow {
  constructor(autoApprovalSystem) {
    this.system = autoApprovalSystem;
  }

  async process(entity) {
    const baseApproval = await this.system.processApproval('collection', entity);
    
    if (baseApproval.status === 'approved') {
      // Check for complete set
      if (this.isCompleteSet(entity)) {
        baseApproval.priority = 'high';
        baseApproval.tags = ['complete', 'valuable'];
      }
      
      // Check for themed collection
      if (this.isThemedCollection(entity)) {
        baseApproval.confidence += 0.1;
      }
    }
    
    return baseApproval;
  }

  isCompleteSet(collection) {
    return collection.completionRate >= 0.95; // 95% complete
  }

  isThemedCollection(collection) {
    return collection.theme && collection.theme !== 'mixed';
  }
}

// Add the missing CriteriaEngine and MLPredictor classes
class CriteriaEngine {
  // ...existing code...
}

class MLPredictor {
  // ...existing code...
}
