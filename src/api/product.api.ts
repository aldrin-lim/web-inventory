import { AxiosResponse } from 'axios'
import { Product, UpdateProductRequestScheam } from 'types/product.types'
import { httpClient } from 'util/http'

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

export const deleteProductById = async (param: { id: string }) => {
  const { id } = param
  const url = `/products/${id}`

  const result = await httpClient
    .delete<unknown, AxiosResponse<Product>>(url)
    .then((res) => res.data)
  return result || []
}
