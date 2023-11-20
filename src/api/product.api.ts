import { AxiosResponse } from 'axios'
import {
  AddProductRequestSchema,
  AddProductResponseSchema,
  GetAllProductSchema,
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

export const getAllProducts = async () => {
  const result = await httpClient
    .get<unknown, AxiosResponse<Array<GetAllProductSchema>>>(`/products`)
    .then((res) => res.data)
  return result || []
}
