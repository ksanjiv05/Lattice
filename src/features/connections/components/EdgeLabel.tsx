import { EdgeLabelRenderer, useReactFlow } from '@xyflow/react'
import { X } from 'lucide-react'
import { useConnectionsStore } from '../store/connections.store'

interface EdgeLabelProps {
  id: string
  labelX: number
  labelY: number
  selected: boolean
  hovered: boolean
  setHovered: (value: boolean) => void
}

/** Midpoint controls for a wire: editable transform expression + delete. */
export function EdgeLabel({ id, labelX, labelY, selected, hovered, setHovered }: EdgeLabelProps) {
  const { deleteElements } = useReactFlow()
  const expression = useConnectionsStore((s) => s.connections.find((c) => c.id === id)?.expression ?? '')
  const setExpression = useConnectionsStore((s) => s.setConnectionExpression)

  const active = hovered || selected
  const showChip = !selected && expression.trim() !== ''
  if (!active && !showChip) return null

  return (
    <EdgeLabelRenderer>
      <div
        className="nodrag nopan pointer-events-auto absolute flex items-center gap-1"
        style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {selected && (
          <input
            aria-label="wire expression"
            spellCheck={false}
            placeholder="x"
            className="h-6 w-28 rounded-md border border-indigo-400 bg-white px-1.5 text-center font-mono text-[11px] text-zinc-900 shadow-sm focus:outline-none dark:bg-zinc-800 dark:text-zinc-100"
            value={expression}
            onChange={(e) => setExpression(id, e.target.value)}
          />
        )}
        {showChip && (
          <span className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[10px] text-indigo-600 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-indigo-300 dark:ring-white/10">
            {expression}
          </span>
        )}
        {active && (
          <button
            className="flex size-5 items-center justify-center rounded-full border border-zinc-300 bg-white text-red-500 shadow-sm hover:bg-red-500/15 dark:border-zinc-600 dark:bg-zinc-800"
            aria-label="delete connection"
            onClick={(e) => {
              e.stopPropagation()
              deleteElements({ edges: [{ id }] })
            }}
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    </EdgeLabelRenderer>
  )
}
