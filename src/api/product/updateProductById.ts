import { AxiosResponse } from 'axios'
import { Product, ProductVariantSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { uniqueVariantCombinations } from 'util/products'
import { z } from 'zod'

export default async (param: {
  id: string
  product: UpdateProductRequestScheam
}) => {
  const { id, product } = param
  const url = `/products/${id}`

  const result = await httpClient
    .patch<unknown, AxiosResponse<Product>>(url, product)
    .then((res) => res.data)
  return result || []
}

// Schema and Types
export const UpdateProductSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: 'Product name is required',
      invalid_type_error: 'Name must be a string',
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  cost: z
    .number({
      required_error: 'Cost is required',
      invalid_type_error: 'Cost must be a number',
    })
    .optional(),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .optional(),
  profit: z
    .number({
      required_error: 'Profit is required',
      invalid_type_error: 'Profit must be a number',
    })
    .optional(),
  images: z.array(z.string()).optional(),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int()
    .optional(),
  measurement: z
    .string({
      required_error: 'Measurement is required',
      invalid_type_error: 'Measurement must be a string',
    })
    .optional()
    .default(''),
  category: z
    .string({
      invalid_type_error: 'Category must be a string',
    })
    .optional(),
  allowBackOrder: z
    .boolean({
      invalid_type_error: 'Allow back order must be a boolean',
    })
    .optional(),
  expiryDate: z.coerce.date().nullable().optional(),
  variants: z
    .array(ProductVariantSchema)
    .optional()
    .refine(uniqueVariantCombinations, {
      message:
        'Product variants must have unique combinations of options and values',
    }),
})

export type UpdateProductRequestScheam = z.infer<typeof UpdateProductSchema>
