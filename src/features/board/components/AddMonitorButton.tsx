import { useReactFlow } from '@xyflow/react'
import { Activity } from 'lucide-react'
import { Button } from '@/components/ui'
import { useMonitorsStore } from '@/features/monitors'

/** Adds a monitor node at the center of the current viewport. */
export function AddMonitorButton() {
  const addMonitor = useMonitorsStore((s) => s.addMonitor)
  const { screenToFlowPosition } = useReactFlow()

  const handleAdd = () => {
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    addMonitor(center.x - 90, center.y - 40)
  }

  return (
    <Button variant="secondary" onClick={handleAdd} className="shadow-md">
      <Activity className="size-4" />
      Monitor
    </Button>
  )
}
