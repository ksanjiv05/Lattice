/** A directed wire: the `source` node's output feeds the `target` node's input.
 * An optional `expression` transforms the flowing value, where `x` is the
 * source's value (e.g. `x * 2`, `if(x > 10, x, 0)`). Empty/`x` = pass-through. */
export interface Connection {
  id: string
  sourceId: string
  targetId: string
  expression: string
}
