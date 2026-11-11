import { describe, expect, it } from 'vitest'
import { sum } from './sum.ts'

describe('sum', () => {
  it('adds two positive numbers', () => {
    expect(sum(2, 3)).toBe(5)
  })

  it('handles negative numbers', () => {
    expect(sum(-2, 3)).toBe(1)
  })
})
