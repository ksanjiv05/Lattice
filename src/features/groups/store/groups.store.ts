import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { persistStorage, storeKey } from '@/store/persist'
import type { GroupModel } from '../types'

type GroupPatch = Partial<Pick<GroupModel, 'name' | 'label'>>

interface GroupsState {
  groups: GroupModel[]
  seq: number
  /** Create a group with the given bounds; returns the new id. */
  addGroup: (x: number, y: number, width: number, height: number) => string
  updateGroup: (id: string, patch: GroupPatch) => void
  setGroupPosition: (id: string, x: number, y: number) => void
  setGroupSize: (id: string, width: number, height: number) => void
  removeGroup: (id: string) => void
}

export const useGroupsStore = create<GroupsState>()(
  persist(
    (set, get) => ({
      groups: [],
      seq: 0,
      addGroup: (x, y, width, height) => {
        const id = crypto.randomUUID()
        const seq = get().seq + 1
        const group: GroupModel = { id, name: `g${seq}`, label: '', x, y, width, height }
        set((s) => ({ groups: [...s.groups, group], seq }))
        return id
      },
      updateGroup: (id, patch) =>
        set((s) => ({ groups: s.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      setGroupPosition: (id, x, y) =>
        set((s) => ({ groups: s.groups.map((g) => (g.id === id ? { ...g, x, y } : g)) })),
      setGroupSize: (id, width, height) =>
        set((s) => ({ groups: s.groups.map((g) => (g.id === id ? { ...g, width, height } : g)) })),
      removeGroup: (id) => set((s) => ({ groups: s.groups.filter((g) => g.id !== id) })),
    }),
    { name: storeKey('groups'), storage: persistStorage },
  ),
)
