import convert from 'convert-units'
import { Material } from 'types/recipe.types'

export const calculateMaxRecipeQuantity = (materials: Material[]): number => {
  let minQuantityPossible = Infinity

  for (const material of materials) {
    if (!material.product) {
      throw new Error(`Product not found for material: ${material.id}`)
    }

    const productQuantityInMaterialUnit = convert(material.product.quantity)
      .from(material.product.measurement)
      .to(material.measurement)
    const quantityPossibleWithProduct =
      productQuantityInMaterialUnit / material.quantity
    minQuantityPossible = Math.min(
      minQuantityPossible,
      quantityPossibleWithProduct,
    )
  }

  return Math.floor(minQuantityPossible)
}
