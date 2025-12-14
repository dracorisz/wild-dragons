/**
 * DevSTon Onboarding Service
 *
 * Optimized centralized service for managing user onboarding progress across all components.
 * Handles localStorage persistence for unregistered users and database sync for registered users.
 *
 * Point System:
 * - 10 points: Home page scroll task (scroll through 80% of page)
 * - 30 points: Features page exploration (click through all 6 features)
 * - 20 points: Marketplace visit
 * - 40 points: User registration
 *
 * Total: 100 points (converts to 1.00 DEVS tokens)
 */

class OnboardingService {
  constructor() {
    this.STORAGE_KEY = 'sstoken_onboarding_progress';
    this.DATABASE_KEY_PREFIX = 'sstoken_onboarding_';
    this.listeners = new Set();
    this.cache = new Map(); // Cache for progress data
    this.isInitialized = false;

    // Onboarding steps configuration
    this.onboardingSteps = [
      {
        id: 1,
        title: "Homepage Scroll",
        description: "Scroll through 80% of the homepage",
        icon: "FiHome",
        points: 10,
        page: "home",
        action: "scroll_task",
        repeatable: true,
        cooldown: "6h"
      },
      {
        id: 2,
        title: "Features Clicks",
        description: "Click through all 6 features",
        icon: "FiTrendingUp",
        points: 30,
        page: "features",
        action: "features_explore",
        repeatable: true,
        cooldown: "6h"
      },
      {
        id: 3,
        title: "Marketplace Visit",
        description: "Visit the market page",
        icon: "FiImage",
        points: 20,
        page: "market",
        action: "market_visit",
        repeatable: true,
        cooldown: "6h"
      },
      {
        id: 4,
        title: "Register",
        description: "Create your account",
        icon: "FiUser",
        points: 40,
        page: "market",
        action: "user_registration",
        repeatable: false
      },
    ];
  }

  // Subscribe to progress changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of progress changes
  notifyListeners(progress) {
    this.listeners.forEach(callback => callback(progress));
  }

  // Get current user ID (for database operations)
  getCurrentUserId() {
    // This would typically come from auth context
    // For now, return null for demo user
    return null;
  }

  // Load progress from storage with caching
  loadProgress(userId = null) {
    const user = userId || this.getCurrentUserId();
    const cacheKey = user || 'anonymous';

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let progress;
    if (user) {
      // Load from database (simulated with localStorage for now)
      const dbKey = `${this.DATABASE_KEY_PREFIX}${user}`;
      const dbData = localStorage.getItem(dbKey);
      if (dbData) {
        try {
          progress = JSON.parse(dbData);
        } catch (error) {
          console.warn('Failed to load database progress:', error);
        }
      }
    }

    // Fallback to localStorage for unregistered users
    if (!progress) {
      const localData = localStorage.getItem(this.STORAGE_KEY);
      if (localData) {
        try {
          progress = JSON.parse(localData);
        } catch (error) {
          console.warn('Failed to load local progress:', error);
        }
      }
    }

    // Merge with default steps and cache
    progress = this.mergeWithSteps(progress);
    this.cache.set(cacheKey, progress);
    return progress;
  }

  // Save progress to appropriate storage with cache invalidation
  saveProgress(progress, userId = null) {
    const user = userId || this.getCurrentUserId();
    const cacheKey = user || 'anonymous';
    
    const dataToSave = {
      ...progress,
      lastUpdated: Date.now()
    };

    if (user) {
      // Save to database (simulated with localStorage)
      const dbKey = `${this.DATABASE_KEY_PREFIX}${user}`;
      localStorage.setItem(dbKey, JSON.stringify(dataToSave));
      this.updateUserSeasonPoints(user, progress.totalPoints);
    } else {
      // Save to localStorage for unregistered users
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    }

    // Update cache and notify listeners
    this.cache.set(cacheKey, dataToSave);
    this.notifyListeners(dataToSave);

    return dataToSave;
  }

  // Merge loaded progress with current step definitions
  mergeWithSteps(progress = {}) {
    const mergedSteps = this.onboardingSteps.map(step => ({
      ...step,
      completed: progress.completedSteps?.includes(step.id) || false
    }));

    return {
      ...this.getDefaultProgress(),
      ...progress,
      steps: mergedSteps,
      lastActivity: progress.lastActivity || Date.now()
    };
  }

  // Get default progress state
  getDefaultProgress() {
    return {
      completedSteps: [],
      totalPoints: 0,
      lastActivity: Date.now(),
      steps: this.onboardingSteps.map(step => ({ ...step, completed: false })),
      stepCompletions: {}
    };
  }

  // Clear cache for specific user or all users
  clearCache(userId = null) {
    if (userId) {
      const cacheKey = userId || 'anonymous';
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
  }

  // Batch update multiple step completions
  batchCompleteSteps(stepIds, userId = null) {
    const currentProgress = this.loadProgress(userId);
    let newProgress = { ...currentProgress };
    
    stepIds.forEach(stepId => {
      const step = this.onboardingSteps.find(s => s.id === stepId);
      if (step && (!step.repeatable || !newProgress.completedSteps.includes(stepId))) {
        newProgress.completedSteps = [...newProgress.completedSteps, stepId];
        newProgress.totalPoints += step.points;
        newProgress.stepCompletions = {
          ...newProgress.stepCompletions,
          [stepId]: Date.now()
        };
      }
    });

    newProgress.lastActivity = Date.now();
    return this.saveProgress(newProgress, userId);
  }

  // Complete a specific onboarding step
  completeStep(stepId, userId = null) {
    const currentProgress = this.loadProgress(userId);
    const step = this.onboardingSteps.find(s => s.id === stepId);

    if (!step) {
      return currentProgress; // Invalid step
    }

    // Check cooldown for repeatable steps
    if (step.repeatable) {
      const lastCompletion = this.getLastStepCompletion(stepId, userId);
      if (lastCompletion && !this.isCooldownExpired(step, lastCompletion)) {
        return currentProgress; // Still on cooldown
      }
    } else if (currentProgress.completedSteps.includes(stepId)) {
      return currentProgress; // Already completed (non-repeatable)
    }

    const newProgress = {
      ...currentProgress,
      completedSteps: [...currentProgress.completedSteps, stepId],
      totalPoints: currentProgress.totalPoints + step.points,
      lastActivity: Date.now(),
      stepCompletions: {
        ...currentProgress.stepCompletions,
        [stepId]: Date.now()
      }
    };

    // Update step completion status for all steps
    newProgress.steps = newProgress.steps.map(s =>
      s.id === stepId ? { ...s, completed: true } : s
    );

    return this.saveProgress(newProgress, userId);
  }

  // Check if a step is completed (works for both repeatable and non-repeatable steps)
  isStepCompleted(stepId, userId = null) {
    const progress = this.loadProgress(userId);
    return progress.completedSteps.includes(stepId);
  }

  // Get last completion time for a step
  getLastStepCompletion(stepId, userId = null) {
    const progress = this.loadProgress(userId);
    return progress.stepCompletions?.[stepId] || null;
  }

  // Check if cooldown has expired for a repeatable step
  isCooldownExpired(step, lastCompletion) {
    if (!step.repeatable || !step.cooldown) return true;

    const cooldownMs = step.cooldown === "6h" ? 6 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const timeSinceCompletion = Date.now() - lastCompletion;

    return timeSinceCompletion >= cooldownMs;
  }

  // Check if a repeatable step can be completed (cooldown expired)
  canCompleteStep(stepId, userId = null) {
    const step = this.onboardingSteps.find(s => s.id === stepId);
    if (!step) return false;

    if (!step.repeatable) {
      return !this.isStepCompleted(stepId, userId);
    }

    const lastCompletion = this.getLastStepCompletion(stepId, userId);
    return !lastCompletion || this.isCooldownExpired(step, lastCompletion);
  }

  // Get progress percentage
  getProgressPercentage(userId = null) {
    const progress = this.loadProgress(userId);
    const totalSteps = this.onboardingSteps.length;
    
    // Use synchronized completedSteps array for consistency
    const completedSteps = progress.completedSteps.length;
    
    return Math.round((completedSteps / totalSteps) * 100);
  }

  // Get next incomplete step
  getNextStep(userId = null) {
    const progress = this.loadProgress(userId);

    // For repeatable steps, check if they can be completed (cooldown expired)
    // For non-repeatable steps, check if they're not completed
    return this.onboardingSteps.find(step => {
      if (step.repeatable) {
        return this.canCompleteStep(step.id, userId);
      } else {
        return !progress.completedSteps.includes(step.id);
      }
    });
  }

  // Transfer progress from localStorage to database when user registers
  transferProgressToDatabase(userId) {
    const localProgress = localStorage.getItem(this.STORAGE_KEY);

    if (localProgress) {
      try {
        const progress = JSON.parse(localProgress);
        // Save to database
        this.saveProgress(progress, userId);
        // Clear local storage
        localStorage.removeItem(this.STORAGE_KEY);

        console.log('Progress transferred to database for user:', userId);
        return true;
      } catch (error) {
        console.error('Failed to transfer progress:', error);
        return false;
      }
    }

    return false;
  }

  // Update user's season points in database (simulated)
  updateUserSeasonPoints(userId, totalPoints) {
    // In production, this would update the users table
    // For now, we'll just log it
    console.log(`Updated season points for user ${userId}: ${totalPoints}`);
  }

  // Reset progress (for testing/admin purposes)
  resetProgress(userId = null) {
    const user = userId || this.getCurrentUserId();

    if (user) {
      const dbKey = `${this.DATABASE_KEY_PREFIX}${user}`;
      localStorage.removeItem(dbKey);
    }

    localStorage.removeItem(this.STORAGE_KEY);
    return this.getDefaultProgress();
  }

  // Get detailed progress summary
  getProgressSummary(userId = null) {
    const progress = this.loadProgress(userId);
    
    // Use synchronized completedSteps array for consistency
    const completedStepsCount = progress.completedSteps.length;

    return {
      totalPoints: progress.totalPoints,
      completedSteps: completedStepsCount,
      totalSteps: this.onboardingSteps.length,
      percentage: this.getProgressPercentage(userId),
      nextStep: this.getNextStep(userId),
      steps: progress.steps,
      lastActivity: progress.lastActivity,
      devsTokens: Math.floor(progress.totalPoints / 100),
      remainingPoints: progress.totalPoints % 100
    };
  }
}

// Export singleton instance
export const onboardingService = new OnboardingService();
export default onboardingService;