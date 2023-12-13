import { AxiosResponse } from 'axios'
import { PaginationOptions } from 'types/api.types'
import { ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (
  param?: PaginationOptions,
): Promise<GetAllRecipeResponseSchema> => {
  let url = '/recipes'

  if (param && Object.keys(param).length > 0) {
    url = `${url}?${new URLSearchParams(param as string).toString()}`
  }

  const result = await httpClient
    .get<unknown, AxiosResponse<null, GetAllRecipeResponseSchema>>(url)
    .then((res) => res.data)
  return GetAllRecipeResponseSchema.parse(result)
}

// Schema and Types
export type GetAllRecipeResponseSchema = z.infer<
  typeof GetAllRecipeResponseSchema
>

const GetAllRecipeResponseSchema = z.array(
  z.object({
    id: z.string({
      required_error: 'Id is required',
    }),
    name: z.string({
      required_error: 'Name is required',
    }),
    description: z.string().optional(),
    images: z.array(z.string()).optional().nullable(),
    measurement: z.string({
      required_error: 'Measurement is required',
    }),
    cost: z.number({
      required_error: 'Cost is required',
    }),
    quantity: z.number({
      required_error: 'Quantity is required',
    }),
    materials: z
      .array(
        z.object({
          measurement: z.string({
            required_error: 'Measurement is required',
          }),
          quantity: z.number({
            required_error: 'Quantity is required',
          }),
          product: ProductSchema,
        }),
      )
      .min(1, 'Materials must have at least 1 item'),
  }),
)
