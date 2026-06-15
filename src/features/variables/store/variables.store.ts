import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { persistStorage, storeKey } from '@/store/persist'
import type { VariableModel } from '../types'

type VariablePatch = Partial<Pick<VariableModel, 'name' | 'expression' | 'step'>>

interface VariablesState {
  variables: VariableModel[]
  seq: number
  addVariable: () => void
  updateVariable: (id: string, patch: VariablePatch) => void
  removeVariable: (id: string) => void
}

export const useVariablesStore = create<VariablesState>()(
  persist(
    (set) => ({
      variables: [],
      seq: 0,
      addVariable: () =>
        set((s) => {
          const seq = s.seq + 1
          const variable: VariableModel = {
            id: crypto.randomUUID(),
            name: `v${seq}`,
            expression: '0',
            step: 1,
          }
          return { variables: [...s.variables, variable], seq }
        }),
      updateVariable: (id, patch) =>
        set((s) => ({
          variables: s.variables.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),
      removeVariable: (id) =>
        set((s) => ({ variables: s.variables.filter((v) => v.id !== id) })),
    }),
    { name: storeKey('variables'), storage: persistStorage },
  ),
)
