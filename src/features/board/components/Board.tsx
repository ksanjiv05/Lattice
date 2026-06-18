import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { FormulaNode } from '@/features/nodes'
import { MonitorNode } from '@/features/monitors'
import { GroupNode } from '@/features/groups'
import { DeletableEdge } from '@/features/connections'
import { useSettingsStore } from '@/store'
import { useFlowSync } from '../hooks/useFlowSync'
import { useCopyPaste } from '../hooks/useCopyPaste'
import { AddNodeButton } from './AddNodeButton'
import { AddMonitorButton } from './AddMonitorButton'
import { AddGroupButton } from './AddGroupButton'
import { FormulaBar } from './FormulaBar'

const nodeTypes = { formula: FormulaNode, monitor: MonitorNode, container: GroupNode }
const edgeTypes = { deletable: DeletableEdge }

function BoardCanvas() {
  const theme = useSettingsStore((s) => s.theme)
  useCopyPaste()
  const {
    rfNodes,
    rfEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onNodeDragStop,
    onPaneClick,
  } = useFlowSync()

  return (
    <ReactFlow
      nodes={rfNodes}
      edges={rfEdges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      colorMode={theme}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onNodeDragStop={onNodeDragStop}
      onPaneClick={onPaneClick}
      selectNodesOnDrag={false}
      selectionKeyCode={null}
      multiSelectionKeyCode={null}
      deleteKeyCode={['Delete', 'Backspace']}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} />
      <Controls showInteractive={false} className="overflow-hidden! rounded-lg! shadow-lg!" />
      <MiniMap pannable zoomable className="overflow-hidden! rounded-lg!" />
      <Panel position="top-left">
        <div className="flex gap-2">
          <AddNodeButton />
          <AddMonitorButton />
          <AddGroupButton />
        </div>
      </Panel>
    </ReactFlow>
  )
}

/** The whiteboard, powered by React Flow: pan/zoom, draggable nodes, wiring. */
export function Board() {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <FormulaBar />
      <div className="relative min-h-0 flex-1">
        <ReactFlowProvider>
          <BoardCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
