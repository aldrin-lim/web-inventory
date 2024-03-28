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
  mode: z.enum(['add', 'edit']).default('add'),
}).superRefine(async (data, ctx) => {
  // TODO: Rename isForSale to isIngredient
  const isIngredient = data.forSale === false
  // If ingredient, no need to validate overall cost
  if (!isIngredient) {
    const priceValidation = z
      .number({
        coerce: true,
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .safeParse(toNumber(data.price))
    const profitAmountValidation = z
      .number({
        required_error: 'Profit Amount is required',
        invalid_type_error: 'Profit Amount must be a number',
        coerce: true,
      })
      .safeParse(toNumber(data.profitAmount))
    const profitPercentageValidation = z
      .number({
        required_error: 'Profit Percentage is required',
        invalid_type_error: 'Profit Percentage must be a number',
        coerce: true,
      })
      .safeParse(toNumber(data.profitPercentage))
    if (priceValidation.success === false) {
      ctx.addIssue({
        path: ['price'], // Path to the field
        message: priceValidation.error.issues[0].message,
        code: 'custom',
      })
    }
    if (profitAmountValidation.success === false) {
      ctx.addIssue({
        path: ['profitAmount'], // Path to the field
        message: profitAmountValidation.error.issues[0].message,
        code: 'custom',
      })
    }
    if (profitPercentageValidation.success === false) {
      ctx.addIssue({
        path: ['profitPercentage'], // Path to the field
        message: profitPercentageValidation.error.issues[0].message,
        code: 'custom',
      })
    }

    if (data.isBulkCost === false && !data.recipe) {
      const overallCostValidation = z
        .number({
          required_error: 'Cost is required',
          invalid_type_error: 'Cost must be a number',
          coerce: true,
        })
        .positive('Cost must be greater than 0')
        .safeParse(toNumber(data.overallCost))
      if (overallCostValidation.success === false) {
        ctx.addIssue({
          path: ['overallCost'], // Path to the field
          message: overallCostValidation.error.issues[0].message,
          code: 'custom',
        })
      }
    }
  }

  // Validate batches

  if (mode === 'add') {
    data.batches.forEach((batch) => {
      const quantityValidation = z
        .number({
          coerce: true,
          required_error: 'Quantity is required',
          invalid_type_error: 'Quantity must be a number',
        })
        .positive('Quantity must be greater than 0')
        .safeParse(batch.quantity)
      if (quantityValidation.success === false) {
        const index = data.batches.findIndex((b) => b.id === batch.id)
        ctx.addIssue({
          path: ['batches', index, 'quantity'], // Path to the field
          message: quantityValidation.error.issues[0].message,
          code: 'custom',
        })
      }
    })
  }
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
