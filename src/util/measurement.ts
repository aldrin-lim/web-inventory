type MeasurementUnit = {
  abbreviation: string
  description: string
}

export const measurementUnits: MeasurementUnit[] = [
  // Solid Food Measurements
  { abbreviation: 'g', description: 'grams' },
  { abbreviation: 'kg', description: 'kilograms' },
  { abbreviation: 'oz', description: 'ounces' },
  { abbreviation: 'lb', description: 'pounds' },
  // volume (for loose items)
  { abbreviation: 'ml', description: 'milliliters' },
  { abbreviation: 'l', description: 'liters' },
  { abbreviation: 'cup', description: 'cups' },
  { abbreviation: 'tsp', description: 'teaspoons' },
  { abbreviation: 'tbsp', description: 'tablespoons' },
  // unit counts
  { abbreviation: 'pcs', description: 'pieces' },
  { abbreviation: 'dz', description: 'dozens' },

  // liquid beverage measurements
  { abbreviation: 'fl oz', description: 'fluid ounces' },
  { abbreviation: 'pt', description: 'pints' },
  { abbreviation: 'qt', description: 'quarts' },
  { abbreviation: 'gal', description: 'gallons' },
  // specific to alcoholic beverages
  { abbreviation: 'proof', description: 'proof' },
  { abbreviation: 'std', description: 'standard drink units' },
]
