import type { InputHTMLAttributes, Ref } from 'react'
import { cn } from '@/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
}

/** Reusable text input. Presentational only. */
export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500',
        className,
      )}
      {...props}
    />
  )
}
