import { AxiosResponse } from 'axios'
import { PaginationOptions } from 'types/api.types'
import { ProductBatchSchema, ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (
  param?: PaginationOptions & GetAllProductFilterSchema,
) => {
  let url = '/products'

  if (param && Object.keys(param).length > 0) {
    url = `${url}?${new URLSearchParams(param as string).toString()}`
  }

  const result = await httpClient
    .get<unknown, AxiosResponse<Array<GetAllProductSchema>>>(url)
    .then((res) => res.data)
  return result || []
}

// Schema and Types
export type GetAllProductSchema = z.infer<typeof GetProductSchema>

export type GetAllProductFilterSchema = z.infer<
  typeof GetAllProductsFilterSchema
>

const GetProductSchema = ProductSchema.extend({
  activeBatch: ProductBatchSchema,
})

const GetAllProductsFilterSchema = z.object({
  outOfStock: z.boolean().optional(),
})
