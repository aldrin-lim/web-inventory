import { z } from 'zod'

export type VariantOptions = {
  option: string
  values: Array<string>
}

export type ProductVariant = {
  name: string
  variant: Array<{
    option: string
    value: string
  }>
}

export const addProductDetailSchema = z.object({
  id: z.string(),
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
    .nullable()
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
  expiryDate: z
    .date({
      invalid_type_error: 'Expiry Date must be a date',
    })
    .nullable()
    .optional(),
})
export type AddProductResponseSchema = z.infer<typeof addProductRequestSchema>

export const addProductSchema = z.object({
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
  images: z.array(z.string()).optional(),
})

export const addProductRequestSchema = addProductSchema
  .and(addProductDetailSchema)
  .and(
    z.object({
      profit: z.number({
        required_error: 'Profit is required',
        invalid_type_error: 'Profit must be a number',
      }),
    }),
  )
export type AddProductRequestSchema = z.infer<typeof addProductRequestSchema>

const getProductResponseSchema = z.object({
  id: z.string().optional(),
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
  expiryDate: z
    .date({
      invalid_type_error: 'Expiry Date must be a date',
    })
    .nullable()
    .optional(),
  profit: z.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit must be a number',
  }),
})

export type GetAllProductSchema = z.infer<typeof getProductResponseSchema>

export const getAllProductsFilterSchema = z.object({
  outOfStock: z.boolean().optional(),
})

export type GetAllProductFilterSchema = z.infer<
  typeof getAllProductsFilterSchema
>

const productSchema = z.object({
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
  expiryDate: z
    .date({
      invalid_type_error: 'Expiry Date must be a date',
    })
    .nullable()
    .optional(),
  profit: z.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit must be a number',
  }),
})

export type Product = z.infer<typeof productSchema>

export const updateProductRequestSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: 'Product name is required',
      invalid_type_error: 'Name must be a string',
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  cost: z
    .number({
      required_error: 'Cost is required',
      invalid_type_error: 'Cost must be a number',
    })
    .optional(),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .optional(),
  profit: z
    .number({
      required_error: 'Profit is required',
      invalid_type_error: 'Profit must be a number',
    })
    .optional(),
  images: z.array(z.string()).optional(),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int()
    .optional(),
  measurement: z
    .string({
      required_error: 'Measurement is required',
      invalid_type_error: 'Measurement must be a string',
    })
    .optional()
    .default(''),
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
  expiryDate: z
    .date({
      invalid_type_error: 'Expiry Date must be a date',
    })
    .nullable()
    .optional(),
})

export type UpdateProductRequestScheam = z.infer<
  typeof updateProductRequestSchema
>
