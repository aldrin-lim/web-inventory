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
  price: z
    .number({
      coerce: true,
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .positive('Price must be greater than 0')
    .optional(),
  profitAmount: z
    .number({
      required_error: 'Profit Amount is required',
      invalid_type_error: 'Profit Amount must be a number',
      coerce: true,
    })
    .positive('Profit Amount must be greater than 0')
    .optional(),
  profitPercentage: z
    .number({
      required_error: 'Profit Percentage is required',
      invalid_type_error: 'Profit Percentage must be a number',
      coerce: true,
    })
    .positive('Profit Percentage must be greater than 0')
    .optional(),
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
