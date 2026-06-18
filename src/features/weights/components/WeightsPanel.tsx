import { Plus, Scale } from 'lucide-react'
import { Button } from '@/components/ui'
import { useWeightsStore } from '../store/weights.store'
import { WeightRow } from './WeightRow'

/** Section for weights — special variables that reduce an output when applied. */
export function WeightsPanel() {
  const weights = useWeightsStore((s) => s.weights)
  const addWeight = useWeightsStore((s) => s.addWeight)

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <Scale className="size-4 text-amber-500" />
          Weights
        </h2>
        <Button onClick={addWeight}>
          <Plus className="size-4" />
          Weight
        </Button>
      </header>

      {weights.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm leading-relaxed text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          No weights yet. A weight reduces an output by its amount — assign e.g.{' '}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-white/10">0.3</code> and
          apply it with{' '}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-white/10">n1 * w1</code>{' '}
          to cut n1 by 30%.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {weights.map((weight) => (
            <WeightRow key={weight.id} weight={weight} />
          ))}
        </div>
      )}
    </section>
  )
}
