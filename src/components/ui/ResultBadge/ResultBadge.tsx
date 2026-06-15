import { TriangleAlert } from 'lucide-react'
import type { CellResult } from '@/lib/formula'
import { formatNumber } from '@/utils'

interface ResultBadgeProps {
  result: CellResult
}

const badge =
  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold tabular-nums ring-1 ring-inset'

/** Renders a formula result: the value, an error, or an empty placeholder. */
export function ResultBadge({ result }: ResultBadgeProps) {
  if (result.error) {
    return (
      <span className={`${badge} bg-red-500/10 text-red-500 ring-red-500/20 dark:text-red-400`} title={result.error}>
        <TriangleAlert className="size-3" />
        error
      </span>
    )
  }
  if (result.value === null) {
    return <span className={`${badge} bg-zinc-500/10 text-zinc-400 ring-zinc-500/20`}>—</span>
  }
  return (
    <span className={`${badge} bg-indigo-500/10 text-indigo-600 ring-indigo-500/20 dark:text-indigo-300`}>
      {formatNumber(result.value)}
    </span>
  )
}
