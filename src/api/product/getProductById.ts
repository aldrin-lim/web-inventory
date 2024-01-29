import { AxiosResponse } from 'axios'
import { ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (id: string) => {
  const url = `/products/${id}`

  const result = await httpClient
    .get<unknown, AxiosResponse<z.infer<typeof GetProductSchema>>>(url)
    .then((res) => res.data)
  return result || []
}

export const GetProductSchema = ProductSchema
