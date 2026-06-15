/** A node placed on the whiteboard. Its value is `expression` evaluated in the
 * shared model scope, exposed to formulas under `name`. `label` is a free-form
 * description (the `name` must stay a valid identifier for formula references). */
export interface NodeModel {
  id: string
  name: string
  label: string
  expression: string
  x: number
  y: number
  /** Id of the group this node belongs to, or null if ungrouped. */
  groupId: string | null
}
