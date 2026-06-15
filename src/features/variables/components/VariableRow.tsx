import { Button, Input, NumberInput, ResultBadge } from '@/components/ui'
import { useCellResult } from '@/features/engine'
import { useVariablesStore } from '../store/variables.store'
import type { VariableModel } from '../types'
import styles from './VariablesPanel.module.css'

interface VariableRowProps {
  variable: VariableModel
}

/** One editable variable: name, formula, live result, delete. */
export function VariableRow({ variable }: VariableRowProps) {
  const updateVariable = useVariablesStore((s) => s.updateVariable)
  const removeVariable = useVariablesStore((s) => s.removeVariable)
  const result = useCellResult(variable.name)

  return (
    <div className={styles.row}>
      <Input
        aria-label="variable name"
        className={styles.name}
        value={variable.name}
        onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
      />
      <NumberInput
        aria-label="variable formula"
        value={variable.expression}
        step={variable.step ?? 1}
        onChange={(expression) => updateVariable(variable.id, { expression })}
        onStepChange={(step) => updateVariable(variable.id, { step })}
      />
      <ResultBadge result={result} />
      <Button variant="ghost" aria-label="delete variable" onClick={() => removeVariable(variable.id)}>
        ✕
      </Button>
    </div>
  )
}
