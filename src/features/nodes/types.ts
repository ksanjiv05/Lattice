/** A node placed on the whiteboard. Its value is `expression` evaluated in the
 * shared model scope, exposed to formulas under `name`. */
export interface NodeModel {
  id: string
  name: string
  expression: string
  x: number
  y: number
}
