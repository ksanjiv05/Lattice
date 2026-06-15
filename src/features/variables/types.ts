/** A named formula not tied to a canvas position. Referenced by `name` from any
 * node or other variable. `step` is the factor its ▲/▼ steppers add/subtract. */
export interface VariableModel {
  id: string
  name: string
  expression: string
  step: number
}
