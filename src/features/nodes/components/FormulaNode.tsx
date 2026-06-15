import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react'
import { Input, ResultBadge } from '@/components/ui'
import { useCellResult } from '@/features/engine'
import { cn } from '@/utils'
import { useNodesStore } from '../store/nodes.store'
import { NodeInputs } from './NodeInputs'
import styles from './FormulaNode.module.css'

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
    <div className={cn(styles.card, selected && styles.selected)}>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <Handle type="source" position={Position.Right} className={styles.handle} />

      <header className={styles.header}>
        <Input
          aria-label="node name"
          className={cn('nodrag', styles.name)}
          value={node.name}
          onChange={(e) => updateNode(id, { name: e.target.value })}
        />
        <button
          className={cn('nodrag', styles.remove)}
          aria-label="delete node"
          onClick={() => deleteElements({ nodes: [{ id }] })}
        >
          ✕
        </button>
      </header>

      <div className={styles.body}>
        <NodeInputs nodeId={id} />
        <Input
          aria-label="node formula"
          className="nodrag"
          spellCheck={false}
          value={node.expression}
          onChange={(e) => updateNode(id, { expression: e.target.value })}
        />
        <div className={styles.result}>
          <span>=</span>
          <ResultBadge result={result} />
        </div>
      </div>
    </div>
  )
}
