import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

type ContainerProps = HTMLAttributes<HTMLDivElement>

/** Centers page content within a max width. */
export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-7xl p-8', className)} {...props} />
}
