import { createJSONStorage } from 'zustand/middleware'
import { appStorage } from '@/lib/storage'

/**
 * Shared JSON persistence backend for every Zustand store.
 *
 * Stores pass this as their `storage` option so persistence is centralised:
 * change the adapter in `@/lib/storage` and all stores follow.
 */
export const persistStorage = createJSONStorage(() => appStorage)

/** Namespacing keeps persisted keys from colliding in localStorage. */
export const STORE_KEY_PREFIX = 'o-sim:'

export const storeKey = (name: string): string => `${STORE_KEY_PREFIX}${name}`
