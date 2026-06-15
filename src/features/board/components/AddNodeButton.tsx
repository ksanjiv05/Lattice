import { useReactFlow } from '@xyflow/react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { useNodesStore } from '@/features/nodes'

/** Adds a node at the center of the current viewport. */
export function AddNodeButton() {
  const addNode = useNodesStore((s) => s.addNode)
  const { screenToFlowPosition } = useReactFlow()

  const handleAdd = () => {
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    addNode(center.x - 90, center.y - 40)
  }

  return (
    <Button onClick={handleAdd} className="shadow-md">
      <Plus className="size-4" />
      Node
    </Button>
  )
}
