/** A weight is a special variable: it resolves to `1 - (expression)`, so
 * multiplying an output by a weight reduces it by the assigned amount
 * (e.g. weight 0.3 → factor 0.7 → `n1 * w1` cuts n1 by 30%). */
export interface WeightModel {
  id: string
  name: string
  /** The assigned weight amount (0–1, or any numeric expression). */
  expression: string
  step: number
}
