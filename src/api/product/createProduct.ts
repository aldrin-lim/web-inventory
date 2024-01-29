import { AxiosResponse } from 'axios'
import { ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (param: CreateProductBodySchema) => {
  const result = await httpClient
    .post<
      CreateProductBodySchema,
      AxiosResponse<z.infer<typeof ProductSchema>>
    >(`/products`, param)
    .then((res) => res.data)
  return result
}

// Schema and Types
export type CreateProductBodySchema = z.infer<typeof CreateProductBodySchema>

export const CreateProductBodySchema = ProductSchema.omit({
  id: true,
  activeBatch: true,
  outOfStock: true,
  availability: true,
  totalQuantity: true,
}).extend({
  recipe: z
    .object({
      id: z.string(),
    })
    .optional(),
})
