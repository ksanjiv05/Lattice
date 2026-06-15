import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { FormulaNode } from '@/features/nodes'
import { DeletableEdge } from '@/features/connections'
import { useFlowSync } from '../hooks/useFlowSync'
import { AddNodeButton } from './AddNodeButton'
import { FormulaBar } from './FormulaBar'
import styles from './Board.module.css'

const nodeTypes = { formula: FormulaNode }
const edgeTypes = { deletable: DeletableEdge }

function BoardCanvas() {
  const {
    rfNodes,
    rfEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onNodeDragStart,
    onPaneClick,
  } = useFlowSync()

  return (
    <ReactFlow
      nodes={rfNodes}
      edges={rfEdges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onNodeDragStart={onNodeDragStart}
      onPaneClick={onPaneClick}
      selectNodesOnDrag={false}
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
      <FormulaBar />
      <div className={styles.canvas}>
        <ReactFlowProvider>
          <BoardCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
