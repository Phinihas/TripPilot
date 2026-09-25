/**
 * Formats a number into Indian Rupees (INR) format.
 * Follows the Indian numbering system: ₹1,500, ₹25,000, ₹1,25,000, ₹12,50,000
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

/**
 * Format compact INR for badges/charts (e.g. ₹25K, ₹1.5L)
 */
export function formatCompactINR(amount: number | undefined | null): string {
  if (!amount || isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount}`;
}
