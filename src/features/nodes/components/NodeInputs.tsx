import { useNodeInputs } from '@/features/connections'
import styles from './FormulaNode.module.css'

interface NodeInputsProps {
  nodeId: string
}

/** Lists the wired inputs available to a node's formula (`in1 = source`, …). */
export function NodeInputs({ nodeId }: NodeInputsProps) {
  const inputs = useNodeInputs(nodeId)
  if (inputs.length === 0) return null

  return (
    <div className={styles.inputs}>
      {inputs.map((input) => (
        <span key={input.id} className={styles.inputTag}>
          {input.local} = {input.sourceName}
        </span>
      ))}
    </div>
  )
}
