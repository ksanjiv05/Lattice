import { useState } from 'react'
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import { EdgeLabel } from './EdgeLabel'

/**
 * Edge with an editable value-transform expression (`x` = source value). The
 * expression shows as a chip on the wire and becomes editable when selected;
 * a delete button appears on hover/selection.
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
        style={{ stroke: active ? '#818cf8' : '#6366f1', strokeWidth: active ? 2.5 : 2 }}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      <EdgeLabel
        id={id}
        labelX={labelX}
        labelY={labelY}
        selected={!!selected}
        hovered={hovered}
        setHovered={setHovered}
      />
    </>
  )
}
