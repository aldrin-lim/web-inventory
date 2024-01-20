import { ProductSchema, ProductBatchSchema } from 'types/product.types'
import { z } from 'zod'
export const ProductDetailSchema = ProductSchema.partial({
  id: true,
}).extend({
  profitPercentage: z.coerce.number({
    required_error: 'Profit % is required',
    invalid_type_error: 'Profit  % is required',
  }),
  profitAmount: z.coerce
    .number({
      required_error: 'Profit is required',
      invalid_type_error: 'Profit is required',
    })
    .nullable(),
  cost: z
    .number({
      coerce: true,
      required_error: 'Cost is required',
      invalid_type_error: 'Cost is required',
    })
    .nullable(),
  price: z
    .number({
      coerce: true,
      required_error: 'Price is required',
      invalid_type_error: 'Price is required',
    })
    .nullable(),
  activeBatch: ProductBatchSchema.optional(),
  batches: z.array(ProductBatchSchema.partial({ id: true })),
})
export const StockDetailSchema = ProductDetailSchema

export type StockDetail = z.infer<typeof StockDetailSchema>
