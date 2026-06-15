import { useMemo } from 'react'
import { evaluateModel, type Cell, type CellResult } from '@/lib/formula'
import { useNodesStore } from '@/features/nodes'
import { useVariablesStore } from '@/features/variables'
import { useConnectionsStore } from '@/features/connections'

const EMPTY: CellResult = { value: null, error: null }

/**
 * The single source of truth for computed values. Combines every named node and
 * variable into one symbol table — wiring each node's incoming connections in as
 * `in1`, `in2`, … inputs — and evaluates them together.
 */
export function useModel(): Record<string, CellResult> {
  const nodes = useNodesStore((s) => s.nodes)
  const variables = useVariablesStore((s) => s.variables)
  const connections = useConnectionsStore((s) => s.connections)

  const cells = useMemo(() => {
    const nameById = new Map(nodes.map((n) => [n.id, n.name]))
    const map: Record<string, Cell> = {}

    for (const node of nodes) {
      if (!node.name.trim()) continue
      const inputs: Record<string, string> = {}
      let index = 0
      for (const c of connections) {
        if (c.targetId !== node.id) continue
        const sourceName = nameById.get(c.sourceId)
        if (!sourceName?.trim()) continue
        index += 1
        inputs[`in${index}`] = sourceName
      }
      map[node.name] = { expression: node.expression, inputs }
    }

    for (const v of variables) if (v.name.trim()) map[v.name] = { expression: v.expression }
    return map
  }, [nodes, variables, connections])

  return useMemo(() => evaluateModel(cells), [cells])
}

/** Result for a single name, or an empty result if it isn't in the model. */
export function useCellResult(name: string): CellResult {
  const model = useModel()
  return (name.trim() && model[name]) || EMPTY
}
