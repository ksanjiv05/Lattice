import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { persistStorage, storeKey } from './persist'

export type Theme = 'light' | 'dark'

interface SettingsState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/**
 * App-wide settings. Global, cross-feature concerns live in `@/store`.
 * Feature-scoped state belongs in that feature's own folder instead.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: storeKey('settings'), storage: persistStorage },
  ),
)
