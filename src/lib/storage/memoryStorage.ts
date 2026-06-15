import type { KeyValueStorage } from './types'

/**
 * In-memory fallback used when `window.localStorage` is unavailable
 * (SSR, tests, private-mode quirks). State lives only for the page session.
 */
export function createMemoryStorage(): KeyValueStorage {
  const store = new Map<string, string>()

  return {
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    setItem: (key, value) => {
      store.set(key, value)
    },
    removeItem: (key) => {
      store.delete(key)
    },
  }
}
