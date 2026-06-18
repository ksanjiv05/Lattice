import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { persistStorage, storeKey } from '@/store/persist'
import type { WeightModel } from '../types'

type WeightPatch = Partial<Pick<WeightModel, 'name' | 'expression' | 'step'>>

interface WeightsState {
  weights: WeightModel[]
  seq: number
  addWeight: () => void
  updateWeight: (id: string, patch: WeightPatch) => void
  removeWeight: (id: string) => void
}

export const useWeightsStore = create<WeightsState>()(
  persist(
    (set) => ({
      weights: [],
      seq: 0,
      addWeight: () =>
        set((s) => {
          const seq = s.seq + 1
          const weight: WeightModel = {
            id: crypto.randomUUID(),
            name: `w${seq}`,
            expression: '0',
            step: 0.1,
          }
          return { weights: [...s.weights, weight], seq }
        }),
      updateWeight: (id, patch) =>
        set((s) => ({
          weights: s.weights.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        })),
      removeWeight: (id) => set((s) => ({ weights: s.weights.filter((w) => w.id !== id) })),
    }),
    { name: storeKey('weights'), storage: persistStorage },
  ),
)
