import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { persistStorage, storeKey } from '@/store/persist'
import type { NodeModel } from '../types'

type NodePatch = Partial<Pick<NodeModel, 'name' | 'expression'>>

interface NodesState {
  nodes: NodeModel[]
  /** Monotonic counter for default naming (avoids id/name collisions). */
  seq: number
  /** The node currently selected on the canvas (drives the formula bar). */
  selectedId: string | null
  addNode: (x: number, y: number) => void
  updateNode: (id: string, patch: NodePatch) => void
  setNodePosition: (id: string, x: number, y: number) => void
  removeNode: (id: string) => void
  select: (id: string | null) => void
}

export const useNodesStore = create<NodesState>()(
  persist(
    (set) => ({
      nodes: [],
      seq: 0,
      selectedId: null,
      addNode: (x, y) =>
        set((s) => {
          const seq = s.seq + 1
          const node: NodeModel = { id: crypto.randomUUID(), name: `n${seq}`, expression: '0', x, y }
          return { nodes: [...s.nodes, node], seq, selectedId: node.id }
        }),
      updateNode: (id, patch) =>
        set((s) => ({
          nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
        })),
      setNodePosition: (id, x, y) =>
        set((s) => ({
          nodes: s.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
        })),
      removeNode: (id) =>
        set((s) => ({
          nodes: s.nodes.filter((n) => n.id !== id),
          selectedId: s.selectedId === id ? null : s.selectedId,
        })),
      select: (id) => set({ selectedId: id }),
    }),
    {
      name: storeKey('nodes'),
      storage: persistStorage,
      // Selection is ephemeral UI state — don't persist it.
      partialize: (s) => ({ nodes: s.nodes, seq: s.seq }),
    },
  ),
)
