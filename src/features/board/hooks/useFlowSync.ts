import { useCallback, useMemo, useState } from 'react'
import type {
  Edge,
  Node,
  NodeMouseHandler,
  OnConnect,
  OnEdgesChange,
  OnNodeDrag,
  OnNodesChange,
} from '@xyflow/react'
import { useNodesStore, type NodeModel } from '@/features/nodes'
import { useMonitorsStore, type MonitorModel } from '@/features/monitors'
import { useGroupsStore, type GroupModel } from '@/features/groups'
import { useConnectionsStore, useConnectNodes } from '@/features/connections'

// Node visuals come from the store via `id`, so RF node data stays empty.
const EMPTY_DATA = Object.freeze({})
const APPROX_NODE = { w: 208, h: 120 }

/** Map the stores into React Flow nodes (groups render behind everything). */
function buildRfNodes(
  groups: GroupModel[],
  nodes: NodeModel[],
  monitors: MonitorModel[],
  selectedIds: string[],
): Node[] {
  const isSelected = new Set(selectedIds)
  const groupNodes: Node[] = groups.map((g) => ({
    id: g.id,
    type: 'container',
    position: { x: g.x, y: g.y },
    style: { width: g.width, height: g.height },
    data: EMPTY_DATA,
    selected: isSelected.has(g.id),
    zIndex: 0,
  }))
  const make = (id: string, type: string, x: number, y: number): Node => ({
    id,
    type,
    position: { x, y },
    data: EMPTY_DATA,
    selected: isSelected.has(id),
    dragHandle: '.node-drag-handle',
    zIndex: 1,
  })
  return [
    ...groupNodes,
    ...nodes.map((n) => make(n.id, 'formula', n.x, n.y)),
    ...monitors.map((m) => make(m.id, 'monitor', m.x, m.y)),
  ]
}

/** Routes React Flow node changes (move/resize/remove) + drop-to-group to the
 * correct store, keeping the group/monitor/node concerns out of `useFlowSync`. */
function useNodeChanges() {
  const setNodePosition = useNodesStore((s) => s.setNodePosition)
  const removeNode = useNodesStore((s) => s.removeNode)
  const select = useNodesStore((s) => s.select)
  const setNodeGroup = useNodesStore((s) => s.setNodeGroup)
  const moveMembersBy = useNodesStore((s) => s.moveMembersBy)
  const ungroup = useNodesStore((s) => s.ungroup)
  const monitors = useMonitorsStore((s) => s.monitors)
  const setMonitorPosition = useMonitorsStore((s) => s.setMonitorPosition)
  const removeMonitor = useMonitorsStore((s) => s.removeMonitor)
  const groups = useGroupsStore((s) => s.groups)
  const setGroupPosition = useGroupsStore((s) => s.setGroupPosition)
  const removeGroup = useGroupsStore((s) => s.removeGroup)

  const groupById = useMemo(() => new Map(groups.map((g) => [g.id, g])), [groups])
  const monitorIds = useMemo(() => new Set(monitors.map((m) => m.id)), [monitors])

  const moveById = useCallback(
    (id: string, pos: { x: number; y: number }) => {
      const group = groupById.get(id)
      if (group) {
        setGroupPosition(id, pos.x, pos.y)
        moveMembersBy(id, pos.x - group.x, pos.y - group.y)
      } else if (monitorIds.has(id)) {
        setMonitorPosition(id, pos.x, pos.y)
      } else {
        setNodePosition(id, pos.x, pos.y)
      }
    },
    [groupById, monitorIds, setGroupPosition, moveMembersBy, setMonitorPosition, setNodePosition],
  )

  const removeById = useCallback(
    (id: string) => {
      if (groupById.has(id)) {
        ungroup(id)
        removeGroup(id)
      } else if (monitorIds.has(id)) {
        removeMonitor(id)
      } else {
        removeNode(id)
      }
    },
    [groupById, monitorIds, ungroup, removeGroup, removeMonitor, removeNode],
  )

  // NOTE: 'dimensions' changes are intentionally ignored. React Flow emits them
  // on every measurement; reacting with setGroupSize would loop. Group resizing
  // is handled by the NodeResizeControl's onResize callback instead.
  const onNodesChange = useCallback<OnNodesChange>(
    (changes) => {
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          moveById(change.id, change.position)
        } else if (change.type === 'remove') {
          removeById(change.id)
        }
      }
    },
    [moveById, removeById],
  )

  // On drop: select, and join/leave a group based on the node's center.
  const onNodeDragStop = useCallback<OnNodeDrag>(
    (_, node) => {
      // Keep a multi-selection intact when dragging one of its members.
      if (!useNodesStore.getState().selectedIds.includes(node.id)) select(node.id)
      if (node.type !== 'formula') return
      const cx = node.position.x + (node.measured?.width ?? APPROX_NODE.w) / 2
      const cy = node.position.y + (node.measured?.height ?? APPROX_NODE.h) / 2
      const container = groups.find(
        (g) => cx >= g.x && cx <= g.x + g.width && cy >= g.y && cy <= g.y + g.height,
      )
      setNodeGroup(node.id, container?.id ?? null)
    },
    [select, groups, setNodeGroup],
  )

  return { onNodesChange, onNodeDragStop }
}

/**
 * Bridges the zustand stores (source of truth) to React Flow's controlled
 * `nodes`/`edges` + change callbacks.
 */
export function useFlowSync() {
  const nodes = useNodesStore((s) => s.nodes)
  const selectedIds = useNodesStore((s) => s.selectedIds)
  const select = useNodesStore((s) => s.select)
  const toggleSelect = useNodesStore((s) => s.toggleSelect)
  const monitors = useMonitorsStore((s) => s.monitors)
  const groups = useGroupsStore((s) => s.groups)
  const connections = useConnectionsStore((s) => s.connections)
  const removeConnection = useConnectionsStore((s) => s.removeConnection)
  const connectNodes = useConnectNodes()
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  const rfNodes = useMemo(
    () => buildRfNodes(groups, nodes, monitors, selectedIds),
    [groups, nodes, monitors, selectedIds],
  )

  const rfEdges = useMemo<Edge[]>(
    () =>
      connections.map((c) => ({
        id: c.id,
        source: c.sourceId,
        target: c.targetId,
        type: 'deletable',
        selected: c.id === selectedEdgeId,
      })),
    [connections, selectedEdgeId],
  )

  const onEdgesChange = useCallback<OnEdgesChange>(
    (changes) => {
      for (const change of changes) {
        if (change.type === 'remove') removeConnection(change.id)
        else if (change.type === 'select') setSelectedEdgeId(change.selected ? change.id : null)
      }
    },
    [removeConnection],
  )

  const onConnect = useCallback<OnConnect>(
    (conn) => {
      if (conn.source && conn.target) connectNodes(conn.source, conn.target)
    },
    [connectNodes],
  )

  const onNodeClick = useCallback<NodeMouseHandler>(
    (e, node) => (e.shiftKey ? toggleSelect(node.id) : select(node.id)),
    [select, toggleSelect],
  )
  const onPaneClick = useCallback(() => {
    select(null)
    setSelectedEdgeId(null)
  }, [select])
  const { onNodesChange, onNodeDragStop } = useNodeChanges()

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
