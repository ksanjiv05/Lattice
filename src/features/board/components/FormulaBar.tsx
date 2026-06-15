import { Sigma } from 'lucide-react'
import { Input, ResultBadge } from '@/components/ui'
import { useCellResult } from '@/features/engine'
import { useNodesStore } from '@/features/nodes'

/**
 * Excel-style formula bar: edits the currently selected node's name and formula
 * in a roomy, single-row editor. Syncs with the node's inline field via the store.
 */
export function FormulaBar() {
  const node = useNodesStore((s) => s.nodes.find((n) => n.id === s.selectedId) ?? null)
  const updateNode = useNodesStore((s) => s.updateNode)
  const result = useCellResult(node?.name ?? '')

  return (
    <div className="flex h-14 flex-none items-center gap-3 border-b border-zinc-200 bg-white px-4 dark:border-white/5 dark:bg-zinc-900">
      <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-500">
        <Sigma className="size-4" />
        fx
      </span>

      {node ? (
        <>
          <Input
            aria-label="selected node name"
            className="w-28 shrink-0 font-semibold"
            value={node.name}
            onChange={(e) => updateNode(node.id, { name: e.target.value })}
          />
          <div className="h-6 w-px shrink-0 bg-zinc-200 dark:bg-white/10" />
          <Input
            aria-label="selected node formula"
            className="flex-1 font-mono"
            spellCheck={false}
            value={node.expression}
            placeholder="Enter a formula, e.g. in1 * 2 + max(n2, 10)"
            onChange={(e) => updateNode(node.id, { expression: e.target.value })}
          />
          <div className="flex shrink-0 items-center gap-2 text-sm text-zinc-400">
            <span>=</span>
            <ResultBadge result={result} />
          </div>
        </>
      ) : (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Select a node to edit its formula here.
        </span>
      )}
    </div>
  )
}
