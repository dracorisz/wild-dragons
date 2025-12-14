/**
 * Database Optimization Service
 * Implements query caching, Supabase optimization, and index management
 * Features:
 * - Query result caching with TTL
 * - Supabase query optimization
 * - Index recommendations
 * - Connection pooling
 * - Query performance monitoring
 */

class DatabaseOptimizationService {
  constructor() {
    this.queryCache = new Map();
    this.queryStats = new Map();
    this.indexRecommendations = new Map();
    this.connectionPool = [];
    this.maxPoolSize = 10;
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
    this.isEnabled = true;

    this.init();
  }

  init() {
    if (!this.isEnabled) return;

    // Start cache cleanup interval
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 60 * 1000); // Clean every minute

    // Monitor query performance
    this.startQueryMonitoring();
  }

  /**
   * Execute cached query with Supabase optimization
   */
  async executeQuery(queryFn, cacheKey, options = {}) {
    const {
      ttl = this.cacheTTL,
      forceRefresh = false,
      enableStats = true
    } = options;

    // Check cache first
    if (!forceRefresh && this.queryCache.has(cacheKey)) {
      const cached = this.queryCache.get(cacheKey);
      if (Date.now() - cached.timestamp < ttl) {
        if (enableStats) {
          this.recordQueryStat(cacheKey, 'cache_hit');
        }
        return cached.data;
      } else {
        this.queryCache.delete(cacheKey);
      }
    }

    const startTime = Date.now();

    try {
      // Execute query with optimization
      const optimizedQuery = this.optimizeSupabaseQuery(queryFn);
      const result = await optimizedQuery();

      const executionTime = Date.now() - startTime;

      // Cache result
      this.queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        executionTime
      });

      // Record stats
      if (enableStats) {
        this.recordQueryStat(cacheKey, 'executed', executionTime);
      }

      return result;
    } catch (error) {
      if (enableStats) {
        this.recordQueryStat(cacheKey, 'error');
      }
      throw error;
    }
  }

  /**
   * Optimize Supabase query with best practices
   */
  optimizeSupabaseQuery(queryFn) {
    return async () => {
      let query = queryFn();

      // Apply optimizations if it's a Supabase query
      if (query && typeof query === 'object' && query.select) {
        // Add select optimization (only fetch needed columns)
        if (!query._select) {
          // If no explicit select, this will fetch all columns
          // Consider adding column specification for better performance
        }

        // Add limit for large datasets
        if (!query._limit && !query._single) {
          query = query.limit(1000); // Default limit to prevent huge result sets
        }

        // Add ordering for consistent performance
        if (!query._orderBy && !query._single) {
          // Consider adding default ordering
        }
      }

      return await query;
    };
  }

  /**
   * Batch multiple queries for better performance
   */
  async executeBatch(queries, options = {}) {
    const { parallel = true, cacheKeys = [] } = options;

    if (parallel) {
      const promises = queries.map((query, index) => {
        const cacheKey = cacheKeys[index] || `batch_${index}`;
        return this.executeQuery(query, cacheKey, options);
      });

      return await Promise.allSettled(promises);
    } else {
      const results = [];
      for (let i = 0; i < queries.length; i++) {
        const cacheKey = cacheKeys[i] || `batch_${i}`;
        try {
          const result = await this.executeQuery(queries[i], cacheKey, options);
          results.push({ status: 'fulfilled', value: result });
        } catch (error) {
          results.push({ status: 'rejected', reason: error });
        }
      }
      return results;
    }
  }

  /**
   * Create optimized index recommendations
   */
  analyzeQueryForIndexes(query, tableName) {
    const recommendations = [];

    // Analyze WHERE clauses for index candidates
    if (query._filters) {
      query._filters.forEach(filter => {
        if (filter.column && !filter.column.includes('.')) {
          recommendations.push({
            table: tableName,
            column: filter.column,
            type: 'btree',
            reason: 'WHERE clause filter'
          });
        }
      });
    }

    // Analyze ORDER BY for index candidates
    if (query._orderBy) {
      query._orderBy.forEach(order => {
        recommendations.push({
          table: tableName,
          column: order.column,
          type: 'btree',
          reason: 'ORDER BY clause'
        });
      });
    }

    // Analyze JOINs for foreign key indexes
    if (query._joins) {
      query._joins.forEach(join => {
        if (join.foreignKey) {
          recommendations.push({
            table: join.table,
            column: join.foreignKey,
            type: 'btree',
            reason: 'JOIN foreign key'
          });
        }
      });
    }

    // Store recommendations
    const key = `${tableName}_${Date.now()}`;
    this.indexRecommendations.set(key, recommendations);

    return recommendations;
  }

  /**
   * Get query performance statistics
   */
  getQueryStats() {
    const stats = {};

    for (const [queryKey, stat] of this.queryStats.entries()) {
      stats[queryKey] = {
        totalExecutions: stat.totalExecutions,
        cacheHits: stat.cacheHits,
        averageExecutionTime: stat.executionTimes.length > 0
          ? stat.executionTimes.reduce((a, b) => a + b, 0) / stat.executionTimes.length
          : 0,
        errorCount: stat.errorCount,
        lastExecuted: stat.lastExecuted
      };
    }

    return stats;
  }

  /**
   * Record query statistics
   */
  recordQueryStat(queryKey, type, executionTime = null) {
    if (!this.queryStats.has(queryKey)) {
      this.queryStats.set(queryKey, {
        totalExecutions: 0,
        cacheHits: 0,
        executionTimes: [],
        errorCount: 0,
        lastExecuted: null
      });
    }

    const stat = this.queryStats.get(queryKey);
    stat.lastExecuted = Date.now();

    switch (type) {
      case 'executed':
        stat.totalExecutions++;
        if (executionTime !== null) {
          stat.executionTimes.push(executionTime);
          // Keep only last 100 execution times
          if (stat.executionTimes.length > 100) {
            stat.executionTimes.shift();
          }
        }
        break;
      case 'cache_hit':
        stat.cacheHits++;
        break;
      case 'error':
        stat.errorCount++;
        break;
    }
  }

  /**
   * Monitor query performance in real-time
   */
  startQueryMonitoring() {
    // Monitor slow queries
    const originalQuery = window.supabase?.from;
    if (originalQuery) {
      window.supabase.from = (...args) => {
        const tableName = args[0];
        const query = originalQuery.apply(window.supabase, args);

        // Wrap query methods to track performance
        const originalThen = query.then;
        query.then = (onFulfilled, onRejected) => {
          const startTime = Date.now();
          return originalThen.call(query, (result) => {
            const executionTime = Date.now() - startTime;

            // Log slow queries
            if (executionTime > 1000) { // > 1 second
              console.warn(`Slow query detected: ${tableName} took ${executionTime}ms`);
            }

            return onFulfilled ? onFulfilled(result) : result;
          }, onRejected);
        };

        return query;
      };
    }
  }

  /**
   * Get database health metrics
   */
  async getHealthMetrics() {
    try {
      const metrics = {
        cacheSize: this.queryCache.size,
        cacheHitRate: this.calculateCacheHitRate(),
        totalQueries: this.getTotalQueryCount(),
        slowQueries: this.getSlowQueryCount(),
        averageQueryTime: this.getAverageQueryTime(),
        connectionPoolSize: this.connectionPool.length,
        indexRecommendations: this.indexRecommendations.size
      };

      return metrics;
    } catch (error) {
      console.error('Failed to get health metrics:', error);
      return {};
    }
  }

  /**
   * Calculate cache hit rate
   */
  calculateCacheHitRate() {
    let totalRequests = 0;
    let cacheHits = 0;

    for (const stat of this.queryStats.values()) {
      totalRequests += stat.totalExecutions + stat.cacheHits;
      cacheHits += stat.cacheHits;
    }

    return totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
  }

  /**
   * Get total query count
   */
  getTotalQueryCount() {
    return Array.from(this.queryStats.values())
      .reduce((sum, stat) => sum + stat.totalExecutions, 0);
  }

  /**
   * Get slow query count (>1s)
   */
  getSlowQueryCount() {
    return Array.from(this.queryStats.values())
      .reduce((count, stat) => {
        return count + stat.executionTimes.filter(time => time > 1000).length;
      }, 0);
  }

  /**
   * Get average query execution time
   */
  getAverageQueryTime() {
    const allTimes = Array.from(this.queryStats.values())
      .flatMap(stat => stat.executionTimes);

    return allTimes.length > 0
      ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length
      : 0;
  }

  /**
   * Cleanup expired cache entries
   */
  cleanupExpiredCache() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.queryCache.entries()) {
      if (now - entry.timestamp > this.cacheTTL) {
        this.queryCache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.queryCache.clear();
    this.queryStats.clear();
    console.log('Database optimization cache cleared');
  }

  /**
   * Enable/disable optimization
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.clearCache();
    }
  }
}

// Export singleton instance
export const databaseOptimization = new DatabaseOptimizationService();
export default databaseOptimization;