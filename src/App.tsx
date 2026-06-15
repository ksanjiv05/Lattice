import { PanelRightClose, PanelRightOpen, Workflow } from 'lucide-react'
import { Button } from '@/components/ui'
import { Board } from '@/features/board'
import { VariablesPanel } from '@/features/variables'
import { ThemeToggle, useApplyTheme } from '@/features/theme'
import { useSettingsStore } from '@/store'
import { APP_NAME } from '@/constants'

/**
 * Workspace shell: composition only. Logic lives in features, stores, hooks,
 * and the formula engine — never here.
 */
function App() {
  useApplyTheme()
  const panelOpen = useSettingsStore((s) => s.variablesPanelOpen)
  const togglePanel = useSettingsStore((s) => s.toggleVariablesPanel)

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 flex-none items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-white/5 dark:bg-zinc-900/80">
        <strong className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-950/40">
            <Workflow className="size-4" />
          </span>
          {APP_NAME}
        </strong>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" onClick={togglePanel} aria-label="toggle variables panel">
            {panelOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
            Variables
          </Button>
        </div>
      </header>
      <main className="flex min-h-0 flex-1">
        <Board />
        {panelOpen && <VariablesPanel />}
      </main>
    </div>
  )
}

export default App
