type MeasurementUnit = {
  abbreviation: string
  description: string
}

export const measurementUnits: MeasurementUnit[] = [
  // Solid Food Measurements
  { abbreviation: 'g', description: 'Grams' },
  { abbreviation: 'kg', description: 'Kilograms' },
  { abbreviation: 'oz', description: 'Ounces' },
  { abbreviation: 'lb', description: 'Pounds' },
  // Volume (for loose items)
  { abbreviation: 'ml', description: 'Milliliters' },
  { abbreviation: 'l', description: 'Liters' },
  { abbreviation: 'cup', description: 'Cups' },
  { abbreviation: 'tsp', description: 'Teaspoons' },
  { abbreviation: 'tbsp', description: 'Tablespoons' },
  // Unit Counts
  { abbreviation: 'pcs', description: 'Pieces' },
  { abbreviation: 'dz', description: 'Dozens' },

  // Liquid Beverage Measurements
  { abbreviation: 'fl oz', description: 'Fluid Ounces' },
  { abbreviation: 'pt', description: 'Pints' },
  { abbreviation: 'qt', description: 'Quarts' },
  { abbreviation: 'gal', description: 'Gallons' },
  // Specific to Alcoholic Beverages
  { abbreviation: 'proof', description: 'Proof' },
  { abbreviation: 'std', description: 'Standard Drink Units' },
]
