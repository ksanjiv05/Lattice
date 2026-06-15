import { useEffect } from 'react'
import { useSettingsStore } from '@/store'

/** Side-effect hook: reflects the persisted theme onto the document. */
export function useApplyTheme() {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])
}
