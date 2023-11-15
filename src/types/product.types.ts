export type VariantOptions = {
  option: string
  values: Array<string>
}

export type ProductVariant = {
  name: string
  variant: Array<{
    option: string
    value: string
  }>
}

export type Product = {
  name: string
  description?: string
  price: number
  cost: number
  profit: number
  images?: Array<string>
  options?: Array<VariantOptions>
  productVariants?: Array<ProductVariant>
}
