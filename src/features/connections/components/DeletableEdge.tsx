import { useState } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react'
import styles from './DeletableEdge.module.css'

/**
 * Edge that reveals a delete button at its midpoint on hover or when selected.
 * Clicking it removes the wire (which syncs back to the connections store).
 */
export function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
}: EdgeProps) {
  const { deleteElements } = useReactFlow()
  const [hovered, setHovered] = useState(false)
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const active = hovered || selected

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: active ? '#b8bcff' : '#646cff', strokeWidth: active ? 2.5 : 2 }}
      />
      {/* Invisible wide path to make the wire easy to hover/click. */}
      <path
        d={edgePath}
        className={styles.interaction}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {active && (
        <EdgeLabelRenderer>
          <button
            className={`nodrag nopan ${styles.deleteBtn}`}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
            aria-label="delete connection"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={(e) => {
              e.stopPropagation()
              deleteElements({ edges: [{ id }] })
            }}
          >
            ✕
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
