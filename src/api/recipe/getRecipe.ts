import { AxiosResponse } from 'axios'
import { ProductBatchSchema, ProductSchema } from 'types/product.types'
import { RecipeSchema } from 'types/recipe.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (id: string) => {
  const url = `/recipes/${id}`

  const result = await httpClient
    .get<unknown, AxiosResponse<z.infer<typeof RecipeSchema>>>(url)
    .then((res) => res.data)
  return result || []
}

export const GetProductSchema = ProductSchema.extend({
  activeBatch: ProductBatchSchema,
})
