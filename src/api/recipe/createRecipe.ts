import { AxiosResponse } from 'axios'
import {
  MaterialSchema,
  ProductSchema,
  RecipeSchema,
} from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (
  param: CreateRecipeRequestSchema,
): Promise<z.infer<typeof RecipeSchema>> => {
  const result = await httpClient
    .post<
      CreateRecipeRequestSchema,
      AxiosResponse<z.infer<typeof RecipeSchema>>
    >(`/recipes`, param)
    .then((res) => res.data)
  return CreateRecipeResponseSchema.parse(result)
}

export type CreateRecipeRequestSchema = z.infer<typeof CreateRecipeSchema>

// Schema and Types
export const CreateRecipeSchema = RecipeSchema.omit({ id: true })
  .extend({
    materials: z
      .array(
        MaterialSchema.omit({ id: true }).extend({
          product: ProductSchema.pick({ id: true }),
          quantity: z
            .number({
              required_error: 'Quantity is required',
              invalid_type_error: 'Quantity is required',
            })
            .min(1, 'Material quantity must be at least 1'),
        }),
      )
      .min(1, 'Materials must have at least 1 item'),
  })
  .strip()

export const CreateRecipeResponseSchema = RecipeSchema
