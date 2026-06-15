import { Plus, Variable, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { useSettingsStore } from '@/store'
import { useVariablesStore } from '../store/variables.store'
import { VariableRow } from './VariableRow'

/** Side panel for creating and editing dynamic variables and their formulas. */
export function VariablesPanel() {
  const variables = useVariablesStore((s) => s.variables)
  const addVariable = useVariablesStore((s) => s.addVariable)
  const closePanel = useSettingsStore((s) => s.toggleVariablesPanel)

  return (
    <aside className="flex h-full w-90 flex-none flex-col gap-4 overflow-y-auto border-l border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900">
      <header className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <Variable className="size-4 text-indigo-500" />
          Variables
        </h2>
        <div className="flex items-center gap-1">
          <Button onClick={addVariable}>
            <Plus className="size-4" />
            Variable
          </Button>
          <button
            onClick={closePanel}
            aria-label="close variables panel"
            className="flex size-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-100"
          >
            <X className="size-4" />
          </button>
        </div>
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
    </aside>
  )
}
