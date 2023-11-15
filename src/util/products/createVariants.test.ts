import { createVariants } from '../products'
import { describe, expect, it } from 'vitest'

describe('createVariants', () => {
  it('should generate variants for a product with a single option', () => {
    const options = [
      {
        option: 'size',
        values: ['small', 'medium'],
      },
    ]

    const result = createVariants(options)
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('small')
    expect(result[1].name).toBe('medium')
  })

  it('should generate all combinations for a product with multiple options', () => {
    const options = [
      {
        option: 'size',
        values: ['small', 'medium'],
      },
      {
        option: 'type',
        values: ['espresso', 'latte'],
      },
    ]

    const result = createVariants(options)
    expect(result).toHaveLength(4)
    expect(result).toEqual(
      expect.arrayContaining([
        {
          name: 'small/espresso',
          variant: [
            { option: 'size', value: 'small' },
            { option: 'type', value: 'espresso' },
          ],
        },
        {
          name: 'small/latte',
          variant: [
            { option: 'size', value: 'small' },
            { option: 'type', value: 'latte' },
          ],
        },
        {
          name: 'medium/espresso',
          variant: [
            { option: 'size', value: 'medium' },
            { option: 'type', value: 'espresso' },
          ],
        },
        {
          name: 'medium/latte',
          variant: [
            { option: 'size', value: 'medium' },
            { option: 'type', value: 'latte' },
          ],
        },
      ]),
    )
  })

  it('should handle options with empty values correctly', () => {
    const options = [
      {
        option: 'size',
        values: ['small', 'medium'],
      },
      {
        option: 'color',
        values: [],
      },
    ]

    const result = createVariants(options)
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('small')
    expect(result[1].name).toBe('medium')
  })
})
