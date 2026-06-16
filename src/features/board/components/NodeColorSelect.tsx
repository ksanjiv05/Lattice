import { useState } from 'react'
import { Ban, Check, Palette } from 'lucide-react'
import { NODE_COLORS, useNodesStore } from '@/features/nodes'

interface NodeColorSelectProps {
  nodeId: string
  color: string | null
}

/** Popover swatch picker to tag a node with an accent color. */
export function NodeColorSelect({ nodeId, color }: NodeColorSelectProps) {
  const setNodeColor = useNodesStore((s) => s.setNodeColor)
  const [open, setOpen] = useState(false)

  const pick = (value: string | null) => {
    setNodeColor(nodeId, value)
    setOpen(false)
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="node color"
        className="flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        {color ? (
          <span className="size-4 rounded-full" style={{ backgroundColor: color }} />
        ) : (
          <Palette className="size-4 text-zinc-400" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 grid grid-cols-5 gap-2 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-2xl dark:border-white/10 dark:bg-zinc-800">
            <button
              onClick={() => pick(null)}
              title="No color"
              className="flex size-7 items-center justify-center rounded-full border border-zinc-300 text-zinc-400 hover:border-zinc-400 dark:border-white/15"
            >
              <Ban className="size-3.5" />
            </button>
            {NODE_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => pick(c.value)}
                title={c.name}
                aria-label={c.name}
                className="flex size-7 items-center justify-center rounded-full ring-2 ring-transparent transition hover:ring-zinc-300 dark:hover:ring-white/20"
                style={{ backgroundColor: c.value }}
              >
                {color === c.value && <Check className="size-4 text-white" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
