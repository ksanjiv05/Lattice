/**
 * Typed, validated access to environment variables. Read `import.meta.env`
 * ONLY here so the rest of the app depends on a stable, typed surface.
 */
export const env = {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
