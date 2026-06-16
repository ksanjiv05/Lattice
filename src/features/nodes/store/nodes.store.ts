import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { persistStorage, storeKey } from '@/store/persist'
import type { NodeModel } from '../types'

type NodePatch = Partial<Pick<NodeModel, 'name' | 'label' | 'expression'>>

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
  /** Assign (or clear) a weight applied to a node's output. */
  setNodeWeight: (id: string, weightId: string | null) => void
  /** Set (or clear) a node's accent color. */
  setNodeColor: (id: string, color: string | null) => void
  /** Assign (or clear) a node's group membership. */
  setNodeGroup: (id: string, groupId: string | null) => void
  /** Shift every member of a group by a delta (used when the group is dragged). */
  moveMembersBy: (groupId: string, dx: number, dy: number) => void
  /** Detach all members of a group (used when the group is deleted). */
  ungroup: (groupId: string) => void
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
          const node: NodeModel = {
            id: crypto.randomUUID(),
            name: `n${seq}`,
            label: '',
            expression: '0',
            x,
            y,
            groupId: null,
            weightId: null,
            color: null,
          }
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
      setNodeWeight: (id, weightId) =>
        set((s) => ({ nodes: s.nodes.map((n) => (n.id === id ? { ...n, weightId } : n)) })),
      setNodeColor: (id, color) =>
        set((s) => ({ nodes: s.nodes.map((n) => (n.id === id ? { ...n, color } : n)) })),
      setNodeGroup: (id, groupId) =>
        set((s) => ({ nodes: s.nodes.map((n) => (n.id === id ? { ...n, groupId } : n)) })),
      moveMembersBy: (groupId, dx, dy) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.groupId === groupId ? { ...n, x: n.x + dx, y: n.y + dy } : n,
          ),
        })),
      ungroup: (groupId) =>
        set((s) => ({
          nodes: s.nodes.map((n) => (n.groupId === groupId ? { ...n, groupId: null } : n)),
        })),
    }),
    {
      name: storeKey('nodes'),
      storage: persistStorage,
      // Selection is ephemeral UI state — don't persist it.
      partialize: (s) => ({ nodes: s.nodes, seq: s.seq }),
    },
  ),
)
