import type { Cell } from '@/lib/formula'
import type { NodeModel } from '@/features/nodes'
import type { VariableModel } from '@/features/variables'
import type { Connection } from '@/features/connections'
import type { GroupModel } from '@/features/groups'

/** name lookups for both nodes and groups (both are referenceable by name). */
function indexNames(nodes: NodeModel[], groups: GroupModel[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const n of nodes) if (n.name.trim()) map.set(n.id, n.name)
  for (const g of groups) if (g.name.trim()) map.set(g.id, g.name)
  return map
}

/** Members of each group, in node-array (creation) order. */
function indexChildren(nodes: NodeModel[]): Map<string, NodeModel[]> {
  const map = new Map<string, NodeModel[]>()
  for (const n of nodes) {
    if (!n.groupId) continue
    const list = map.get(n.groupId) ?? []
    list.push(n)
    map.set(n.groupId, list)
  }
  return map
}

/** Incoming wires for `targetId` as `inN` inputs, numbered from `start`. */
function inputsFor(
  connections: Connection[],
  nameById: Map<string, string>,
  targetId: string,
  start: number,
): Record<string, string> {
  const inputs: Record<string, string> = {}
  let index = start
  for (const c of connections) {
    if (c.targetId !== targetId) continue
    const sourceName = nameById.get(c.sourceId)
    if (!sourceName) continue
    index += 1
    inputs[`in${index}`] = sourceName
  }
  return inputs
}

/** childId -> groupId for the first child of each group (it inherits the
 * group's incoming wires). */
function indexFirstChildren(
  groups: GroupModel[],
  childrenByGroup: Map<string, NodeModel[]>,
): Map<string, string> {
  const map = new Map<string, string>()
  for (const g of groups) {
    const first = childrenByGroup.get(g.id)?.[0]
    if (first) map.set(first.id, g.id)
  }
  return map
}

function nodeCell(
  node: NodeModel,
  connections: Connection[],
  nameById: Map<string, string>,
  groupOfFirstChild: Map<string, string>,
): Cell {
  const direct = inputsFor(connections, nameById, node.id, 0)
  const groupId = groupOfFirstChild.get(node.id)
  const inherited = groupId
    ? inputsFor(connections, nameById, groupId, Object.keys(direct).length)
    : {}
  return { expression: node.expression, inputs: { ...direct, ...inherited } }
}

/**
 * Pure transform from the stores into the engine's symbol table.
 *
 * Groups behave like a single node from the outside:
 * - a group's value mirrors its **last** child (`g = lastChild`)
 * - a wire into a group feeds its **first** child as extra `inN` inputs
 */
export function buildModel(
  nodes: NodeModel[],
  variables: VariableModel[],
  connections: Connection[],
  groups: GroupModel[],
): Record<string, Cell> {
  const nameById = indexNames(nodes, groups)
  const childrenByGroup = indexChildren(nodes)
  const groupOfFirstChild = indexFirstChildren(groups, childrenByGroup)

  const cells: Record<string, Cell> = {}

  for (const node of nodes) {
    if (node.name.trim()) cells[node.name] = nodeCell(node, connections, nameById, groupOfFirstChild)
  }
  for (const v of variables) {
    if (v.name.trim()) cells[v.name] = { expression: v.expression }
  }
  for (const g of groups) {
    if (!g.name.trim()) continue
    const last = (childrenByGroup.get(g.id) ?? []).at(-1)
    cells[g.name] = { expression: last?.name.trim() ? last.name : '0' }
  }

  return cells
}
