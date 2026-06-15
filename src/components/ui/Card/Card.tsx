import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

type CardProps = HTMLAttributes<HTMLDivElement>

/** Reusable surface/container. Presentational only. */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900',
        className,
      )}
      {...props}
    />
  )
}
