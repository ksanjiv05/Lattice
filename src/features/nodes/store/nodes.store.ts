import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { persistStorage, storeKey } from '@/store/persist'
import type { NodeModel } from '../types'

type NodePatch = Partial<Pick<NodeModel, 'name' | 'expression'>>

interface NodesState {
  nodes: NodeModel[]
  /** Monotonic counter for default naming (avoids id/name collisions). */
  seq: number
  addNode: (x: number, y: number) => void
  updateNode: (id: string, patch: NodePatch) => void
  setNodePosition: (id: string, x: number, y: number) => void
  removeNode: (id: string) => void
}

export const useNodesStore = create<NodesState>()(
  persist(
    (set) => ({
      nodes: [],
      seq: 0,
      addNode: (x, y) =>
        set((s) => {
          const seq = s.seq + 1
          const node: NodeModel = { id: crypto.randomUUID(), name: `n${seq}`, expression: '0', x, y }
          return { nodes: [...s.nodes, node], seq }
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
        set((s) => ({ nodes: s.nodes.filter((n) => n.id !== id) })),
    }),
    { name: storeKey('nodes'), storage: persistStorage },
  ),
)
