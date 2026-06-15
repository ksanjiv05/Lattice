import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { persistStorage, storeKey } from '@/store/persist'
import type { MonitorModel } from '../types'

interface MonitorsState {
  monitors: MonitorModel[]
  addMonitor: (x: number, y: number) => void
  setTarget: (id: string, targetId: string | null) => void
  setLabel: (id: string, label: string) => void
  setMonitorPosition: (id: string, x: number, y: number) => void
  removeMonitor: (id: string) => void
}

export const useMonitorsStore = create<MonitorsState>()(
  persist(
    (set) => ({
      monitors: [],
      addMonitor: (x, y) =>
        set((s) => {
          const monitor: MonitorModel = { id: crypto.randomUUID(), x, y, targetId: null, label: '' }
          return { monitors: [...s.monitors, monitor] }
        }),
      setTarget: (id, targetId) =>
        set((s) => ({
          monitors: s.monitors.map((m) => (m.id === id ? { ...m, targetId } : m)),
        })),
      setLabel: (id, label) =>
        set((s) => ({
          monitors: s.monitors.map((m) => (m.id === id ? { ...m, label } : m)),
        })),
      setMonitorPosition: (id, x, y) =>
        set((s) => ({
          monitors: s.monitors.map((m) => (m.id === id ? { ...m, x, y } : m)),
        })),
      removeMonitor: (id) => set((s) => ({ monitors: s.monitors.filter((m) => m.id !== id) })),
    }),
    { name: storeKey('monitors'), storage: persistStorage },
  ),
)
