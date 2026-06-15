import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react'
import { GripVertical, X } from 'lucide-react'
import { Input, ResultBadge } from '@/components/ui'
import { useCellResult } from '@/features/engine'
import { cn } from '@/utils'
import { useNodesStore } from '../store/nodes.store'
import { NodeInputs } from './NodeInputs'

const handleClass =
  'size-3! rounded-full! border-2! border-white! bg-indigo-500! shadow-sm! transition-transform hover:scale-125! dark:border-zinc-800!'

/**
 * React Flow custom node: a formula card with a target handle (left, inputs) and
 * a source handle (right, output). Reads its data live from the nodes store by
 * id so edits and computed results stay reactive.
 */
export function FormulaNode({ id, selected }: NodeProps) {
  const node = useNodesStore((s) => s.nodes.find((n) => n.id === id))
  const updateNode = useNodesStore((s) => s.updateNode)
  const { deleteElements } = useReactFlow()
  const result = useCellResult(node?.name ?? '')

  if (!node) return null

  return (
    <div
      className={cn(
        'w-52 overflow-hidden rounded-xl border bg-white shadow-xl shadow-black/5 transition-colors dark:bg-zinc-800/95 dark:shadow-black/40',
        selected ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-zinc-200 dark:border-white/10',
      )}
    >
      <Handle type="target" position={Position.Left} className={handleClass} />
      <Handle type="source" position={Position.Right} className={handleClass} />

      <header className="node-drag-handle flex cursor-grab items-center gap-1 border-b border-zinc-100 px-2 py-1.5 active:cursor-grabbing dark:border-white/5">
        <GripVertical className="size-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
        <input
          aria-label="node name"
          className="nodrag min-w-0 flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none dark:text-zinc-100"
          value={node.name}
          onChange={(e) => updateNode(id, { name: e.target.value })}
        />
        <button
          className="nodrag flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
          aria-label="delete node"
          onClick={() => deleteElements({ nodes: [{ id }] })}
        >
          <X className="size-3.5" />
        </button>
      </header>

      <div className="flex flex-col gap-2 px-2.5 py-2.5">
        <NodeInputs nodeId={id} />
        <Input
          aria-label="node formula"
          className="nodrag h-8 font-mono text-[13px]"
          spellCheck={false}
          value={node.expression}
          onChange={(e) => updateNode(id, { expression: e.target.value })}
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Result</span>
          <ResultBadge result={result} />
        </div>
      </div>
    </div>
  )
}
