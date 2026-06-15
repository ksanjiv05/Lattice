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
import { useMonitorsStore } from '@/features/monitors'
import { useConnectionsStore, useConnectNodes } from '@/features/connections'

// Node visuals come from the store via `id`, so RF node data stays empty.
// A shared frozen object keeps its reference stable across renders.
const EMPTY_DATA = Object.freeze({})

const rfNode = (id: string, type: string, x: number, y: number, selected: boolean): Node => ({
  id,
  type,
  position: { x, y },
  data: EMPTY_DATA,
  selected,
  // Cards are mostly `nodrag` inputs, so drag from the header handle.
  dragHandle: '.node-drag-handle',
})

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
  const monitors = useMonitorsStore((s) => s.monitors)
  const setMonitorPosition = useMonitorsStore((s) => s.setMonitorPosition)
  const removeMonitor = useMonitorsStore((s) => s.removeMonitor)
  const connections = useConnectionsStore((s) => s.connections)
  const removeConnection = useConnectionsStore((s) => s.removeConnection)
  const connectNodes = useConnectNodes()

  // Controlled selection — without `selected`, React Flow resets it on every
  // node update (e.g. each keystroke), dropping the formula bar.
  const rfNodes = useMemo<Node[]>(
    () => [
      ...nodes.map((n) => rfNode(n.id, 'formula', n.x, n.y, n.id === selectedId)),
      ...monitors.map((m) => rfNode(m.id, 'monitor', m.x, m.y, m.id === selectedId)),
    ],
    [nodes, monitors, selectedId],
  )

  const monitorIds = useMemo(() => new Set(monitors.map((m) => m.id)), [monitors])

  const rfEdges = useMemo<Edge[]>(
    () =>
      connections.map((c) => ({ id: c.id, source: c.sourceId, target: c.targetId, type: 'deletable' })),
    [connections],
  )

  const onNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          const move = monitorIds.has(change.id) ? setMonitorPosition : setNodePosition
          move(change.id, change.position.x, change.position.y)
        } else if (change.type === 'remove') {
          if (monitorIds.has(change.id)) removeMonitor(change.id)
          else removeNode(change.id)
        }
      }
    },
    [monitorIds, setMonitorPosition, setNodePosition, removeMonitor, removeNode],
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

  // Drive selection directly from interactions (single click / drag end) so it
  // never races with React Flow's internal selection under controlled `selected`.
  // Selecting on drag *stop* (not start) avoids re-rendering mid-drag.
  const onNodeClick = useCallback<NodeMouseHandler>((_, node) => select(node.id), [select])
  const onNodeDragStop = useCallback<OnNodeDrag>((_, node) => select(node.id), [select])
  const onPaneClick = useCallback(() => select(null), [select])

  return {
    rfNodes,
    rfEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onNodeDragStop,
    onPaneClick,
  }
}
