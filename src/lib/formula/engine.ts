import { evaluateRpn } from './evaluate'
import { parse, type Rpn } from './parse'
import { errorMessage, FormulaError } from './types'

export interface CellResult {
  value: number | null
  error: string | null
}

/**
 * A symbol to evaluate. `inputs` maps local identifiers (e.g. `in1`) usable
 * inside `expression` to the names of other symbols whose values feed them —
 * this is how wired node connections inject upstream outputs.
 */
export interface Cell {
  expression: string
  inputs?: Record<string, string>
}

interface Parsed {
  rpn: Rpn[]
  deps: string[]
  inputs: Record<string, string>
  parseError: string | null
}

/**
 * Evaluate a whole symbol table at once. Dependencies (formula references plus
 * wired inputs) are resolved lazily with cycle detection, so symbols may
 * reference each other in any order. Returns a result per symbol.
 */
export function evaluateModel(cells: Record<string, Cell>): Record<string, CellResult> {
  const parsed: Record<string, Parsed> = {}
  for (const [name, cell] of Object.entries(cells)) {
    const inputs = cell.inputs ?? {}
    try {
      const { rpn, deps } = parse(cell.expression)
      parsed[name] = { rpn, deps: [...deps], inputs, parseError: null }
    } catch (error) {
      parsed[name] = { rpn: [], deps: [], inputs, parseError: errorMessage(error) }
    }
  }

  const results: Record<string, CellResult> = {}
  const scope: Record<string, number> = {}
  const resolved = new Set<string>()
  const visiting = new Set<string>()

  const resolve = (name: string): void => {
    if (resolved.has(name)) return
    if (visiting.has(name)) throw new FormulaError('Circular reference')

    const cell = parsed[name]
    if (cell.parseError) {
      results[name] = { value: null, error: cell.parseError }
      resolved.add(name)
      return
    }

    visiting.add(name)
    try {
      const localNames = new Set(Object.keys(cell.inputs))
      const globalDeps = cell.deps.filter((d) => !localNames.has(d))
      for (const dep of new Set([...globalDeps, ...Object.values(cell.inputs)])) {
        if (!(dep in parsed)) throw new FormulaError(`Unknown reference "${dep}"`)
        resolve(dep)
        if (results[dep].error) throw new FormulaError(`Depends on "${dep}" which has an error`)
      }
      const localScope: Record<string, number> = { ...scope }
      for (const [local, source] of Object.entries(cell.inputs)) localScope[local] = scope[source]
      const value = evaluateRpn(cell.rpn, localScope)
      if (!Number.isFinite(value)) throw new FormulaError('Result is not a finite number')
      scope[name] = value
      results[name] = { value, error: null }
    } catch (error) {
      results[name] = { value: null, error: errorMessage(error) }
    } finally {
      visiting.delete(name)
      resolved.add(name)
    }
  }

  for (const name of Object.keys(parsed)) resolve(name)
  return results
}
