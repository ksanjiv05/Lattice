/**
 * App-wide shared types. Feature-specific types live in that feature's folder.
 */

/** Helper for components that accept and forward children. */
export type WithChildren<P = unknown> = P & { children?: React.ReactNode }

/** Make selected keys of T optional. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
