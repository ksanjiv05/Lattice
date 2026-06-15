/** Error type thrown anywhere in the formula pipeline. */
export class FormulaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FormulaError'
  }
}

export interface FormulaFn {
  arity: number
  apply: (args: number[]) => number
}

/** Built-in functions usable inside formulas, e.g. `max(a, b)`, `sqrt(x)`. */
export const FUNCTIONS: Record<string, FormulaFn> = {
  abs: { arity: 1, apply: ([a]) => Math.abs(a) },
  sqrt: { arity: 1, apply: ([a]) => Math.sqrt(a) },
  round: { arity: 1, apply: ([a]) => Math.round(a) },
  floor: { arity: 1, apply: ([a]) => Math.floor(a) },
  ceil: { arity: 1, apply: ([a]) => Math.ceil(a) },
  min: { arity: 2, apply: ([a, b]) => Math.min(a, b) },
  max: { arity: 2, apply: ([a, b]) => Math.max(a, b) },
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
