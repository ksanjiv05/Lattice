import { PanelRightClose, PanelRightOpen, Workflow, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { Board } from '@/features/board'
import { VariablesPanel } from '@/features/variables'
import { WeightsPanel } from '@/features/weights'
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
          <Button variant="ghost" onClick={togglePanel} aria-label="toggle side panel">
            {panelOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
            Panel
          </Button>
        </div>
      </header>
      <main className="flex min-h-0 flex-1">
        <Board />
        {panelOpen && (
          <aside className="flex h-full w-90 flex-none flex-col gap-4 overflow-y-auto border-l border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900">
            <div className="flex items-center justify-end">
              <button
                onClick={togglePanel}
                aria-label="close side panel"
                className="flex size-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-100"
              >
                <X className="size-4" />
              </button>
            </div>
            <VariablesPanel />
            <div className="border-t border-zinc-200 dark:border-white/5" />
            <WeightsPanel />
          </aside>
        )}
      </main>
    </div>
  )
}

export default App
