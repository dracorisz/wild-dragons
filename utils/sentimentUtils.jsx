/**
 * Sentiment Utility Functions
 * Helper functions for sentiment visualization and management
 */

import React from 'react';
import { FiArrowUp, FiArrowDown, FiMinus, FiEye, FiHeart } from 'react-icons/fi';
import { sentimentService } from '../services/sentimentService';
import { getCurrentTheme } from '../config/designSystem';

/**
 * Get sentiment label for display
 * @param {string} sentiment - Sentiment state
 * @returns {string} Human-readable label
 */
export function getSentimentLabel(sentiment) {
  const labels = {
    bullish: 'Bullish',
    bearish: 'Bearish',
    neutral: 'Neutral',
    watchlist: 'Watchlist',
    favorite: 'Favorite',
    wishlist: 'Wishlist'
  };
  return labels[sentiment] || 'Neutral';
}

/**
 * Get CSS class for sentiment-based row styling
 * @param {string} sentiment - Sentiment state
 * @returns {string} CSS class for row background
 */
export function getSentimentRowClass(sentiment) {
  const classes = {
    bullish: '!bg-green-900/20 hover:!bg-green-900/30',
    bearish: '!bg-red-900/20 hover:!bg-red-900/30',
    neutral: '!bg-white/5 hover:!bg-white/5',
    watchlist: '!bg-blue-900/20 hover:!bg-blue-900/30',
    favorite: '!bg-yellow-900/20 hover:!bg-red-900/30'
  };
  return classes[sentiment] || classes.neutral;
}

/**
 * Get sentiment color for text/icons
 * @param {string} sentiment - Sentiment state
 * @returns {string} Tailwind color class
 */
export function getSentimentColorClass(sentiment) {
  const colors = {
    bullish: 'text-green-400',
    bearish: 'text-red-400',
    neutral: 'text-gray-400',
    watchlist: 'text-emerald-500',
    favorite: 'text-red-500',
    wishlist: 'text-blue-500'
  };
  return colors[sentiment] || colors.neutral;
}

/**
 * Get sentiment icon component
 * @param {string} sentiment - Sentiment state
 * @param {string} size - Icon size (sm, md, lg)
 * @returns {React.ReactNode} Icon component
 */
export function getSentimentIcon(sentiment, size = 'sm') {
  const iconSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';

  switch (sentiment) {
    case 'bullish':
      return <FiArrowUp className={iconSize} />;
    case 'bearish':
      return <FiArrowDown className={iconSize} />;
    case 'watchlist':
      return <FiEye className={iconSize} />;
    case 'favorite':
      return <FiHeart className={iconSize} />;
    case 'wishlist':
      return <FiStar className={iconSize} />;
    case 'neutral':
    default:
      return <FiMinus className={iconSize} />;
  }
}

/**
 * Get sentiment statistics for display
 * @returns {Object} Formatted sentiment statistics
 */
export function getFormattedSentimentStatistics() {
  const stats = sentimentService.getSentimentStatistics();
  const theme = getCurrentTheme();

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

/**
 * Get sentiment filter options for UI
 * @returns {Array} Array of filter option objects
 */
export function getSentimentFilterOptions() {
  return sentimentService.getValidSentiments().map(sentiment => ({
    value: sentiment,
    label: getSentimentLabel(sentiment),
    color: getSentimentColorClass(sentiment).replace('text-', ''),
    icon: getSentimentIcon(sentiment, 'sm')
  }));
}

/**
 * Filter cryptos by sentiment
 * @param {Array} cryptos - Array of crypto objects
 * @param {string} sentimentFilter - Sentiment to filter by (null for all)
 * @param {Object} sentimentData - Current sentiment data
 * @returns {Array} Filtered cryptos
 */
export function filterCryptosBySentiment(cryptos, sentimentFilter, sentimentData) {
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
 * Get sentiment type (separate from action types)
 * @param {string} sentiment - Sentiment state
 * @returns {string} Sentiment type (bullish, bearish, neutral) or null for action types
 */
export function getSentimentType(sentiment) {
  const sentimentTypes = ['bullish', 'bearish', 'neutral'];
  return sentimentTypes.includes(sentiment) ? sentiment : null;
}

/**
 * Get action type (separate from sentiment types)
 * @param {string} sentiment - Sentiment state
 * @returns {string} Action type (watchlist, favorite, wishlist) or null for sentiment types
 */
export function getActionType(sentiment) {
  const actionTypes = ['watchlist', 'favorite', 'wishlist'];
  return actionTypes.includes(sentiment) ? sentiment : null;
}

/**
 * Sort cryptos by sentiment
 * @param {Array} cryptos - Array of crypto objects
 * @param {Object} sentimentData - Current sentiment data
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted cryptos
 */
export function sortCryptosBySentiment(cryptos, sentimentData, direction = 'desc') {
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
 * Get sentiment display order for sorting
 * @returns {Array} Ordered array of sentiment types for consistent sorting
 */
export function getSentimentDisplayOrder() {
  return ['bullish', 'bearish', 'neutral', 'watchlist', 'favorite'];
}

/**
 * Combined filter and sort for better performance
 * @param {Array} cryptos - Array of crypto objects
 * @param {string} sentimentFilter - Sentiment to filter by
 * @param {Object} sentimentData - Current sentiment data
 * @param {string} sortKey - Sort key
 * @param {string} sortDirection - Sort direction
 * @param {Object} marketData - Market data for additional sorting
 * @returns {Array} Filtered and sorted cryptos
 */
export function filterAndSortCryptos(cryptos, sentimentFilter, sentimentData, sortKey, sortDirection, marketData) {
  // First filter
  let filtered = filterCryptosBySentiment(cryptos, sentimentFilter, sentimentData);

  // Then sort
  if (sortKey === 'sentiment') {
    return sortCryptosBySentiment(filtered, sentimentData, sortDirection);
  } else if (sortKey && marketData) {
    return [...filtered].sort((a, b) => {
      const aValue = marketData[a.symbol]?.[sortKey] || a[sortKey] || 0;
      const bValue = marketData[b.symbol]?.[sortKey] || b[sortKey] || 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }

  return filtered;
}