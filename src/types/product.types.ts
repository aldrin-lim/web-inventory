import { uniqueVariantCombinations } from 'util/products'
import { z } from 'zod'

export type ProductVariantAttribute = {
  option: string
  values: Array<string>
}

export const VariantOptionsSchema = z.object({
  option: z.string({
    required_error: 'Variant Option name is required',
    invalid_type_error: 'Variant Option name must be a string',
  }),
  value: z.string({
    required_error: 'Variant Option value is required',
    invalid_type_error: 'Variant Option value must be a string',
  }),
})

export const ProductVariantSchema = z.object({
  id: z.string().optional(),
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
  expiryDate: z.coerce.date().nullable().optional(),
  // variantOptions: the validation
  variantOptions: z.array(VariantOptionsSchema),
})

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'Product name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost must be a number',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }),
  profit: z.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit must be a number',
  }),
  images: z.array(z.string()).optional(),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int(),
  measurement: z
    .string({
      required_error: 'Measurement is required',
      invalid_type_error: 'Measurement must be a string',
    })
    .optional(),
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
  expiryDate: z.coerce.date().nullable().optional(),
  variants: z
    .array(ProductVariantSchema)
    .optional()
    .refine(uniqueVariantCombinations, {
      message:
        'Product variants must have unique combinations of options and values',
    }),
})

export type Product = z.infer<typeof ProductSchema>
export type ProductVariant = z.infer<typeof ProductVariantSchema>
