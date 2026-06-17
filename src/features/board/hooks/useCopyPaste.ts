import { useEffect } from 'react'
import { useNodesStore, type NodeModel } from '@/features/nodes'
import { useConnectionsStore, type Connection } from '@/features/connections'

const PASTE_OFFSET = 40

interface Clipboard {
  nodes: NodeModel[]
  connections: Connection[]
}

// Module-level so it survives re-renders (an in-app clipboard, not the OS one).
let clipboard: Clipboard | null = null

function isEditableTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
}

function copySelection() {
  const { nodes, selectedIds } = useNodesStore.getState()
  const selected = nodes.filter((n) => selectedIds.includes(n.id))
  if (selected.length === 0) return
  const ids = new Set(selected.map((n) => n.id))
  const internal = useConnectionsStore
    .getState()
    .connections.filter((c) => ids.has(c.sourceId) && ids.has(c.targetId))
  clipboard = { nodes: selected.map((n) => ({ ...n })), connections: internal.map((c) => ({ ...c })) }
}

function pasteClipboard() {
  if (!clipboard || clipboard.nodes.length === 0) return
  const seq = useNodesStore.getState().seq
  const idMap = new Map<string, string>()
  const newNodes: NodeModel[] = clipboard.nodes.map((n, i) => {
    const id = crypto.randomUUID()
    idMap.set(n.id, id)
    return { ...n, id, name: `n${seq + i + 1}`, x: n.x + PASTE_OFFSET, y: n.y + PASTE_OFFSET, groupId: null }
  })
  useNodesStore.getState().appendNodes(newNodes)

  const newConns: Connection[] = clipboard.connections.flatMap((c) => {
    const sourceId = idMap.get(c.sourceId)
    const targetId = idMap.get(c.targetId)
    if (!sourceId || !targetId) return []
    return [{ id: crypto.randomUUID(), sourceId, targetId, expression: c.expression }]
  })
  if (newConns.length) useConnectionsStore.getState().appendConnections(newConns)
}

/** Keyboard copy/paste/duplicate of the selected nodes (with internal wires). */
export function useCopyPaste() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || isEditableTarget(e.target)) return
      const key = e.key.toLowerCase()
      if (key === 'c') {
        e.preventDefault()
        copySelection()
      } else if (key === 'v') {
        e.preventDefault()
        pasteClipboard()
      } else if (key === 'd') {
        e.preventDefault()
        copySelection()
        pasteClipboard()
      }
    }
    // Capture phase so a focused React Flow node can't swallow the shortcut.
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])
}
