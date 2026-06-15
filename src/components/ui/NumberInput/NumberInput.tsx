import { cn } from '@/utils'
import { Input } from '../Input'
import styles from './NumberInput.module.css'

interface NumberInputProps {
  value: string
  onChange: (value: string) => void
  /** Amount the ▲/▼ buttons add or subtract per click. */
  step?: number
  /** When provided, an inline field lets the user edit the step factor. */
  onStepChange?: (step: number) => void
  'aria-label'?: string
  className?: string
}

const NUMERIC = /^-?\d*\.?\d+$/

/**
 * A formula-capable text field with ▲/▼ steppers. The steppers add/subtract
 * `step` on click when the value is a plain number (disabled for formulas).
 * Pass `onStepChange` to expose an inline control for editing the step factor.
 */
export function NumberInput({
  value,
  onChange,
  step = 1,
  onStepChange,
  className,
  'aria-label': ariaLabel,
}: NumberInputProps) {
  const numeric = NUMERIC.test(value.trim())

  const stepBy = (delta: number) => {
    const current = Number(value)
    if (!Number.isFinite(current)) return
    onChange(String(Math.round((current + delta) * 1e6) / 1e6))
  }

  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.main}>
        <Input
          aria-label={ariaLabel}
          className={styles.field}
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className={styles.steppers}>
          <button
            type="button"
            className={styles.step}
            aria-label="increment"
            disabled={!numeric}
            onClick={() => stepBy(step)}
          >
            ▲
          </button>
          <button
            type="button"
            className={styles.step}
            aria-label="decrement"
            disabled={!numeric}
            onClick={() => stepBy(-step)}
          >
            ▼
          </button>
        </div>
      </div>

      {onStepChange && (
        <label className={styles.stepFactor} title="Increment step / factor">
          <span className={styles.stepLabel}>Δ</span>
          <input
            type="number"
            className={styles.stepInput}
            aria-label="step factor"
            value={step}
            min={0}
            step="any"
            onChange={(e) => {
              const next = Number(e.target.value)
              if (Number.isFinite(next)) onStepChange(next)
            }}
          />
        </label>
      )}
    </div>
  )
}
