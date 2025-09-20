/**
 * Utility functions for formatting data for display
 */

/**
 * Format a date and time for display
 * @param dateString - The date string to format
 * @param options - Optional Intl.DateTimeFormatOptions
 * @returns Formatted date and time string
 */
export function formatDateTime(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Format a currency value for display
 * @param value - The value to format
 * @param currency - The currency code (default: USD)
 * @param locale - The locale (default: en-US)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string,
  currency = 'USD',
  locale = 'en-US'
): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

/**
 * Format a number for display
 * @param value - The value to format
 * @param options - Optional Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export function formatNumber(
  value: number | string,
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', options).format(numericValue);
} 