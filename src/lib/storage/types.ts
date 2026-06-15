/**
 * Minimal synchronous key/value storage contract.
 *
 * Anything that satisfies this interface (localStorage, an in-memory map, a
 * mock in tests) can back the app's persisted stores. Keep the surface tiny so
 * adapters stay trivial to implement and reason about.
 */
export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}
