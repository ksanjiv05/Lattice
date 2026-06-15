import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui'
import { useSettingsStore } from '@/store'

/** Toggles the persisted app theme. */
export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <Button variant="ghost" onClick={toggleTheme} aria-label="toggle theme">
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      {isDark ? 'Dark' : 'Light'}
    </Button>
  )
}
