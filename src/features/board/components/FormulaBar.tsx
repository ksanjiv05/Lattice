import { Input, ResultBadge } from '@/components/ui'
import { useCellResult } from '@/features/engine'
import { useNodesStore } from '@/features/nodes'
import styles from './FormulaBar.module.css'

/**
 * Excel-style formula bar: edits the currently selected node's name and formula
 * in a roomy editor. Stays in sync with the node's inline field via the store.
 */
export function FormulaBar() {
  const node = useNodesStore((s) => s.nodes.find((n) => n.id === s.selectedId) ?? null)
  const updateNode = useNodesStore((s) => s.updateNode)
  const result = useCellResult(node?.name ?? '')

  return (
    <div className={styles.bar}>
      <span className={styles.fx} aria-hidden="true">
        ƒx
      </span>

      {node ? (
        <>
          <Input
            aria-label="selected node name"
            className={styles.nameBox}
            value={node.name}
            onChange={(e) => updateNode(node.id, { name: e.target.value })}
          />
          <textarea
            aria-label="selected node formula"
            className={styles.formula}
            spellCheck={false}
            value={node.expression}
            placeholder="Enter a formula, e.g. in1 * 2 + max(n2, 10)"
            onChange={(e) => updateNode(node.id, { expression: e.target.value })}
          />
          <div className={styles.result}>
            <span>=</span>
            <ResultBadge result={result} />
          </div>
        </>
      ) : (
        <span className={styles.hint}>Select a node to edit its formula here.</span>
      )}
    </div>
  )
}
