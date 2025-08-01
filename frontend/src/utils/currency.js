/**
 * Currency utility functions for Nepali Rupees (NRs)
 */

// Currency configuration
export const CURRENCY_CONFIG = {
  symbol: 'NRs',
  code: 'NPR',
  name: 'Nepali Rupee',
  decimalPlaces: 2,
  thousandSeparator: ',',
  decimalSeparator: '.',
  symbolPosition: 'before' // 'before' or 'after'
};

/**
 * Format a number as currency in Nepali Rupees
 * @param {number|string} amount - The amount to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const config = { ...CURRENCY_CONFIG, ...options };
  
  // Convert to number and handle invalid inputs
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return `${config.symbol} 0${config.decimalSeparator}${'0'.repeat(config.decimalPlaces)}`;
  }

  // Format the number with decimal places
  const formattedNumber = numAmount.toFixed(config.decimalPlaces);
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = formattedNumber.split('.');
  
  // Add thousand separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
  
  // Combine parts
  const formattedAmount = `${formattedInteger}${config.decimalSeparator}${decimalPart}`;
  
  // Add currency symbol
  return config.symbolPosition === 'before' 
    ? `${config.symbol} ${formattedAmount}`
    : `${formattedAmount} ${config.symbol}`;
};

/**
 * Parse a currency string to get the numeric value
 * @param {string} currencyString - The currency string to parse
 * @returns {number} The numeric value
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove currency symbol and separators, keep only numbers and decimal point
  const cleanString = currencyString
    .replace(new RegExp(`\\${CURRENCY_CONFIG.symbol}`, 'g'), '')
    .replace(new RegExp(`\\${CURRENCY_CONFIG.thousandSeparator}`, 'g'), '')
    .replace(new RegExp(`\\${CURRENCY_CONFIG.decimalSeparator}`, 'g'), '.')
    .trim();
  
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format currency for input fields (without symbol)
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted number string
 */
export const formatCurrencyInput = (amount) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '';
  return numAmount.toFixed(CURRENCY_CONFIG.decimalPlaces);
};

/**
 * Get currency symbol
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = () => CURRENCY_CONFIG.symbol;

/**
 * Get currency code
 * @returns {string} Currency code
 */
export const getCurrencyCode = () => CURRENCY_CONFIG.code;

/**
 * Validate currency amount
 * @param {string|number} amount - Amount to validate
 * @returns {boolean} True if valid
 */
export const isValidCurrencyAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount >= 0;
};
