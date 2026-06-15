import { Board } from '@/features/board'
import { VariablesPanel } from '@/features/variables'
import { ThemeToggle, useApplyTheme } from '@/features/theme'
import { APP_NAME } from '@/constants'
import styles from './App.module.css'

/**
 * Workspace shell: composition only. Logic lives in features, stores, hooks,
 * and the formula engine — never here.
 */
function App() {
  useApplyTheme()

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <strong>{APP_NAME}</strong>
        <ThemeToggle />
      </header>
      <main className={styles.workspace}>
        <Board />
        <VariablesPanel />
      </main>
    </div>
  )
}

export default App
