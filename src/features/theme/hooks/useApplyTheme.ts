import { useEffect } from 'react'
import { useSettingsStore } from '@/store'

/** Side-effect hook: reflects the persisted theme onto the document. */
export function useApplyTheme() {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])
}
