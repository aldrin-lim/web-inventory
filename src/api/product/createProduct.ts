import { AxiosResponse } from 'axios'
import { Product, ProductBatchSchema, ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (param: AddProductSchema) => {
  const result = await httpClient
    .post<AddProductSchema, AxiosResponse<Product>>(`/products`, param)
    .then((res) => res.data)
  return result
}

// Schema and Types
type AddProductSchema = z.infer<typeof AddProductSchema>

export const AddProductSchema = ProductSchema.partial({ id: true }).extend({
  batches: z
    .array(ProductBatchSchema.partial({ id: true }))
    .min(1, 'Batches must have at least 1 item')
    .optional(),
})
