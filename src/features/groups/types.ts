/** A container ("higher-level") node that wraps child nodes. Its value mirrors
 * its last child; an incoming wire feeds its first child. `name` is its formula
 * reference; `label` is a free-form description. */
export interface GroupModel {
  id: string
  name: string
  label: string
  x: number
  y: number
  width: number
  height: number
}
