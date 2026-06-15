import { Button } from '@/components/ui'
import { useSettingsStore } from '@/store'

/** Toggles the persisted app theme. */
export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  )
}
