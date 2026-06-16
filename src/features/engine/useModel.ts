import { useMemo } from 'react'
import { evaluateModel, type CellResult } from '@/lib/formula'
import { useNodesStore } from '@/features/nodes'
import { useVariablesStore } from '@/features/variables'
import { useConnectionsStore } from '@/features/connections'
import { useGroupsStore } from '@/features/groups'
import { useWeightsStore } from '@/features/weights'
import { buildModel } from './buildModel'

const EMPTY: CellResult = { value: null, error: null }

/**
 * The single source of truth for computed values. Combines every named node,
 * variable, group and wire into one symbol table and evaluates them together.
 */
export function useModel(): Record<string, CellResult> {
  const nodes = useNodesStore((s) => s.nodes)
  const variables = useVariablesStore((s) => s.variables)
  const connections = useConnectionsStore((s) => s.connections)
  const groups = useGroupsStore((s) => s.groups)
  const weights = useWeightsStore((s) => s.weights)

  const cells = useMemo(
    () => buildModel(nodes, variables, connections, groups, weights),
    [nodes, variables, connections, groups, weights],
  )

  return useMemo(() => evaluateModel(cells), [cells])
}

/** Result for a single name, or an empty result if it isn't in the model. */
export function useCellResult(name: string): CellResult {
  const model = useModel()
  return (name.trim() && model[name]) || EMPTY
}
