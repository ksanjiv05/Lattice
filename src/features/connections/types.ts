/** A directed wire: the `source` node's output feeds the `target` node's input. */
export interface Connection {
  id: string
  sourceId: string
  targetId: string
}
