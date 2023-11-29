import { AxiosResponse } from 'axios'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (param: AddProductSchema) => {
  const result = await httpClient
    .post<AddProductSchema, AxiosResponse<AddProductSchema>>(`/products`, param)
    .then((res) => res.data)
  return result
}

// Schema and Types
type AddProductSchema = z.infer<typeof AddProductSchema>

const AddProductSchema = z.object({
  id: z.string().optional(),
  name: z.string({
    required_error: 'Product name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost must be a number',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }),
  profit: z.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit must be a number',
  }),
  images: z.array(z.string()).optional(),
})
