import { useReactFlow, type NodeProps } from '@xyflow/react'
import { Activity, GripVertical, X } from 'lucide-react'
import { useCellResult } from '@/features/engine'
import { useNodesStore } from '@/features/nodes'
import { cn, formatNumber } from '@/utils'
import { useMonitorsStore } from '../store/monitors.store'

/** React Flow node that mirrors the live value of the node it's linked to. */
export function MonitorNode({ id, selected }: NodeProps) {
  const monitor = useMonitorsStore((s) => s.monitors.find((m) => m.id === id))
  const setTarget = useMonitorsStore((s) => s.setTarget)
  const setLabel = useMonitorsStore((s) => s.setLabel)
  const nodes = useNodesStore((s) => s.nodes)
  const { deleteElements } = useReactFlow()

  const target = nodes.find((n) => n.id === monitor?.targetId) ?? null
  const result = useCellResult(target?.name ?? '')

  if (!monitor) return null

  return (
    <div
      className={cn(
        'w-52 overflow-hidden rounded-xl border bg-white shadow-xl shadow-black/5 transition-colors dark:bg-zinc-800/95 dark:shadow-black/40',
        selected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-zinc-200 dark:border-white/10',
      )}
    >
      <header className="node-drag-handle flex cursor-grab items-center gap-1 border-b border-zinc-100 px-2 py-1.5 active:cursor-grabbing dark:border-white/5">
        <GripVertical className="size-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
        <Activity className="size-3.5 shrink-0 text-emerald-500" />
        <input
          aria-label="monitor label"
          className="nodrag min-w-0 flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:font-normal placeholder:text-zinc-400 dark:text-zinc-100"
          value={monitor.label}
          placeholder="Monitor"
          onChange={(e) => setLabel(id, e.target.value)}
        />
        <button
          className="nodrag flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
          aria-label="delete monitor"
          onClick={() => deleteElements({ nodes: [{ id }] })}
        >
          <X className="size-3.5" />
        </button>
      </header>

      <div className="flex flex-col gap-2 p-2.5">
        <select
          aria-label="monitored node"
          className="nodrag h-9 w-full rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-100"
          value={monitor.targetId ?? ''}
          onChange={(e) => setTarget(id, e.target.value || null)}
        >
          <option value="">Select a node…</option>
          {nodes.map((n) => (
            <option key={n.id} value={n.id}>
              {n.label?.trim() ? `${n.label} (${n.name})` : n.name}
            </option>
          ))}
        </select>

        <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5">
          <MonitorValue hasTarget={!!target} error={result.error} value={result.value} />
          {target && (
            <div className="mt-0.5 text-xs text-zinc-400">
              {target.label?.trim() ? `${target.label} · ${target.name}` : target.name}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface MonitorValueProps {
  hasTarget: boolean
  error: string | null
  value: number | null
}

/** The large value readout, or a placeholder / error. */
function MonitorValue({ hasTarget, error, value }: MonitorValueProps) {
  if (!hasTarget) return <span className="text-sm text-zinc-400">No node linked</span>
  if (error) return <span className="text-sm font-medium text-red-500">error</span>
  return (
    <span className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
      {value !== null ? formatNumber(value) : '—'}
    </span>
  )
}
