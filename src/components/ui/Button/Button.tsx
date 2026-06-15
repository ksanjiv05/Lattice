import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

/** Reusable, presentational button. No business logic lives here. */
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button className={cn(styles.button, styles[variant], className)} {...props} />
  )
}
