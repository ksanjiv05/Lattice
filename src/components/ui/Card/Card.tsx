import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'
import styles from './Card.module.css'

type CardProps = HTMLAttributes<HTMLDivElement>

/** Reusable surface/container. Presentational only. */
export function Card({ className, ...props }: CardProps) {
  return <div className={cn(styles.card, className)} {...props} />
}
