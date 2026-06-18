import { Trash2 } from 'lucide-react'
import { Input, NumberInput, ResultBadge } from '@/components/ui'
import { useCellResult } from '@/features/engine'
import { useWeightsStore } from '../store/weights.store'
import type { WeightModel } from '../types'

interface WeightRowProps {
  weight: WeightModel
}

/** One editable weight: name, assigned amount, the resulting `×factor`, delete. */
export function WeightRow({ weight }: WeightRowProps) {
  const updateWeight = useWeightsStore((s) => s.updateWeight)
  const removeWeight = useWeightsStore((s) => s.removeWeight)
  // The cell value is the reduction factor (1 - amount) — what `* w` applies.
  const result = useCellResult(weight.name)

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-white/5 dark:bg-white/5">
      <div className="flex items-center gap-2">
        <Input
          aria-label="weight name"
          className="flex-1 font-semibold"
          value={weight.name}
          onChange={(e) => updateWeight(weight.id, { name: e.target.value })}
        />
        <span className="flex items-center gap-1 text-xs text-zinc-400" title="Reduction factor applied by this weight">
          <span aria-hidden="true">×</span>
          <ResultBadge result={result} />
        </span>
        <button
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
          aria-label="delete weight"
          onClick={() => removeWeight(weight.id)}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <NumberInput
        aria-label="weight amount"
        value={weight.expression}
        step={weight.step ?? 0.1}
        onChange={(expression) => updateWeight(weight.id, { expression })}
        onStepChange={(step) => updateWeight(weight.id, { step })}
      />
    </div>
  )
}
