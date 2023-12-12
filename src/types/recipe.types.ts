import { z } from 'zod'
import { ProductSchema } from './product.types'

const MaterialSchema = z.object({
  quantity: z.number({
    required_error: 'Quantity is required',
  }),
  product: ProductSchema,
  unit: z
    .string({
      required_error: 'Measurement is required',
    })
    .min(1),
})
export type Material = z.infer<typeof MaterialSchema>

const RecipeSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'recipe name is required',
    invalid_type_error: 'recipe name is must be a string',
  }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  unit: z.string(),
  cost: z.number(),
  materials: z
    .array(MaterialSchema)
    .min(1, 'Materials must have at least 1 item'),
})

export type Recipe = z.infer<typeof RecipeSchema>
