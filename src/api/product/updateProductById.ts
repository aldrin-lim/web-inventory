import { AxiosResponse } from 'axios'
import { Product, ProductBatchSchema, ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
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
export const UpdateProductSchema = ProductSchema.partial().extend({
  batches: z.array(ProductBatchSchema.partial({ id: true })),
})

export type UpdateProductRequestScheam = z.infer<typeof UpdateProductSchema>
