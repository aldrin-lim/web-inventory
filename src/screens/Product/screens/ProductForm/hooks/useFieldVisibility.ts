interface FieldVisibility {
  price: boolean
  profitAmount: boolean
  profitPercentage: boolean
  currentCostInput: boolean
  currentCostLabel: boolean
  currentCostPerUnitInput: boolean
  applyTax: boolean
  forSaleToggle: boolean
  soldBy: boolean
  batches: boolean
}

const useFieldVisibility = (
  forSale: boolean,
  bulkCost: boolean,
  recipe: boolean,
  taxRateExists: boolean,
): FieldVisibility => {
  // Assuming taxRateExists is a simplified representation of whether taxRate is null or not.
  return {
    price: forSale || recipe, // Visible if forSale is true or recipe is provided.
    profitAmount: forSale || recipe, // Visible if forSale is true or recipe is provided.
    profitPercentage: forSale || recipe, // Visible if forSale is true or recipe is provided.
    currentCostInput: forSale && !bulkCost && !recipe, // Visible if forSale is true, bulkCost is false, and no recipe is provided.
    currentCostPerUnitInput: bulkCost && !recipe, // Visible if bulkCost is true and no recipe is provided.
    applyTax: taxRateExists, // Visible if a tax rate exists (assuming true means exists).
    currentCostLabel: recipe, // Visible if a recipe is provided.
    forSaleToggle: !recipe, // The forSale checkbox is hidden when a recipe is provided.
    soldBy: !recipe, // The soldBy UI is hidden when a recipe is provided.
    batches: !recipe, // The batches UI is hidden when a recipe is provided.
  }
}

export default useFieldVisibility
