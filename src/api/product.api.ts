import { AxiosResponse } from 'axios'
import { PaginationOptions } from 'types/api.types'
import {
  AddProductRequestSchema,
  AddProductResponseSchema,
  GetAllProductFilterSchema,
  GetAllProductSchema,
  Product,
  UpdateProductRequestScheam,
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

export const getAllProducts = async (
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

export const getProductById = async (id: string) => {
  const url = `/products/${id}`

  const result = await httpClient
    .get<unknown, AxiosResponse<Product>>(url)
    .then((res) => res.data)
  return result || []
}

export const updateProductById = async (param: {
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
