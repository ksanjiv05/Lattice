import type { CellResult } from '@/lib/formula'
import { cn, formatNumber } from '@/utils'
import styles from './ResultBadge.module.css'

interface ResultBadgeProps {
  result: CellResult
}

/** Renders a formula result: the value, an error, or an empty placeholder. */
export function ResultBadge({ result }: ResultBadgeProps) {
  if (result.error) {
    return <span className={cn(styles.badge, styles.error)} title={result.error}>error</span>
  }
  if (result.value === null) {
    return <span className={cn(styles.badge, styles.empty)}>—</span>
  }
  return <span className={cn(styles.badge, styles.value)}>{formatNumber(result.value)}</span>
}
