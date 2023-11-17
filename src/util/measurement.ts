type Unit =
  | 'g'
  | 'kg'
  | 'oz'
  | 'lb'
  | 'ml'
  | 'l'
  | 'cup'
  | 'tsp'
  | 'tbsp'
  | 'pcs'
  | 'dz'
  | 'fl oz'
  | 'pt'
  | 'qt'
  | 'gal'
  | 'proof'
  | 'std'

export const measurementUnits: Unit[] = [
  // Solid Food Measurements
  'g',
  'kg',
  'oz',
  'lb', // Weight
  'ml',
  'l',
  'cup',
  'tsp',
  'tbsp', // Volume (for loose items)
  'pcs',
  'dz', // Unit Counts

  // Liquid Beverage Measurements
  'ml',
  'l',
  'fl oz',
  'pt',
  'qt',
  'gal', // Volume
]
