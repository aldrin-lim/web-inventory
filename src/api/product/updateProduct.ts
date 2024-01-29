import { AxiosResponse } from 'axios'
import { ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (param: {
  id: string
  product: UpdateProductRequestScheam
}) => {
  const { id, product } = param
  const url = `/products/${id}`

  const result = await httpClient
    .patch<
      UpdateProductRequestScheam,
      AxiosResponse<z.infer<typeof ProductSchema>>
    >(url, product)
    .then((res) => res.data)
  return result || []
}

// Schema and Types
export const UpdateProductBodySchema = ProductSchema.omit({
  id: true,
  activeBatch: true,
  outOfStock: true,
  availability: true,
  totalQuantity: true,
}).partial()

export type UpdateProductRequestScheam = z.infer<typeof UpdateProductBodySchema>
