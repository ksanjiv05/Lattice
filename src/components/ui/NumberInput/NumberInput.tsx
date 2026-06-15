import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/utils'
import { Input } from '../Input'

interface NumberInputProps {
  value: string
  onChange: (value: string) => void
  /** Amount the steppers add or subtract per click. */
  step?: number
  /** When provided, an inline field lets the user edit the step factor. */
  onStepChange?: (step: number) => void
  'aria-label'?: string
  className?: string
}

const NUMERIC = /^-?\d*\.?\d+$/

const stepBtn =
  'flex w-6 flex-1 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-white/10 dark:hover:text-zinc-100'

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
    <div className={cn('flex w-full items-center gap-1.5', className)}>
      <div className="relative flex min-w-0 flex-1">
        <Input
          aria-label={ariaLabel}
          className="pr-7"
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute inset-y-1 right-1 flex flex-col">
          <button
            type="button"
            className={stepBtn}
            aria-label="increment"
            disabled={!numeric}
            onClick={() => stepBy(step)}
          >
            <ChevronUp className="size-3" />
          </button>
          <button
            type="button"
            className={stepBtn}
            aria-label="decrement"
            disabled={!numeric}
            onClick={() => stepBy(-step)}
          >
            <ChevronDown className="size-3" />
          </button>
        </div>
      </div>

      {onStepChange && (
        <label
          className="flex flex-none items-center gap-1 text-xs font-medium text-zinc-400"
          title="Increment step / factor"
        >
          <span>Δ</span>
          <input
            type="number"
            className="h-9 w-14 rounded-lg border border-zinc-300 bg-white px-2 text-xs text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-100"
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
