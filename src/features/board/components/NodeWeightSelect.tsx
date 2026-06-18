import { Scale } from 'lucide-react'
import { useNodesStore } from '@/features/nodes'
import { useWeightsStore } from '@/features/weights'

interface NodeWeightSelectProps {
  nodeId: string
  weightId: string | null
}

/** Dropdown to apply a weight to a node's output (reduces it by the weight). */
export function NodeWeightSelect({ nodeId, weightId }: NodeWeightSelectProps) {
  const weights = useWeightsStore((s) => s.weights)
  const setNodeWeight = useNodesStore((s) => s.setNodeWeight)

  return (
    <div className="flex shrink-0 items-center gap-1.5" title="Weight applied to this node's output">
      <Scale className="size-4 text-amber-500" />
      <select
        aria-label="applied weight"
        className="h-9 rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-900 focus:border-amber-500 focus:outline-none dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-100"
        value={weightId ?? ''}
        onChange={(e) => setNodeWeight(nodeId, e.target.value || null)}
      >
        <option value="">No weight</option>
        {weights.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  )
}
