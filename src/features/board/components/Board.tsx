import { useCallback, useMemo } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { FormulaNode, useNodesStore } from '@/features/nodes'
import { DeletableEdge, useConnectionsStore, useConnectNodes } from '@/features/connections'
import { AddNodeButton } from './AddNodeButton'
import styles from './Board.module.css'

const nodeTypes = { formula: FormulaNode }
const edgeTypes = { deletable: DeletableEdge }

function BoardCanvas() {
  const nodes = useNodesStore((s) => s.nodes)
  const setNodePosition = useNodesStore((s) => s.setNodePosition)
  const removeNode = useNodesStore((s) => s.removeNode)
  const connections = useConnectionsStore((s) => s.connections)
  const removeConnection = useConnectionsStore((s) => s.removeConnection)
  const connectNodes = useConnectNodes()

  const rfNodes = useMemo<Node[]>(
    () => nodes.map((n) => ({ id: n.id, type: 'formula', position: { x: n.x, y: n.y }, data: {} })),
    [nodes],
  )

  const rfEdges = useMemo<Edge[]>(
    () =>
      connections.map((c) => ({
        id: c.id,
        source: c.sourceId,
        target: c.targetId,
        type: 'deletable',
      })),
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

  return (
    <ReactFlow
      nodes={rfNodes}
      edges={rfEdges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      deleteKeyCode={['Delete', 'Backspace']}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={20} />
      <Controls />
      <MiniMap pannable zoomable />
      <Panel position="top-left">
        <AddNodeButton />
      </Panel>
    </ReactFlow>
  )
}

/** The whiteboard, powered by React Flow: pan/zoom, draggable nodes, wiring. */
export function Board() {
  return (
    <div className={styles.board}>
      <ReactFlowProvider>
        <BoardCanvas />
      </ReactFlowProvider>
    </div>
  )
}
