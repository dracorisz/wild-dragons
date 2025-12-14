/**
 * Sentiment Utility Functions - Node.js Compatible Version
 * Helper functions for sentiment operations without JSX dependencies
 * This version is designed to work with Node.js require() without React/JSX
 */

const { sentimentService } = require('../services/sentimentService');

/**
 * Filter cryptos by sentiment
 * @param {Array} cryptos - Array of crypto objects
 * @param {string} sentimentFilter - Sentiment to filter by (null for all)
 * @param {Object} sentimentData - Current sentiment data
 * @returns {Array} Filtered cryptos
 */
function filterCryptosBySentiment(cryptos, sentimentFilter, sentimentData) {
  if (!sentimentFilter || sentimentFilter === 'all' || !cryptos || cryptos.length === 0) {
    return cryptos || [];
  }

  // Optimized filtering with early exit for empty sentiment data
  if (!sentimentData || Object.keys(sentimentData).length === 0) {
    return [];
  }

  return cryptos.filter(crypto => {
    if (!crypto || !crypto.symbol) return false;
    const cryptoSentiment = sentimentData[crypto.symbol] || sentimentService.DEFAULT_SENTIMENT;
    return cryptoSentiment === sentimentFilter;
  });
}

/**
 * Sort cryptos by sentiment
 * @param {Array} cryptos - Array of crypto objects
 * @param {Object} sentimentData - Current sentiment data
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted cryptos
 */
function sortCryptosBySentiment(cryptos, sentimentData, direction = 'desc') {
  if (!cryptos || cryptos.length === 0) {
    return cryptos || [];
  }

  const sentimentOrder = sentimentService.getValidSentiments();
  const sentimentCache = {};

  // Cache sentiment lookups for performance
  return [...cryptos].sort((a, b) => {
    // Use cached sentiment or look up and cache
    const aSymbol = a.symbol;
    const bSymbol = b.symbol;

    if (!sentimentCache[aSymbol]) {
      sentimentCache[aSymbol] = sentimentData[aSymbol] || sentimentService.DEFAULT_SENTIMENT;
    }

    if (!sentimentCache[bSymbol]) {
      sentimentCache[bSymbol] = sentimentData[bSymbol] || sentimentService.DEFAULT_SENTIMENT;
    }

    const aIndex = sentimentOrder.indexOf(sentimentCache[aSymbol]);
    const bIndex = sentimentOrder.indexOf(sentimentCache[bSymbol]);

    return direction === 'asc' ? aIndex - bIndex : bIndex - aIndex;
  });
}

/**
 * Get sentiment label for display
 * @param {string} sentiment - Sentiment state
 * @returns {string} Human-readable label
 */
function getSentimentLabel(sentiment) {
  const labels = {
    bullish: 'Bullish',
    bearish: 'Bearish',
    neutral: 'Neutral',
    watchlist: 'Watchlist',
    favorite: 'Favorite'
  };
  return labels[sentiment] || 'Neutral';
}

/**
 * Get sentiment statistics for display
 * @returns {Object} Formatted sentiment statistics
 */
function getFormattedSentimentStatistics() {
  const stats = sentimentService.getSentimentStatistics();
  return {
    total: stats.total,
    distribution: stats.distribution,
    percentages: Object.entries(stats.distribution).reduce((acc, [sentiment, count]) => {
      acc[sentiment] = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
      return acc;
    }, {}),
    lastUpdated: stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'
  };
}

// Export functions for Node.js compatibility
module.exports = {
  filterCryptosBySentiment,
  sortCryptosBySentiment,
  getSentimentLabel,
  getFormattedSentimentStatistics
};