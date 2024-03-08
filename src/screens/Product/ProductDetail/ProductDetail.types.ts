import { ProductSchema, ProductBatchSchema } from 'types/product.types'
import { z } from 'zod'
export const ProductDetailSchema = ProductSchema.partial({
  id: true,
}).extend({
  cost: z
    .number({
      coerce: true,
      required_error: 'Cost is required',
    })
    .positive('Must be greater than 0'),
  activeBatch: ProductBatchSchema.optional(),
})
export const StockDetailSchema = ProductDetailSchema

export const AddProductDetailSchema = ProductSchema.omit({
  id: true,
  activeBatch: true,
}).extend({
  cost: z
    .number({
      coerce: true,
      required_error: 'Cost is required',
    })
    .positive('Must be greater than 0'),
})

export const ViewProductDetailSchema = ProductSchema.extend({
  cost: z
    .number({
      coerce: true,
      required_error: 'Cost is required',
    })
    .positive('Must be greater than 0'),
})

export const ProductDetailFormValidationSchema = ProductSchema.omit({
  id: true,
  activeBatch: true,
  outOfStock: true,
  availability: true,
  totalQuantity: true,
})
  .partial({
    recipe: true,
  })
  .extend({
    overallCost: z
      .number({
        required_error: 'Cost is required',
        invalid_type_error: 'Cost must be a number',
        coerce: true,
      })
      .positive('Cost must be greater than 0')
      .optional(),
  })

export type ViewProductDetailSchema = z.infer<typeof ViewProductDetailSchema>
export type AddProductDetailSchema = z.infer<typeof AddProductDetailSchema>

export type StockDetail = z.infer<typeof StockDetailSchema>

export const FormikValuesSchema = ProductSchema.extend({
  overallCost: z
    .number({
      required_error: 'Cost is required',
      invalid_type_error: 'Cost must be a number',
      coerce: true,
    })
    .positive('Cost must be greater than 0')
    .optional(),
})

export type ProductDetailFormikValue = z.infer<typeof FormikValuesSchema>

export const AddProductValidationSchema = ProductSchema.omit({
  id: true,
  activeBatch: true,
  outOfStock: true,
  availability: true,
  totalQuantity: true,
}).partial({
  recipe: true,
})
