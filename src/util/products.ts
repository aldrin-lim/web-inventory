import { Product, ProductVariant } from 'types/product.types'

export type ProductVariantAttribute = {
  option: string
  values: Array<string>
}

export const uniqueVariantCombinations = (
  variants?: Array<ProductVariant>,
): boolean => {
  if (!variants) {
    return true // If variants are undefined, skip the check
  }
  const seenCombinations = new Set<string>()

  for (const variant of variants) {
    // Here, focus on the 'variant' property of each variant object
    const sortedOptions = variant.variantOptions
      .map((opt) => `${opt.option}:${opt.value}`)
      .sort()
      .join('|')

    if (seenCombinations.has(sortedOptions)) {
      return false // Duplicate combination found
    }

    seenCombinations.add(sortedOptions)
  }

  return true // No duplicates found
}

export function cartesianProduct(
  arr: Array<ProductVariantAttribute>,
): string[][] {
  return arr.reduce<string[][]>(
    (a, b) => a.flatMap((d) => b.values.map((e) => [d, e].flat())),
    [[]],
  )
}

export function generateProductVariants(
  variantOptionsInput: Array<ProductVariantAttribute>,
  product: Product,
): Product {
  const variantCombinations = cartesianProduct(variantOptionsInput)
  const variants: Product['variants'] = variantCombinations.map(
    (combination) => {
      const variantName = combination.join('/')
      return {
        ...product,
        name: `${product.name} (${variantName})`,
        variantOptions: combination.map((value, index) => ({
          option: variantOptionsInput[index].option,
          value: value,
        })),
      }
    },
  )

  return {
    ...product,
    variants,
  }
}
