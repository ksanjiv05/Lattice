import { createMemoryStorage } from './memoryStorage'
import type { KeyValueStorage } from './types'

export type { KeyValueStorage } from './types'

function isLocalStorageAvailable(): boolean {
  try {
    const probe = '__storage_probe__'
    window.localStorage.setItem(probe, probe)
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

/**
 * The single storage instance the app should use. Swap the implementation here
 * (e.g. to IndexedDB or an encrypted adapter) without touching any store.
 */
export const appStorage: KeyValueStorage = isLocalStorageAvailable()
  ? window.localStorage
  : createMemoryStorage()
