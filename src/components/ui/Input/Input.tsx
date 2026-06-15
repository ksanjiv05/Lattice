import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils'
import styles from './Input.module.css'

type InputProps = InputHTMLAttributes<HTMLInputElement>

/** Reusable text input. Presentational only. */
export function Input({ className, ...props }: InputProps) {
  return <input className={cn(styles.input, className)} {...props} />
}
