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
  /** Human-readable call signature, e.g. `clamp(x, lo, hi)`. */
  signature: string
  description: string
}

/** Built-in functions usable inside formulas, e.g. `max(a, b)`, `sqrt(x)`. */
export const FUNCTIONS: Record<string, FormulaFn> = {
  // Rounding
  abs: { arity: 1, apply: ([a]) => Math.abs(a), signature: 'abs(x)', description: 'Absolute value' },
  round: { arity: 1, apply: ([a]) => Math.round(a), signature: 'round(x)', description: 'Round to nearest integer' },
  floor: { arity: 1, apply: ([a]) => Math.floor(a), signature: 'floor(x)', description: 'Round down' },
  ceil: { arity: 1, apply: ([a]) => Math.ceil(a), signature: 'ceil(x)', description: 'Round up' },
  sign: { arity: 1, apply: ([a]) => Math.sign(a), signature: 'sign(x)', description: 'Sign: -1, 0, or 1' },

  // Powers & roots
  sqrt: { arity: 1, apply: ([a]) => Math.sqrt(a), signature: 'sqrt(x)', description: 'Square root' },
  cbrt: { arity: 1, apply: ([a]) => Math.cbrt(a), signature: 'cbrt(x)', description: 'Cube root' },
  pow: { arity: 2, apply: ([a, b]) => a ** b, signature: 'pow(x, y)', description: 'x to the power y' },
  root: { arity: 2, apply: ([a, b]) => a ** (1 / b), signature: 'root(x, n)', description: 'nth root of x' },
  exp: { arity: 1, apply: ([a]) => Math.exp(a), signature: 'exp(x)', description: 'eˣ (exponential)' },

  // Logarithms
  ln: { arity: 1, apply: ([a]) => Math.log(a), signature: 'ln(x)', description: 'Natural log (base e)' },
  log: { arity: 1, apply: ([a]) => Math.log10(a), signature: 'log(x)', description: 'Log base 10' },
  log2: { arity: 1, apply: ([a]) => Math.log2(a), signature: 'log2(x)', description: 'Log base 2' },

  // Percentage
  pct: { arity: 1, apply: ([a]) => a / 100, signature: 'pct(x)', description: 'Percent as fraction (x / 100)' },
  percent: { arity: 2, apply: ([a, b]) => (a / b) * 100, signature: 'percent(part, whole)', description: 'part as % of whole' },

  // Comparison
  min: { arity: 2, apply: ([a, b]) => Math.min(a, b), signature: 'min(a, b)', description: 'Smaller of two' },
  max: { arity: 2, apply: ([a, b]) => Math.max(a, b), signature: 'max(a, b)', description: 'Larger of two' },
  mod: { arity: 2, apply: ([a, b]) => a % b, signature: 'mod(a, b)', description: 'Remainder of a / b' },
  clamp: {
    arity: 3,
    apply: ([x, lo, hi]) => Math.min(hi, Math.max(lo, x)),
    signature: 'clamp(x, lo, hi)',
    description: 'Constrain x to the range [lo, hi]',
  },

  // Trigonometry (radians)
  sin: { arity: 1, apply: ([a]) => Math.sin(a), signature: 'sin(x)', description: 'Sine (radians)' },
  cos: { arity: 1, apply: ([a]) => Math.cos(a), signature: 'cos(x)', description: 'Cosine (radians)' },
  tan: { arity: 1, apply: ([a]) => Math.tan(a), signature: 'tan(x)', description: 'Tangent (radians)' },
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
