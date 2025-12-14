/**
 * DevSTon Gamification Service
 * Implements rarity tiers: Common (Gray), Uncommon (Green), Rare (Blue), Epic (Dark-Violet), Legendary (Gold)
 * Features: Experience system, achievements, daily challenges, leaderboards
 */

class GamificationService {
  constructor() {
    this.rarityTiers = {
      common: { name: 'Common', color: 'gray', multiplier: 1.0, minPoints: 0 },
      uncommon: { name: 'Uncommon', color: 'green', multiplier: 1.2, minPoints: 100 },
      rare: { name: 'Rare', color: 'blue', multiplier: 1.5, minPoints: 500 },
      epic: { name: 'Epic', color: 'dark-violet', multiplier: 2.0, minPoints: 2000 },
      legendary: { name: 'Legendary', color: 'gold', multiplier: 3.0, minPoints: 5000 }
    };

    this.activityPoints = {
      login: 10,
      trade: 25,
      social_share: 15,
      tutorial_complete: 50,
      first_purchase: 100,
      referral: 75,
      daily_streak: 20,
      achievement_unlock: 30
    };

    this.isInitialized = false;
    this.userProgress = null;
    this.achievements = [];
    this.dailyChallenges = [];
  }

  /**
   * Initialize gamification system
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.loadUserProgress();
      await this.loadAchievements();
      await this.loadDailyChallenges();
      this.setupActivityListeners();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize gamification:', error);
    }
  }

  /**
   * Load user progression data
   */
  async loadUserProgress() {
    try {
      const { data, error } = await supabase
        .from('user_progression')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      this.userProgress = data || {
        experience_points: 0,
        level: 1,
        total_achievements: 0,
        current_streak: 0,
        longest_streak: 0
      };
    } catch (error) {
      console.error('Failed to load user progress:', error);
      this.userProgress = {
        experience_points: 0,
        level: 1,
        total_achievements: 0,
        current_streak: 0,
        longest_streak: 0
      };
    }
  }

  /**
   * Load available achievements
   */
  async loadAchievements() {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      this.achievements = data || [];
    } catch (error) {
      console.error('Failed to load achievements:', error);
      this.achievements = [];
    }
  }

  /**
   * Load daily challenges
   */
  async loadDailyChallenges() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('is_active', true)
        .gte('valid_until', today)
        .lte('valid_from', today);

      if (error) throw error;
      this.dailyChallenges = data || [];
    } catch (error) {
      console.error('Failed to load daily challenges:', error);
      this.dailyChallenges = [];
    }
  }

  /**
   * Setup activity listeners for automatic point awarding
   */
  setupActivityListeners() {
    // Login activity
    window.addEventListener('load', () => {
      setTimeout(() => this.recordActivity('login'), 1000);
    });

    // Page navigation tracking
    let currentPath = window.location.pathname;
    const observer = new MutationObserver(() => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        currentPath = newPath;
        this.recordActivity('page_visit');
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Social sharing detection
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-share]');
      if (target) {
        this.recordActivity('social_share');
      }
    });
  }

  /**
   * Record user activity and award points
   */
  async recordActivity(activityType, metadata = {}) {
    try {
      const points = this.activityPoints[activityType] || 0;
      const experience = Math.floor(points * this.getCurrentMultiplier());

      // Record activity
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert({
          activity_type: activityType,
          activity_data: metadata,
          points_earned: points,
          experience_earned: experience
        });

      if (activityError) throw activityError;

      // Award experience
      if (experience > 0) {
        await this.awardExperience(experience);
      }

      // Update daily challenges
      await this.updateDailyChallenges(activityType);

      // Check for achievements
      await this.checkAchievements(activityType, metadata);

    } catch (error) {
      console.error('Failed to record activity:', error);
    }
  }

  /**
   * Award experience points and handle leveling
   */
  async awardExperience(amount) {
    try {
      const { data, error } = await supabase
        .rpc('award_experience', {
          user_uuid: supabase.auth.user()?.id,
          exp_amount: amount
        });

      if (error) throw error;

      if (data && data.length > 0) {
        const [result] = data;
        this.userProgress.experience_points += amount;
        this.userProgress.level = result.new_level;

        // Trigger level up effects
        if (result.leveled_up) {
          this.handleLevelUp(result.new_level);
        }
      }
    } catch (error) {
      console.error('Failed to award experience:', error);
    }
  }

  /**
   * Handle level up effects
   */
  handleLevelUp(newLevel) {
    // Show level up notification
    this.showNotification(`🎉 Level Up! You reached level ${newLevel}!`, 'success');

    // Award bonus points for leveling up
    const bonusPoints = newLevel * 10;
    this.awardExperience(bonusPoints);

    // Unlock new achievements or features
    this.checkLevelAchievements(newLevel);
  }

  /**
   * Update daily challenge progress
   */
  async updateDailyChallenges(activityType) {
    try {
      for (const challenge of this.dailyChallenges) {
        if (challenge.challenge_type === activityType) {
          const { data, error } = await supabase
            .from('user_daily_progress')
            .upsert({
              challenge_id: challenge.id,
              current_value: 1, // Increment by 1 for each activity
              challenge_date: new Date().toISOString().split('T')[0]
            }, {
              onConflict: 'user_id,challenge_id,challenge_date'
            })
            .select();

          if (error) throw error;

          // Check if challenge completed
          if (data && data[0]) {
            const progress = data[0];
            if (progress.current_value >= challenge.target_value && !progress.completed) {
              await this.completeDailyChallenge(challenge);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to update daily challenges:', error);
    }
  }

  /**
   * Complete daily challenge and award rewards
   */
  async completeDailyChallenge(challenge) {
    try {
      const { error } = await supabase
        .from('user_daily_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('challenge_id', challenge.id);

      if (error) throw error;

      // Award challenge rewards
      await this.awardExperience(challenge.experience_reward);

      this.showNotification(`🎯 Daily Challenge Complete: ${challenge.title}!`, 'success');

    } catch (error) {
      console.error('Failed to complete daily challenge:', error);
    }
  }

  /**
   * Check for achievement unlocks
   */
  async checkAchievements(activityType, metadata) {
    try {
      // Get user's current achievements
      const { data: userAchievements, error } = await supabase
        .from('user_achievements')
        .select('achievement_id');

      if (error) throw error;

      const unlockedIds = new Set(userAchievements.map(ua => ua.achievement_id));

      // Check each achievement
      for (const achievement of this.achievements) {
        if (unlockedIds.has(achievement.id)) continue;

        if (this.checkAchievementRequirements(achievement, activityType, metadata)) {
          await this.unlockAchievement(achievement);
        }
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  }

  /**
   * Check if achievement requirements are met
   */
  checkAchievementRequirements(achievement, activityType, metadata) {
    const requirements = achievement.requirements || {};

    // Simple requirement checking - can be extended
    switch (achievement.category) {
      case 'engagement':
        if (requirements.activity_type === activityType) {
          return requirements.count <= (metadata.count || 1);
        }
        break;
      case 'level':
        return this.userProgress.level >= requirements.min_level;
      case 'streak':
        return this.userProgress.current_streak >= requirements.min_streak;
      default:
        return false;
    }

    return false;
  }

  /**
   * Unlock achievement for user
   */
  async unlockAchievement(achievement) {
    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          achievement_id: achievement.id
        });

      if (error) throw error;

      // Award achievement rewards
      await this.awardExperience(achievement.experience_reward);

      this.showNotification(`🏆 Achievement Unlocked: ${achievement.name}!`, 'achievement');

      // Update user progress
      this.userProgress.total_achievements++;

    } catch (error) {
      console.error('Failed to unlock achievement:', error);
    }
  }

  /**
   * Check level-based achievements
   */
  checkLevelAchievements(level) {
    const levelAchievements = this.achievements.filter(a =>
      a.category === 'level' && a.requirements?.min_level === level
    );

    levelAchievements.forEach(achievement => {
      this.unlockAchievement(achievement);
    });
  }

  /**
   * Get current experience multiplier based on rarity tier
   */
  getCurrentMultiplier() {
    const currentTier = this.getCurrentTier();
    return this.rarityTiers[currentTier].multiplier;
  }

  /**
   * Get current rarity tier based on experience
   */
  getCurrentTier() {
    const exp = this.userProgress?.experience_points || 0;

    for (const [tier, config] of Object.entries(this.rarityTiers).reverse()) {
      if (exp >= config.minPoints) {
        return tier;
      }
    }

    return 'common';
  }

  /**
   * Get tier configuration
   */
  getTierConfig(tier) {
    return this.rarityTiers[tier] || this.rarityTiers.common;
  }

  /**
   * Show notification to user
   */
  showNotification(message, type = 'info') {
    // Use existing toast system or create simple notification
    if (window.toastManager) {
      window.toastManager.show(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
      // Fallback: create simple notification
      const notification = document.createElement('div');
      notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' :
        type === 'achievement' ? 'bg-yellow-500' :
        'bg-blue-500'
      } text-white`;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 5000);
    }
  }

  /**
   * Get user progress summary
   */
  getUserProgress() {
    return {
      ...this.userProgress,
      currentTier: this.getCurrentTier(),
      tierConfig: this.getTierConfig(this.getCurrentTier()),
      nextTier: this.getNextTier(),
      progressToNextTier: this.getProgressToNextTier()
    };
  }

  /**
   * Get next tier information
   */
  getNextTier() {
    const currentTier = this.getCurrentTier();
    const tiers = Object.keys(this.rarityTiers);
    const currentIndex = tiers.indexOf(currentTier);

    if (currentIndex < tiers.length - 1) {
      return tiers[currentIndex + 1];
    }

    return null; // Already at max tier
  }

  /**
   * Get progress to next tier as percentage
   */
  getProgressToNextTier() {
    const currentTier = this.getCurrentTier();
    const nextTier = this.getNextTier();

    if (!nextTier) return 100; // Max tier reached

    const currentMin = this.rarityTiers[currentTier].minPoints;
    const nextMin = this.rarityTiers[nextTier].minPoints;
    const currentExp = this.userProgress?.experience_points || 0;

    const progress = ((currentExp - currentMin) / (nextMin - currentMin)) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  /**
   * Get daily challenges for user
   */
  async getDailyChallenges() {
    try {
      const { data, error } = await supabase
        .from('user_daily_progress')
        .select(`
          *,
          daily_challenges (*)
        `)
        .eq('challenge_date', new Date().toISOString().split('T')[0]);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get daily challenges:', error);
      return [];
    }
  }

  /**
   * Get user achievements
   */
  async getUserAchievements() {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (*)
        `);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get user achievements:', error);
      return [];
    }
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(type = 'weekly', category = 'experience', limit = 10) {
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .select(`
          *,
          auth.users (email, raw_user_meta_data)
        `)
        .eq('leaderboard_type', type)
        .eq('category', category)
        .order('rank', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return [];
    }
  }
}

// Export singleton instance
export const gamificationService = new GamificationService();
export default gamificationService;