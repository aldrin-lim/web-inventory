import { AxiosResponse } from 'axios'
import { Product } from 'types/product.types'
import { httpClient } from 'util/http'

export default async (param: { id: string }) => {
  const result = await httpClient
    .post<unknown, AxiosResponse<Product>>(`/products/${param.id}/clone`)
    .then((res) => res.data)
  return result
}
