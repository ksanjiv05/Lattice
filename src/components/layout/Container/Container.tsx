import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'
import styles from './Container.module.css'

type ContainerProps = HTMLAttributes<HTMLDivElement>

/** Centers page content within a max width. */
export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn(styles.container, className)} {...props} />
}
