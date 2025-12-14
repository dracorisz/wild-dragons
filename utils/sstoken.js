/**
 * DevSTon Utility Functions
 * Helper functions for DevSTon operations and formatting
 */

// Contract address patterns
export const SSTOKEN_CONTRACT_ADDRESSES = {
  PLACEHOLDER: "0xSST00000000000000000000000000000000000B8A",
  // Add deployed contract addresses here when available
  ETHEREUM: "0x0000000000000000000000000000000000000000",
  BSC: "0x0000000000000000000000000000000000000000",
  POLYGON: "0x0000000000000000000000000000000000000000"
}

/**
 * Format DevSTon contract address for display
 * @param {string} address - Full contract address
 * @param {number} startChars - Number of characters to show at start (default: 4)
 * @param {number} endChars - Number of characters to show at end (default: 3)
 * @returns {string} Formatted address
 */
export const formatContractAddress = (
  address = SSTOKEN_CONTRACT_ADDRESSES.PLACEHOLDER,
  startChars = 4,
  endChars = 3
) => {
  if (!address || typeof address !== 'string') {
    return 'Contract address not available'
  }
  
  if (address.length <= startChars + endChars + 3) {
    return address // Don't format if too short
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Validate DevSTon contract address format
 * @param {string} address - Contract address to validate
 * @returns {boolean} True if valid format
 */
export const isValidContractAddress = (address) => {
  if (!address) return false
  
  // Check for Ethereum format (0x followed by 40 hex characters)
  const ethPattern = /^0x[a-fA-F0-9]{40}$/
  
  // Check for DevSTon placeholder format
  const sstPattern = /^0xSST[0-9A-Fa-f]*B8A$/
  
  return ethPattern.test(address) || sstPattern.test(address)
}

/**
 * Get DevSTon contract address for specific network
 * @param {string} network - Network name (ethereum, bsc, polygon)
 * @returns {string} Contract address for the network
 */
export const getContractAddressForNetwork = (network = 'ethereum') => {
  const networkKey = network.toUpperCase()
  return SSTOKEN_CONTRACT_ADDRESSES[networkKey] || SSTOKEN_CONTRACT_ADDRESSES.PLACEHOLDER
}

/**
 * DevSTon token metadata
 */
export const SSTOKEN_TOKEN_INFO = {
  SYMBOL: "SST",
  NAME: "DevSTon",
  DECIMALS: 18,
  TOTAL_SUPPLY: "10000000000000000000000000000", // 10B tokens in wei
  NETWORK_SUPPORT: ["ethereum", "bsc", "polygon"],
  COLORS: {
    PRIMARY: "#00D4AA", // Teal
    SECONDARY: "#FFB800", // Gold
    TEXT: "#FFFFFF"
  },
  CONTRACT_ADDRESS: SSTOKEN_CONTRACT_ADDRESSES.PLACEHOLDER
}

/**
 * Copy text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

/**
 * Generate DevSTon icon SVG as data URI
 * @param {number} size - Icon size in pixels
 * @returns {string} Data URI string
 */
export const generateSSTokenIcon = (size = 64) => {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#00D4AA"/>
      <circle cx="12" cy="12" r="8" fill="#FFB800"/>
      <text x="12" y="16" text-anchor="middle" fill="#000" font-size="8" font-weight="bold">SST</text>
    </svg>
  `
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Parse DevSTon amount from wei
 * @param {string|number} weiAmount - Amount in wei
 * @returns {string} Formatted amount
 */
export const parseSSTokenAmount = (weiAmount) => {
  if (!weiAmount) return "0"
  
  try {
    const amount = Number(weiAmount) / Math.pow(10, SSTOKEN_TOKEN_INFO.DECIMALS)
    return amount.toLocaleString('en-US', { 
      maximumFractionDigits: 2 
    })
  } catch (err) {
    console.error('Error parsing DevSTon amount:', err)
    return "0"
  }
}

/**
 * Convert DevSTon amount to wei
 * @param {string|number} sstAmount - Amount in DevSTon
 * @returns {string} Amount in wei
 */
export const toWei = (sstAmount) => {
  if (!sstAmount) return "0"
  
  try {
    const wei = Number(sstAmount) * Math.pow(10, SSTOKEN_TOKEN_INFO.DECIMALS)
    return wei.toString()
  } catch (err) {
    console.error('Error converting to wei:', err)
    return "0"
  }
}

export default {
  SSTOKEN_CONTRACT_ADDRESSES,
  formatContractAddress,
  isValidContractAddress,
  getContractAddressForNetwork,
  SSTOKEN_TOKEN_INFO,
  copyToClipboard,
  generateSSTokenIcon,
  parseSSTokenAmount,
  toWei
}