import { useCallback, useMemo } from 'react'
import type {
  Edge,
  Node,
  NodeMouseHandler,
  OnConnect,
  OnEdgesChange,
  OnNodeDrag,
  OnNodesChange,
} from '@xyflow/react'
import { useNodesStore } from '@/features/nodes'
import { useConnectionsStore, useConnectNodes } from '@/features/connections'

// Node visuals come from the store via `id`, so RF node data stays empty.
// A shared frozen object keeps its reference stable across renders.
const EMPTY_DATA = Object.freeze({})

/**
 * Bridges the zustand stores (source of truth) to React Flow's controlled
 * `nodes`/`edges` + change callbacks. Keeping this out of the component avoids
 * a giant render function and isolates the sync logic.
 */
export function useFlowSync() {
  const nodes = useNodesStore((s) => s.nodes)
  const selectedId = useNodesStore((s) => s.selectedId)
  const setNodePosition = useNodesStore((s) => s.setNodePosition)
  const removeNode = useNodesStore((s) => s.removeNode)
  const select = useNodesStore((s) => s.select)
  const connections = useConnectionsStore((s) => s.connections)
  const removeConnection = useConnectionsStore((s) => s.removeConnection)
  const connectNodes = useConnectNodes()

  const rfNodes = useMemo<Node[]>(
    () =>
      nodes.map((n) => ({
        id: n.id,
        type: 'formula',
        position: { x: n.x, y: n.y },
        data: EMPTY_DATA,
        // Controlled selection — without this React Flow resets selection on
        // every node update (e.g. each keystroke), dropping the formula bar.
        selected: n.id === selectedId,
      })),
    [nodes, selectedId],
  )

  const rfEdges = useMemo<Edge[]>(
    () =>
      connections.map((c) => ({ id: c.id, source: c.sourceId, target: c.targetId, type: 'deletable' })),
    [connections],
  )

  const onNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          setNodePosition(change.id, change.position.x, change.position.y)
        } else if (change.type === 'remove') {
          removeNode(change.id)
        }
      }
    },
    [setNodePosition, removeNode],
  )

  const onEdgesChange = useCallback<OnEdgesChange>(
    (changes) => {
      for (const change of changes) if (change.type === 'remove') removeConnection(change.id)
    },
    [removeConnection],
  )

  const onConnect = useCallback<OnConnect>(
    (conn) => {
      if (conn.source && conn.target) connectNodes(conn.source, conn.target)
    },
    [connectNodes],
  )

  // Drive selection directly from interactions (single click / drag) so it
  // never races with React Flow's internal selection under controlled `selected`.
  const onNodeClick = useCallback<NodeMouseHandler>((_, node) => select(node.id), [select])
  const onNodeDragStart = useCallback<OnNodeDrag>((_, node) => select(node.id), [select])
  const onPaneClick = useCallback(() => select(null), [select])

  return {
    rfNodes,
    rfEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onNodeDragStart,
    onPaneClick,
  }
}
