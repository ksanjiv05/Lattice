import { Button } from '@/components/ui'
import { useVariablesStore } from '../store/variables.store'
import { VariableRow } from './VariableRow'
import styles from './VariablesPanel.module.css'

/** Side panel for creating and editing dynamic variables and their formulas. */
export function VariablesPanel() {
  const variables = useVariablesStore((s) => s.variables)
  const addVariable = useVariablesStore((s) => s.addVariable)

  return (
    <aside className={styles.panel}>
      <header className={styles.panelHeader}>
        <h2 className={styles.title}>Variables</h2>
        <Button onClick={addVariable}>+ Variable</Button>
      </header>

      {variables.length === 0 ? (
        <p className={styles.empty}>
          No variables yet. Add one and reference nodes or other variables by name,
          e.g. <code>n1 * 2 + max(n2, 10)</code>.
        </p>
      ) : (
        <div className={styles.list}>
          {variables.map((variable) => (
            <VariableRow key={variable.id} variable={variable} />
          ))}
        </div>
      )}
    </aside>
  )
}
