import type { Rpn } from './parse'
import { FormulaError, FUNCTIONS } from './types'

function applyOp(op: string, a: number, b: number): number {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return a / b
    case '^':
      return a ** b
    default:
      throw new FormulaError(`Unknown operator "${op}"`)
  }
}

/** Evaluate RPN against a scope mapping variable names to numbers. */
export function evaluateRpn(rpn: Rpn[], scope: Record<string, number>): number {
  const stack: number[] = []

  for (const node of rpn) {
    if (node.type === 'num') {
      stack.push(node.value)
    } else if (node.type === 'var') {
      const value = scope[node.name]
      if (value === undefined) throw new FormulaError(`Unknown reference "${node.name}"`)
      stack.push(value)
    } else if (node.type === 'neg') {
      const a = stack.pop()
      if (a === undefined) throw new FormulaError('Invalid expression')
      stack.push(-a)
    } else if (node.type === 'op') {
      const b = stack.pop()
      const a = stack.pop()
      if (a === undefined || b === undefined) throw new FormulaError('Invalid expression')
      stack.push(applyOp(node.value, a, b))
    } else {
      const fn = FUNCTIONS[node.name]
      const args: number[] = []
      for (let i = 0; i < fn.arity; i++) {
        const v = stack.pop()
        if (v === undefined) throw new FormulaError(`Not enough arguments for "${node.name}"`)
        args.unshift(v)
      }
      stack.push(fn.apply(args))
    }
  }

  if (stack.length !== 1) throw new FormulaError('Invalid expression')
  return stack[0]
}
