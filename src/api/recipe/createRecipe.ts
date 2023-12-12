import { AxiosResponse } from 'axios'
import { ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (
  param: CreateRecipeRequestSchema,
): Promise<CreateRecipeResponseSchema> => {
  const result = await httpClient
    .post<CreateRecipeRequestSchema, AxiosResponse<CreateRecipeResponseSchema>>(
      `/recipes`,
      param,
    )
    .then((res) => res.data)
  return CreateRecipeResponseSchema.parse(result)
}

// Schema and Types
export type CreateRecipeRequestSchema = z.infer<
  typeof CreateRecipeRequestSchema
>
type CreateRecipeResponseSchema = z.infer<typeof CreateRecipeResponseSchema>

export const CreateRecipeRequestSchema = z.object({
  name: z.string({
    required_error: 'Recipe name is required',
    invalid_type_error: 'Recipe name is must be a string',
  }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  unit: z.string({
    required_error: 'Unit is required',
    invalid_type_error: 'Unit is must but a string',
  }),
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost is must be a number',
  }),
  materials: z
    .array(
      z.object({
        quantity: z.number({
          required_error: 'Quantity is required',
        }),
        unit: z
          .string({
            required_error: 'Measurement is required',
          })
          .min(1),
        product: z.object({
          id: z.string({
            required_error: 'Product is required',
          }),
        }),
      }),
    )
    .min(1, 'Materials must have at least 1 item'),
})

export const CreateRecipeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  materials: z.array(
    z.object({
      quantity: z.number(),
      product: ProductSchema,
    }),
  ),
})
