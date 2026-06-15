import { useCallback, useState } from 'react'
import { appStorage } from '@/lib/storage'

/**
 * Reactive, typed wrapper around the app storage adapter for one-off values
 * that don't warrant a full store. For shared/cross-component state, prefer a
 * Zustand store in `@/store` or the relevant feature folder.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = appStorage.getItem(key)
    if (raw === null) return initialValue
    try {
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  })

  const update = useCallback(
    (next: T) => {
      setValue(next)
      appStorage.setItem(key, JSON.stringify(next))
    },
    [key],
  )

  const remove = useCallback(() => {
    setValue(initialValue)
    appStorage.removeItem(key)
  }, [key, initialValue])

  return [value, update, remove] as const
}
