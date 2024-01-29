import { AxiosResponse } from 'axios'
import { RecipeSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (param: { id: string }) => {
  const result = await httpClient
    .post<unknown, AxiosResponse<z.infer<typeof RecipeSchema>>>(
      `/recipes/${param.id}/clone`,
    )
    .then((res) => res.data)
  return result
}
