import { AxiosResponse } from 'axios'
import {
  AddProductRequestSchema,
  AddProductResponseSchema,
} from 'types/product.types'
import { httpClient } from 'util/http'

export const createProduct = async (param: AddProductRequestSchema) => {
  const result = await httpClient
    .post<AddProductRequestSchema, AxiosResponse<AddProductResponseSchema>>(
      `/products`,
      param,
    )
    .then((res) => res.data)
  return result
}
