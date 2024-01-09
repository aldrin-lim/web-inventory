import { z } from 'zod'

export type ProductVariantAttribute = {
  option: string
  values: Array<string>
}

export enum ProductType {
  Material = 'material',
  Regular = 'regular',
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
    required_error: 'Cost is required',
    invalid_type_error: 'Cost must be a number',
  }),
  costPerUnit: z
    .number({
      invalid_type_error: 'Cost per Unit must be a number',
    })
    .nullable()
    .optional(),
  quantity: z.number({
    required_error: 'Quantity is required',
    invalid_type_error: 'Quantity must be a number',
  }),
  unitOfMeasurment: z.string({
    required_error: 'Measurement is required',
    invalid_type_error: 'Measurement must be a number',
  }),
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
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost must be a number',
  }),
  profit: z.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit must be a number',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int(),
  measurement: z.string({
    required_error: 'Measurement is required',
    invalid_type_error: 'Measurement must be a string',
  }),
  images: z.array(z.string()).optional(),
  category: z
    .string({
      invalid_type_error: 'Category must be a string',
    })
    .optional(),
  allowBackOrder: z
    .boolean({
      invalid_type_error: 'Allow back order must be a boolean',
    })
    .optional(),
  batches: z
    .array(ProductBatchSchema)
    .min(1, 'Batches must have at least 1 item')
    .optional(),
})

export const ProductVariantSchema = BaseProductSchema.extend({
  id: z
    .string({
      invalid_type_error: 'Product Variant ID must be a string',
    })
    .optional(),
  variantOptions: z
    .array(OptionSchema)
    .min(1, 'Variant options must have at least 1 item'),
})

export const ProductSchema = BaseProductSchema

export type Product = z.infer<typeof ProductSchema>
export type ProductVariant = z.infer<typeof ProductVariantSchema>
