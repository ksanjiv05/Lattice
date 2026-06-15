import { useState } from 'react'
import { SquareFunction } from 'lucide-react'
import { Button } from '@/components/ui'
import { FUNCTIONS } from '@/lib/formula'

const entries = Object.entries(FUNCTIONS)

interface FunctionsHelpProps {
  /** Insert a function by name into the active formula. Null = nothing to insert into. */
  onPick: ((name: string) => void) | null
}

/** A popover listing formula functions; clicking one inserts it into the
 * selected node's formula (or just serves as a reference when none is active). */
export function FunctionsHelp({ onPick }: FunctionsHelpProps) {
  const [open, setOpen] = useState(false)

  const pick = (name: string) => {
    onPick?.(name)
    setOpen(false)
  }

  return (
    <div className="relative shrink-0">
      <Button variant="secondary" onClick={() => setOpen((o) => !o)} aria-label="formula functions">
        <SquareFunction className="size-4" />
        Functions
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 max-h-[60vh] w-80 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-zinc-800">
            <p className="px-2 py-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              {onPick
                ? 'Click to insert into the selected node. Reference nodes/variables by name.'
                : 'Select a node, then click a function to insert it.'}
            </p>
            <ul className="flex flex-col">
              {entries.map(([name, fn]) => (
                <li key={name}>
                  <button
                    type="button"
                    disabled={!onPick}
                    onClick={() => pick(name)}
                    className="flex w-full flex-col gap-0.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-zinc-100 disabled:cursor-default disabled:opacity-60 disabled:hover:bg-transparent dark:hover:bg-white/5"
                  >
                    <code className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                      {fn.signature}
                    </code>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{fn.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
