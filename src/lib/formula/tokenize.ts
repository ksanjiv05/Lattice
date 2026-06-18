import { FormulaError } from './types'

export type Token =
  | { type: 'num'; value: number }
  | { type: 'id'; value: string }
  | { type: 'op'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'comma' }

const OP_CHARS = '+-*/^'
const isDigit = (c: string) => c >= '0' && c <= '9'
const isIdentStart = (c: string) => /[a-zA-Z_]/.test(c)
const isIdentPart = (c: string) => /[a-zA-Z0-9_]/.test(c)

/** Split a formula string into tokens. Throws FormulaError on bad input. */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < input.length) {
    const ch = input[i]

    if (ch === ' ' || ch === '\t' || ch === '\n') {
      i++
    } else if (isDigit(ch) || ch === '.') {
      let raw = ''
      while (i < input.length && (isDigit(input[i]) || input[i] === '.')) raw += input[i++]
      const value = Number(raw)
      if (Number.isNaN(value)) throw new FormulaError(`Invalid number "${raw}"`)
      tokens.push({ type: 'num', value })
    } else if (isIdentStart(ch)) {
      let raw = ''
      while (i < input.length && isIdentPart(input[i])) raw += input[i++]
      tokens.push({ type: 'id', value: raw })
    } else if (ch === '<' || ch === '>' || ch === '=' || ch === '!') {
      const two = input.slice(i, i + 2)
      if (two === '<=' || two === '>=' || two === '==' || two === '!=') {
        tokens.push({ type: 'op', value: two })
        i += 2
      } else if (ch === '<' || ch === '>') {
        tokens.push({ type: 'op', value: ch })
        i++
      } else {
        throw new FormulaError(`Unexpected character "${ch}" (use ==, !=, <=, >=)`)
      }
    } else if (OP_CHARS.includes(ch)) {
      tokens.push({ type: 'op', value: ch })
      i++
    } else if (ch === '(') {
      tokens.push({ type: 'lparen' })
      i++
    } else if (ch === ')') {
      tokens.push({ type: 'rparen' })
      i++
    } else if (ch === ',') {
      tokens.push({ type: 'comma' })
      i++
    } else {
      throw new FormulaError(`Unexpected character "${ch}"`)
    }
  }

  return tokens
}
