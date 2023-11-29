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

export const AddProductSchema = z.object({
  id: z.string().optional(),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost must be a number',
  }),
  profit: z.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit must be a number',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int(),
  measurement: z.string({
    required_error: 'Measurement is required',
    invalid_type_error: 'Measurement must be a string',
  }),
  images: z.array(z.string()).optional(),
  category: z
    .string({
      invalid_type_error: 'Category must be a string',
    })
    .optional(),
  allowBackOrder: z
    .boolean({
      invalid_type_error: 'Allow back order must be a boolean',
    })
    .optional(),
  expiryDate: z.coerce.date().nullable().optional(),
})
