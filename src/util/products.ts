import { VariantOptions, ProductVariant } from 'types/product.types'

const generateCombinations = (
  options: Array<VariantOptions>,
  currentCombination: Array<{ option: string; value: string }> = [],
  index: number = 0,
): Array<Array<{ option: string; value: string }>> => {
  if (index === options.length) {
    return [currentCombination]
  }

  const currentOption = options[index]
  let result: Array<Array<{ option: string; value: string }>> = []

  if (currentOption.values.length === 0) {
    return generateCombinations(options, currentCombination, index + 1)
  }

  for (const value of currentOption.values) {
    const newCombination = [
      ...currentCombination,
      { option: currentOption.option, value },
    ]
    result = result.concat(
      generateCombinations(options, newCombination, index + 1),
    )
  }

  return result
}

export const createVariants = (
  options: Array<VariantOptions>,
): Array<ProductVariant> => {
  if (!options) {
    return []
  }

  const combinations = generateCombinations(options)

  return combinations.map((combination) => ({
    name: combination.map((item) => item.value).join('/'),
    variant: combination,
  }))
}
