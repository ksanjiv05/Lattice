import { ArrowRight } from 'lucide-react'
import { useNodeInputs } from '@/features/connections'

interface NodeInputsProps {
  nodeId: string
}

/** Lists the wired inputs available to a node's formula (`in1 → source`, …). */
export function NodeInputs({ nodeId }: NodeInputsProps) {
  const inputs = useNodeInputs(nodeId)
  if (inputs.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1">
      {inputs.map((input) => (
        <span
          key={input.id}
          className="inline-flex items-center gap-0.5 rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 ring-1 ring-inset ring-indigo-500/20 dark:text-indigo-300"
        >
          {input.local}
          <ArrowRight className="size-2.5" />
          {input.sourceName}
        </span>
      ))}
    </div>
  )
}
