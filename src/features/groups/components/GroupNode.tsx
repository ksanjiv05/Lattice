import {
  Handle,
  NodeResizeControl,
  Position,
  useReactFlow,
  type NodeProps,
} from '@xyflow/react'
import { Hash, Layers, X } from 'lucide-react'
import { ResultBadge } from '@/components/ui'
import { useCellResult } from '@/features/engine'
import { cn } from '@/utils'
import { useGroupsStore } from '../store/groups.store'

const handleClass =
  'size-3! rounded-full! border-2! border-white! bg-violet-500! shadow-sm! transition-transform hover:scale-125! dark:border-zinc-900!'

/** Container node: wraps child nodes; its value mirrors the last child and an
 * incoming wire feeds the first child. */
export function GroupNode({ id, selected }: NodeProps) {
  const group = useGroupsStore((s) => s.groups.find((g) => g.id === id))
  const updateGroup = useGroupsStore((s) => s.updateGroup)
  const setGroupSize = useGroupsStore((s) => s.setGroupSize)
  const { deleteElements } = useReactFlow()
  const result = useCellResult(group?.name ?? '')

  if (!group) return null

  return (
    <div
      className={cn(
        'flex size-full flex-col rounded-2xl border-2 border-dashed bg-violet-500/5 transition-colors',
        selected ? 'border-violet-500' : 'border-violet-400/60 dark:border-violet-400/40',
      )}
    >
      <Handle type="target" position={Position.Left} className={handleClass} />
      <Handle type="source" position={Position.Right} className={handleClass} />

      <header className="flex items-center gap-1.5 rounded-t-2xl border-b border-violet-400/30 bg-violet-500/10 px-2.5 py-1.5">
        <Layers className="size-4 shrink-0 text-violet-500" />
        <input
          aria-label="group label"
          className="nodrag min-w-0 flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:font-normal placeholder:text-zinc-400 dark:text-zinc-100"
          value={group.label ?? ''}
          placeholder="Group"
          onChange={(e) => updateGroup(id, { label: e.target.value })}
        />
        <span className="flex items-center gap-0.5 text-zinc-400">
          <Hash className="size-3" />
          <input
            aria-label="group name"
            title="Reference name used in formulas"
            className="nodrag w-12 bg-transparent font-mono text-xs text-zinc-600 outline-none dark:text-zinc-300"
            value={group.name}
            onChange={(e) => updateGroup(id, { name: e.target.value })}
          />
        </span>
        <ResultBadge result={result} />
        <button
          className="nodrag flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
          aria-label="delete group"
          onClick={() => deleteElements({ nodes: [{ id }] })}
        >
          <X className="size-3.5" />
        </button>
      </header>

      <NodeResizeControl
        position="bottom-right"
        minWidth={240}
        minHeight={160}
        onResize={(_, params) => setGroupSize(id, params.width, params.height)}
        style={{ background: 'transparent', border: 'none' }}
      >
        <div className="absolute bottom-1 right-1 size-3 cursor-nwse-resize rounded-sm border-b-2 border-r-2 border-violet-400" />
      </NodeResizeControl>
    </div>
  )
}
