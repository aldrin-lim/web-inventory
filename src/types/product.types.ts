import { z } from 'zod'

export type ProductVariantAttribute = {
  option: string
  values: Array<string>
}

export enum ProductSoldBy {
  Pieces = 'pieces',
  Weight = 'weight',
}

export const OptionSchema = z.object({
  option: z.string({
    required_error: 'Variant Option name is required',
    invalid_type_error: 'Variant Option name must be a string',
  }),
  value: z.string({
    required_error: 'Variant Option value is required',
    invalid_type_error: 'Variant Option value must be a string',
  }),
})

export const ProductBatchSchema = z.object({
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
  expirationDate: z
    .date({ invalid_type_error: 'Expiration  must be a data', coerce: true })
    .nullable(),
})

export const BaseProductSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  profitAmount: z.number({
    required_error: 'Profit Amount is required',
    invalid_type_error: 'Profit Amount must be a number',
    coerce: true,
  }),
  profitPercentage: z.number({
    required_error: 'Profit Percentage is required',
    invalid_type_error: 'Profit Percentage must be a number',
    coerce: true,
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
    coerce: true,
  }),
  images: z.array(z.string()),
  category: z
    .string({
      invalid_type_error: 'Category must be a string',
    })
    .optional(),
  trackStock: z
    .boolean({
      required_error: 'Track Stock is required',
    })
    .default(false),
  isBulkCost: z
    .boolean({
      required_error: 'Is Bulk Cost is required',
    })
    .default(false),
  soldBy: z.nativeEnum(ProductSoldBy).default(ProductSoldBy.Pieces),
  forSale: z
    .boolean({
      required_error: 'For Sale is required',
    })
    .default(true),

  allowBackOrder: z
    .boolean({
      invalid_type_error: 'Allow back order must be a boolean',
    })
    .default(false),
  batches: z
    .array(ProductBatchSchema)
    .min(1, 'Batches must have at least 1 item'),

  // Read only
  outOfStock: z.boolean().default(false),
  availability: z.string().default(''),
  totalQuantity: z.number().default(0),
  activeBatch: ProductBatchSchema,
})

export const ProductSchema = BaseProductSchema

export type Product = z.infer<typeof ProductSchema>
