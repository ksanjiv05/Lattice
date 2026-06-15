/** A display-only node on the canvas that shows the live value of the node it
 * is linked to (`targetId`). It contributes nothing to the formula model. */
export interface MonitorModel {
  id: string
  x: number
  y: number
  targetId: string | null
  /** User-given label to identify this monitor. */
  label: string
}
