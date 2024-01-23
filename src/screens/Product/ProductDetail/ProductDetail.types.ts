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
  batches: z.array(ProductBatchSchema.partial({ id: true })),
})
export const StockDetailSchema = ProductDetailSchema

export type StockDetail = z.infer<typeof StockDetailSchema>
