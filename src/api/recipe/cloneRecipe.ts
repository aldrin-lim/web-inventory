import { AxiosResponse } from 'axios'
import { Recipe } from 'types/recipe.types'
import { httpClient } from 'util/http'

export default async (param: { id: string }) => {
  const result = await httpClient
    .post<unknown, AxiosResponse<Recipe>>(`/recipes/${param.id}/clone`)
    .then((res) => res.data)
  return result
}
