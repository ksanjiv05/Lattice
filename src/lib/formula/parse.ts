import { tokenize } from './tokenize'
import { FormulaError, FUNCTIONS } from './types'

/** Reverse-Polish instruction produced by the parser. */
export type Rpn =
  | { type: 'num'; value: number }
  | { type: 'var'; name: string }
  | { type: 'op'; value: string }
  | { type: 'neg' }
  | { type: 'fn'; name: string }

type OpItem =
  | { kind: 'op'; value: string }
  | { kind: 'neg' }
  | { kind: 'fn'; name: string }
  | { kind: 'lparen' }

const PREC: Record<string, number> = {
  '==': 0,
  '!=': 0,
  '<': 0,
  '>': 0,
  '<=': 0,
  '>=': 0,
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 4,
}
const PREC_NEG = 3
const RIGHT_ASSOC = new Set(['^'])

const precedenceOf = (item: OpItem): number =>
  item.kind === 'neg' ? PREC_NEG : item.kind === 'op' ? PREC[item.value] : -1

function toRpn(item: OpItem): Rpn {
  if (item.kind === 'op') return { type: 'op', value: item.value }
  if (item.kind === 'neg') return { type: 'neg' }
  if (item.kind === 'fn') return { type: 'fn', name: item.name }
  throw new FormulaError('Mismatched parenthesis')
}

/**
 * Parse a formula into RPN via the shunting-yard algorithm, also collecting the
 * set of variable names it references (its dependencies).
 */
export function parse(input: string): { rpn: Rpn[]; deps: Set<string> } {
  const tokens = tokenize(input)
  const output: Rpn[] = []
  const ops: OpItem[] = []
  const deps = new Set<string>()
  let prevValueLike = false

  const drainWhile = (keep: (top: OpItem) => boolean) => {
    while (ops.length && ops[ops.length - 1].kind !== 'lparen' && keep(ops[ops.length - 1])) {
      output.push(toRpn(ops.pop()!))
    }
  }

  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx]

    if (t.type === 'num') {
      output.push({ type: 'num', value: t.value })
      prevValueLike = true
    } else if (t.type === 'id') {
      if (tokens[idx + 1]?.type === 'lparen') {
        if (!(t.value in FUNCTIONS)) throw new FormulaError(`Unknown function "${t.value}"`)
        ops.push({ kind: 'fn', name: t.value })
        prevValueLike = false
      } else {
        output.push({ type: 'var', name: t.value })
        deps.add(t.value)
        prevValueLike = true
      }
    } else if (t.type === 'comma') {
      drainWhile(() => true)
      prevValueLike = false
    } else if (t.type === 'op') {
      if (t.value === '-' && !prevValueLike) {
        ops.push({ kind: 'neg' })
      } else {
        const p1 = PREC[t.value]
        const right = RIGHT_ASSOC.has(t.value)
        drainWhile((top) => top.kind !== 'fn' && (right ? precedenceOf(top) > p1 : precedenceOf(top) >= p1))
        ops.push({ kind: 'op', value: t.value })
      }
      prevValueLike = false
    } else if (t.type === 'lparen') {
      ops.push({ kind: 'lparen' })
      prevValueLike = false
    } else {
      drainWhile(() => true)
      if (!ops.length) throw new FormulaError('Mismatched parenthesis')
      ops.pop()
      if (ops[ops.length - 1]?.kind === 'fn') output.push(toRpn(ops.pop()!))
      prevValueLike = true
    }
  }

  while (ops.length) {
    const top = ops.pop()!
    if (top.kind === 'lparen') throw new FormulaError('Mismatched parenthesis')
    output.push(toRpn(top))
  }

  return { rpn: output, deps }
}
