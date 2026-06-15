import { useCallback } from 'react'
import { useNodesStore } from '@/features/nodes'
import { useConnectionsStore } from '../store/connections.store'

/** A node's value is "untouched" (safe to auto-fill) when it's blank or `0`. */
const isDefaultExpression = (expression: string): boolean => {
  const trimmed = expression.trim()
  return trimmed === '' || trimmed === '0'
}

/**
 * Connects two nodes and, when the target's formula is still the default,
 * seeds it with the newly wired input so the upstream value flows through by
 * default (e.g. the first wire sets the formula to `in1`). Custom formulas are
 * left untouched.
 */
export function useConnectNodes() {
  const addConnection = useConnectionsStore((s) => s.addConnection)
  const updateNode = useNodesStore((s) => s.updateNode)

  return useCallback(
    (sourceId: string, targetId: string) => {
      const before = useConnectionsStore.getState().connections.length
      addConnection(sourceId, targetId)

      const connections = useConnectionsStore.getState().connections
      if (connections.length === before) return // rejected (self-link or duplicate)

      const target = useNodesStore.getState().nodes.find((n) => n.id === targetId)
      if (!target || !isDefaultExpression(target.expression)) return

      const inputIndex = connections.filter((c) => c.targetId === targetId).length
      updateNode(targetId, { expression: `in${inputIndex}` })
    },
    [addConnection, updateNode],
  )
}
