import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { persistStorage, storeKey } from '@/store/persist'
import type { Connection } from '../types'

interface ConnectionsState {
  connections: Connection[]
  /** Add a wire source → target; ignores self-links and duplicates. */
  addConnection: (sourceId: string, targetId: string) => void
  removeConnection: (id: string) => void
}

export const useConnectionsStore = create<ConnectionsState>()(
  persist(
    (set) => ({
      connections: [],
      addConnection: (sourceId, targetId) =>
        set((s) => {
          const exists = s.connections.some(
            (c) => c.sourceId === sourceId && c.targetId === targetId,
          )
          if (sourceId === targetId || exists) return {}
          const connection: Connection = { id: crypto.randomUUID(), sourceId, targetId }
          return { connections: [...s.connections, connection] }
        }),
      removeConnection: (id) =>
        set((s) => ({ connections: s.connections.filter((c) => c.id !== id) })),
    }),
    { name: storeKey('connections'), storage: persistStorage },
  ),
)
