import { useMemo } from 'react'
import { useNodesStore } from '@/features/nodes'
import { useConnectionsStore } from '../store/connections.store'

export interface NodeInput {
  id: string
  /** Identifier usable in the node's formula, e.g. `in1`. */
  local: string
  sourceName: string
}

/**
 * The ordered inputs wired into a node. The Nth incoming connection is exposed
 * to that node's formula as `inN` and carries the source node's value.
 */
export function useNodeInputs(nodeId: string): NodeInput[] {
  const connections = useConnectionsStore((s) => s.connections)
  const nodes = useNodesStore((s) => s.nodes)

  return useMemo(() => {
    const nameById = new Map(nodes.map((n) => [n.id, n.name]))
    const inputs: NodeInput[] = []
    let index = 0
    for (const c of connections) {
      if (c.targetId !== nodeId) continue
      index += 1
      inputs.push({ id: c.id, local: `in${index}`, sourceName: nameById.get(c.sourceId) ?? '?' })
    }
    return inputs
  }, [connections, nodes, nodeId])
}
