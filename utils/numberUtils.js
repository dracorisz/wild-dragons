/**
 * Number Utility Functions
 * Global utilities for number formatting and display
 */

import { formatNumberProgressive } from '../config/designSystem';

/**
 * Format number with progressive notation (K, M, B, T, etc.)
 * @param {number} value - The number to format
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '--';
  }

  // Use the progressive formatter from design system
  return formatNumberProgressive(value);
};

/**
 * Format currency value
 * @param {number} value - The currency value to format
 * @param {string} [currency='USD'] - Currency code
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', decimals = 2) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '--';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return formatNumber(value, decimals);
  }
};

/**
 * Format percentage value
 * @param {number} value - The percentage value to format
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '--';
  }

  return `${value.toFixed(decimals)}%`;
};

/**
 * Format large numbers with progressive notation for display
 * @param {number} value - The number to format
 * @param {boolean} [showFull=false] - Whether to show full number for small values
 * @returns {string} Formatted number with appropriate notation
 */
export const formatLargeNumber = (value, showFull = false) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '--';
  }

  const absValue = Math.abs(value);

  // For small numbers, optionally show full value
  if (showFull && absValue < 1000) {
    return value.toLocaleString();
  }

  // Use progressive formatting
  return formatNumberProgressive(value);
};

/**
 * Convert CRYSp to USD equivalent
 * @param {number} crySpAmount - Amount in CRYSp
 * @param {number} [rate=0.01] - Conversion rate (1 CRYSp = rate USD)
 * @returns {number} USD equivalent
 */
export const crySpToUSD = (crySpAmount, rate = 0.01) => {
  return crySpAmount * rate;
};

/**
 * Convert USD to CRYSp equivalent
 * @param {number} usdAmount - Amount in USD
 * @param {number} [rate=0.01] - Conversion rate (1 CRYSp = rate USD)
 * @returns {number} CRYSp equivalent
 */
export const usdToCRYSp = (usdAmount, rate = 0.01) => {
  return usdAmount / rate;
};

// Export all utilities
const numberUtils = {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatNumberProgressive,
  crySpToUSD,
  usdToCRYSp,
};

export default numberUtils;