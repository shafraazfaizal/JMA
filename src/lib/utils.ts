// ============================================
// JMA UTILITY FUNCTIONS
// ============================================

/**
 * Format a number as GBP currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate Gift Aid (25% on top of donation)
 */
export function calculateGiftAid(amount: number): number {
  return Math.round(amount * 0.25 * 100) / 100;
}

/**
 * Calculate progress percentage, capped at 100
 */
export function calcProgress(raised: number, goal: number): number {
  return Math.min(Math.round((raised / goal) * 100), 100);
}

/**
 * Format large numbers with commas
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-GB").format(n);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Class name merger — simple utility
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
