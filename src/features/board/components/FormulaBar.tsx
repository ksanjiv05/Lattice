import { useRef } from 'react'
import { Sigma } from 'lucide-react'
import { Input, ResultBadge } from '@/components/ui'
import { useCellResult } from '@/features/engine'
import { useNodesStore } from '@/features/nodes'
import { FunctionsHelp } from './FunctionsHelp'
import { NodeWeightSelect } from './NodeWeightSelect'
import { NodeColorSelect } from './NodeColorSelect'

const isDefaultExpr = (expr: string) => {
  const t = expr.trim()
  return t === '' || t === '0'
}

/**
 * Excel-style formula bar: edits the currently selected node's name and formula
 * in a roomy, single-row editor. Syncs with the node's inline field via the store.
 */
export function FormulaBar() {
  const node = useNodesStore((s) =>
    s.selectedIds.length === 1 ? (s.nodes.find((n) => n.id === s.selectedIds[0]) ?? null) : null,
  )
  const updateNode = useNodesStore((s) => s.updateNode)
  const result = useCellResult(node?.name ?? '')

  const inputRef = useRef<HTMLInputElement>(null)
  const caret = useRef<number | null>(null)

  const rememberCaret = () => {
    caret.current = inputRef.current?.selectionStart ?? null
  }

  /** Insert `name(|)` into the formula at the caret (replacing a default `0`). */
  const insertFunction = (name: string) => {
    if (!node) return
    const snippet = `${name}()`
    const expr = node.expression
    let next: string
    let cursor: number
    if (isDefaultExpr(expr)) {
      next = snippet
      cursor = name.length + 1
    } else {
      const pos = caret.current ?? expr.length
      next = expr.slice(0, pos) + snippet + expr.slice(pos)
      cursor = pos + name.length + 1
    }
    updateNode(node.id, { expression: next })
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(cursor, cursor)
      caret.current = cursor
    })
  }

  return (
    <div className="flex h-14 flex-none items-center gap-3 border-b border-zinc-200 bg-white px-4 dark:border-white/5 dark:bg-zinc-900">
      <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-500">
        <Sigma className="size-4" />
        fx
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-3">
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
              ref={inputRef}
              aria-label="selected node formula"
              className="flex-1 font-mono"
              spellCheck={false}
              value={node.expression}
              placeholder="Enter a formula, e.g. clamp(in1 * 2, 0, 100)"
              onChange={(e) => updateNode(node.id, { expression: e.target.value })}
              onSelect={rememberCaret}
              onBlur={rememberCaret}
            />
            <div className="flex shrink-0 items-center gap-2 text-sm text-zinc-400">
              <span>=</span>
              <ResultBadge result={result} />
            </div>
            <NodeColorSelect nodeId={node.id} color={node.color} />
            <NodeWeightSelect nodeId={node.id} weightId={node.weightId} />
          </>
        ) : (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Select a node to edit its formula here.
          </span>
        )}
      </div>

      <FunctionsHelp onPick={node ? insertFunction : null} />
    </div>
  )
}
