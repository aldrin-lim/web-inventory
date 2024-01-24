import { AxiosResponse } from 'axios'
import { httpClient } from 'util/http'

export default async (param: { id: string }) => {
  const { id } = param
  const url = `/recipes/${id}`

  const result = await httpClient
    .delete<unknown, AxiosResponse>(url)
    .then((res) => res.data)
  return result || []
}
