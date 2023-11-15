import { AxiosResponse } from 'axios'
import { User } from 'types/user.type'
import { httpClient } from 'util/http'

export const getUser = async (email: string) => {
  const result = await httpClient
    .post<{ email: string }, AxiosResponse<User>>(`/users/me`, { email })
    .then((res) => res.data)
  return result
}

export type UpdateUserRequestParam = {
  firstName?: string
  lastName?: string
}

export const updateUser = async (param: UpdateUserRequestParam) => {
  const result = await httpClient
    .patch(`/users/me`, param)
    .then((res) => res.data)
  return result
}
