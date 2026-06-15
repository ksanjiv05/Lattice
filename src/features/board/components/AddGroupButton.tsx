import { useReactFlow } from '@xyflow/react'
import { Layers } from 'lucide-react'
import { Button } from '@/components/ui'
import { useNodesStore } from '@/features/nodes'
import { useGroupsStore } from '@/features/groups'

const PAD = 48
const DEFAULT_SIZE = { w: 380, h: 260 }

/** Creates a group. If a node is selected, the group wraps it; otherwise an
 * empty group is dropped at the viewport center. */
export function AddGroupButton() {
  const addGroup = useGroupsStore((s) => s.addGroup)
  const setNodeGroup = useNodesStore((s) => s.setNodeGroup)
  const { screenToFlowPosition } = useReactFlow()

  const handleAdd = () => {
    const { nodes, selectedId } = useNodesStore.getState()
    const selected = nodes.find((n) => n.id === selectedId)

    if (selected) {
      const id = addGroup(selected.x - PAD, selected.y - PAD - 36, DEFAULT_SIZE.w, DEFAULT_SIZE.h)
      setNodeGroup(selected.id, id)
      return
    }

    const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    addGroup(center.x - DEFAULT_SIZE.w / 2, center.y - DEFAULT_SIZE.h / 2, DEFAULT_SIZE.w, DEFAULT_SIZE.h)
  }

  return (
    <Button variant="secondary" onClick={handleAdd} className="shadow-md">
      <Layers className="size-4" />
      Group
    </Button>
  )
}
