import type { Cell } from '@/lib/formula'
import type { NodeModel } from '@/features/nodes'
import type { VariableModel } from '@/features/variables'
import type { Connection } from '@/features/connections'
import type { GroupModel } from '@/features/groups'
import type { WeightModel } from '@/features/weights'

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

const PASS_THROUGH = new Set(['', 'x'])

/**
 * A symbol carrying each wire's flowing value. A pass-through wire (empty or
 * `x`) reuses the source's name; a transforming wire (`x * 2`, `if(x>10,x,0)`)
 * gets a synthetic cell that evaluates the expression with `x` = source value.
 */
function buildEdgeCells(
  connections: Connection[],
  nameById: Map<string, string>,
): { edgeCells: Record<string, Cell>; valueByConn: Map<string, string> } {
  const edgeCells: Record<string, Cell> = {}
  const valueByConn = new Map<string, string>()
  for (const c of connections) {
    const sourceName = nameById.get(c.sourceId)
    if (!sourceName) continue
    const expr = (c.expression ?? '').trim()
    if (PASS_THROUGH.has(expr)) {
      valueByConn.set(c.id, sourceName)
    } else {
      const key = `__edge_${c.id}`
      edgeCells[key] = { expression: expr, inputs: { x: sourceName } }
      valueByConn.set(c.id, key)
    }
  }
  return { edgeCells, valueByConn }
}

/** Incoming wires for `targetId` as `inN` inputs, numbered from `start`. */
function inputsFor(
  connections: Connection[],
  valueByConn: Map<string, string>,
  targetId: string,
  start: number,
): Record<string, string> {
  const inputs: Record<string, string> = {}
  let index = start
  for (const c of connections) {
    if (c.targetId !== targetId) continue
    const valueName = valueByConn.get(c.id)
    if (!valueName) continue
    index += 1
    inputs[`in${index}`] = valueName
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
  valueByConn: Map<string, string>,
  groupOfFirstChild: Map<string, string>,
  weightNameById: Map<string, string>,
): Cell {
  const direct = inputsFor(connections, valueByConn, node.id, 0)
  const groupId = groupOfFirstChild.get(node.id)
  const inherited = groupId
    ? inputsFor(connections, valueByConn, groupId, Object.keys(direct).length)
    : {}
  // An assigned weight multiplies the node's whole result (reducing it).
  const weightName = node.weightId ? weightNameById.get(node.weightId) : undefined
  const expression = weightName ? `(${node.expression.trim() || '0'}) * ${weightName}` : node.expression
  return { expression, inputs: { ...direct, ...inherited } }
}

/** A group's value mirrors its last child (or 0 when empty). */
function groupCells(
  groups: GroupModel[],
  childrenByGroup: Map<string, NodeModel[]>,
): Record<string, Cell> {
  const cells: Record<string, Cell> = {}
  for (const g of groups) {
    if (!g.name.trim()) continue
    const last = (childrenByGroup.get(g.id) ?? []).at(-1)
    cells[g.name] = { expression: last?.name.trim() ? last.name : '0' }
  }
  return cells
}

/** A weight resolves to `1 - (amount)` — the factor that, when multiplied,
 * reduces an output by the assigned amount. */
function weightCells(weights: WeightModel[]): Record<string, Cell> {
  const cells: Record<string, Cell> = {}
  for (const w of weights) {
    if (w.name.trim()) cells[w.name] = { expression: `1 - (${w.expression.trim() || '0'})` }
  }
  return cells
}

/**
 * Pure transform from the stores into the engine's symbol table.
 *
 * Groups behave like a single node from the outside:
 * - a group's value mirrors its **last** child (`g = lastChild`)
 * - a wire into a group feeds its **first** child as extra `inN` inputs
 *
 * Weights are variables that resolve to `1 - (expression)`, so multiplying an
 * output by a weight reduces it by the assigned amount.
 */
export function buildModel(
  nodes: NodeModel[],
  variables: VariableModel[],
  connections: Connection[],
  groups: GroupModel[],
  weights: WeightModel[],
): Record<string, Cell> {
  const nameById = indexNames(nodes, groups)
  const childrenByGroup = indexChildren(nodes)
  const groupOfFirstChild = indexFirstChildren(groups, childrenByGroup)
  const weightNameById = new Map(
    weights.filter((w) => w.name.trim()).map((w) => [w.id, w.name]),
  )
  const { edgeCells, valueByConn } = buildEdgeCells(connections, nameById)

  const cells: Record<string, Cell> = { ...edgeCells }

  for (const node of nodes) {
    if (node.name.trim()) {
      cells[node.name] = nodeCell(node, connections, valueByConn, groupOfFirstChild, weightNameById)
    }
  }
  for (const v of variables) {
    if (v.name.trim()) cells[v.name] = { expression: v.expression }
  }
  Object.assign(cells, groupCells(groups, childrenByGroup), weightCells(weights))

  return cells
}
