/**
 * DevSTon Wallet Utilities
 * Helper functions for wallet operations and formatting
 */

// Format wallet address for display
export function formatAddress(address, startLength = 6, endLength = 4) {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

// Format balance with appropriate decimals
export function formatBalance(balance, decimals = 4) {
  if (!balance) return '0';

  const num = parseFloat(balance);
  if (isNaN(num)) return '0';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
    useGrouping: true
  });
}

// Format currency amount
export function formatCurrency(amount, currency = 'USD', decimals = 2) {
  if (!amount) return `0 ${currency}`;

  const num = parseFloat(amount);
  if (isNaN(num)) return `0 ${currency}`;

  return `${num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })} ${currency}`;
}

// Check if address is valid Ethereum address
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Get wallet display name
export function getWalletDisplayName(walletType) {
  const walletNames = {
    'metamask': 'MetaMask',
    'walletconnect': 'WalletConnect',
    'coinbase': 'Coinbase Wallet',
    'trust': 'Trust Wallet',
    'rainbow': 'Rainbow',
    'argent': 'Argent',
    'gnosis': 'Gnosis Safe'
  };

  return walletNames[walletType] || walletType;
}

// Calculate transaction fee
export function calculateTransactionFee(gasPrice, gasLimit) {
  if (!gasPrice || !gasLimit) return '0';

  const fee = (parseFloat(gasPrice) * parseFloat(gasLimit)) / 1e18; // Convert to ETH
  return fee.toFixed(6);
}

// Get network name from chain ID
export function getNetworkName(chainId) {
  const networks = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai',
    56: 'Binance Smart Chain',
    97: 'BSC Testnet'
  };

  return networks[chainId] || `Chain ${chainId}`;
}

// Check if wallet is connected
export function isWalletConnected() {
  return typeof window !== 'undefined' &&
         window.ethereum &&
         window.ethereum.selectedAddress;
}

// Get connected wallet address
export function getConnectedAddress() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return window.ethereum.selectedAddress || null;
  }
  return null;
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

export default {
  formatAddress,
  formatBalance,
  formatCurrency,
  isValidAddress,
  getWalletDisplayName,
  calculateTransactionFee,
  getNetworkName,
  isWalletConnected,
  getConnectedAddress,
  copyToClipboard
};