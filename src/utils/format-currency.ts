/**
 * Format a number as currency with the specified locale and currency code
 */
export function formatCurrency(
  value: number | string,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  // Convert string to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return '0.00';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return numValue.toFixed(2);
  }
} 