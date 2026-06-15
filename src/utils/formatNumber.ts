/** Format a number for display: trims floating-point noise, keeps it compact. */
export function formatNumber(value: number): string {
  if (Number.isInteger(value)) return String(value)
  return String(Math.round(value * 1e6) / 1e6)
}
