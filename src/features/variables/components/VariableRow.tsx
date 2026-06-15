import { Trash2 } from 'lucide-react'
import { Input, NumberInput, ResultBadge } from '@/components/ui'
import { useCellResult } from '@/features/engine'
import { useVariablesStore } from '../store/variables.store'
import type { VariableModel } from '../types'

interface VariableRowProps {
  variable: VariableModel
}

/** One editable variable: name, formula, live result, delete. */
export function VariableRow({ variable }: VariableRowProps) {
  const updateVariable = useVariablesStore((s) => s.updateVariable)
  const removeVariable = useVariablesStore((s) => s.removeVariable)
  const result = useCellResult(variable.name)

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-white/5 dark:bg-white/5">
      <div className="flex items-center gap-2">
        <Input
          aria-label="variable name"
          className="flex-1 font-semibold"
          value={variable.name}
          onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
        />
        <ResultBadge result={result} />
        <button
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
          aria-label="delete variable"
          onClick={() => removeVariable(variable.id)}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <NumberInput
        aria-label="variable formula"
        value={variable.expression}
        step={variable.step ?? 1}
        onChange={(expression) => updateVariable(variable.id, { expression })}
        onStepChange={(step) => updateVariable(variable.id, { step })}
      />
    </div>
  )
}
