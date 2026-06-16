import { Plus, Variable } from 'lucide-react'
import { Button } from '@/components/ui'
import { useVariablesStore } from '../store/variables.store'
import { VariableRow } from './VariableRow'

/** Section for creating and editing dynamic variables and their formulas. */
export function VariablesPanel() {
  const variables = useVariablesStore((s) => s.variables)
  const addVariable = useVariablesStore((s) => s.addVariable)

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <Variable className="size-4 text-indigo-500" />
          Variables
        </h2>
        <Button onClick={addVariable}>
          <Plus className="size-4" />
          Variable
        </Button>
      </header>

      {variables.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm leading-relaxed text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          No variables yet. Add one and reference nodes or other variables by name, e.g.{' '}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-white/10">
            n1 * 2 + max(n2, 10)
          </code>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {variables.map((variable) => (
            <VariableRow key={variable.id} variable={variable} />
          ))}
        </div>
      )}
    </section>
  )
}
