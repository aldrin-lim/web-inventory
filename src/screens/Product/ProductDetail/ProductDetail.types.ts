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
    .positive('2Cost must be greater than 0')
    .optional(),
  batches: z
    .array(
      z.object({
        id: z.string(),
        name: z.string({
          required_error: 'Name is required',
          invalid_type_error: 'Name must be a string',
        }),
        cost: z.number({
          coerce: true,
          required_error: 'Cost is required',
          invalid_type_error: 'Cost must be a number',
        }),
        costPerUnit: z
          .number({
            coerce: true,
            invalid_type_error: 'Cost per Unit must be a number',
          })
          .optional(),
        quantity: z.number({
          coerce: true,
          required_error: 'Quantity is required',
          invalid_type_error: 'Quantity must be a number',
        }),
        unitOfMeasurement: z.string({
          required_error: 'Measurement is required',
          invalid_type_error: 'Measurement must be a number',
        }),
        isDeducted: z.boolean().default(false),
        expirationDate: z
          .date({
            invalid_type_error: 'Expiration  must be a data',
            coerce: true,
          })
          .nullable(),
      }),
    )
    .min(1, 'At least one batch is required'),
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
