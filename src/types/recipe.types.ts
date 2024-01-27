import { z } from 'zod'
import { ProductSchema } from './product.types'

export enum MaterialType {
  Ingredient = 'ingredient',
  Other = 'other',
}

export const MaterialSchema = z.object({
  id: z.string(),
  quantity: z.number({
    required_error: 'Material quantity is required',
  }),
  product: ProductSchema,
  cost: z.number({ required_error: 'Cost is required' }),
  unitOfMeasurement: z
    .string({
      required_error: 'Measurement is required',
    })
    .min(1),
  type: z.nativeEnum(MaterialType).default(MaterialType.Ingredient),
})

export type Material = z.infer<typeof MaterialSchema>

export const RecipeSchema = z.object({
  id: z.string({ required_error: 'Recipe id is required' }),
  name: z.string({
    required_error: 'Recipe name is required',
    invalid_type_error: 'Recipe name is must be a string',
  }),
  profitPercentage: z.coerce.number({
    required_error: 'Profit % is required',
    invalid_type_error: 'Profit  % is required',
  }),
  profitAmount: z.coerce.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit is required',
  }),
  cost: z.number({
    coerce: true,
    required_error: 'Cost is required',
  }),
  quantity: z.number({
    coerce: true,
    required_error: 'Cost is required',
  }),
  price: z.coerce.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price is must be number',
  }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  materials: z
    .array(MaterialSchema)
    .min(1, 'Materials must have at least 1 item'),
})

export type Recipe = z.infer<typeof RecipeSchema>
