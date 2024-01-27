import { ProductBatchSchema } from 'types/product.types'
import { z } from 'zod'

const GetActiveBatchParam = z.union([
  ProductBatchSchema,
  ProductBatchSchema.partial({ id: true }),
])
type GetActiveBatchParam = z.infer<typeof GetActiveBatchParam>[]
export const getActiveBatch = (batches: GetActiveBatchParam) => {
  // Find the first batch that has quantity > 0
  // Check if it has expiration date, if it has, check if its not expired
  // Batch is active when quantity > 0 and not expired or no expiration date
  const activeBatch = batches.find(
    (batch) =>
      batch.quantity > 0 &&
      (!batch.expirationDate || new Date(batch.expirationDate) > new Date()),
  )

  // If no active batch found, get the first batch
  if (!activeBatch) {
    return batches[0]
  }

  return activeBatch
}
