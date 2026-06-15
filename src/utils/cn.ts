/**
 * Join conditional class names. Falsy values are dropped.
 *
 *   cn('btn', isActive && 'btn--active', undefined) // => 'btn btn--active'
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
