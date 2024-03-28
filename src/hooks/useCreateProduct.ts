import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { ProductSchema, ProductSoldBy } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

const useCreateProduct = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isCreating } = useMutation({
    mutationFn: async (param: CreateProductBodySchema) => {
      const result = await httpClient
        .post<
          CreateProductBodySchema,
          AxiosResponse<z.infer<typeof ProductSchema>>
        >(`/products`, param)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue. "
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response?.data?.message
        }
      }
      toast.error(errorMessage, {
        autoClose: 500,
        theme: 'colored',
      })
      setError(error)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['products'])
      toast.success('Product successfully created! ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  const createProduct = async (body: CreateProductBodySchema) => {
    await mutateAsync(body)
  }

  return {
    createProduct,
    isCreating,
    createProductError: error,
  }
}

type CreateProductBodySchema = z.infer<typeof productSchema>

const batchSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  cost: z
    .number({
      coerce: true,
      required_error: 'Cost is required',
      invalid_type_error: 'Cost must be a number',
    })
    .positive('Cost must be greater than 0'),
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
    .date({ invalid_type_error: 'Expiration  must be a data', coerce: true })
    .nullable(),
})

const recipeSchema = z.object({
  id: z.string({ required_error: 'Recipe id is required' }),
  name: z.string({
    required_error: 'Recipe name is required',
    invalid_type_error: 'Recipe name is must be a string',
  }),
  price: z.number({
    coerce: true,
    required_error: 'Recipe price is required',
    invalid_type_error: 'Recipe price must be a number',
  }),
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
  description: z.string().optional(),
  images: z.array(z.string()),
  cost: z.number(),
  quantity: z.number(),
  materials: z
    .array(
      // Material
      z.object({
        id: z
          .string({
            required_error: 'Material id is required',
            invalid_type_error: 'Material id must be a string',
          })
          .optional(),
        quantity: z.number({
          required_error: 'Material quantity is required',
        }),
        cost: z.number({ required_error: 'Cost is required' }),
        unitOfMeasurement: z
          .string({
            required_error: 'Measurement is required',
          })
          .min(1),
        product: z.object({
          id: z.string(),
          name: z.string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
          }),
          forSale: z.boolean({
            required_error: 'For Sale is required',
          }),
          description: z
            .string({
              required_error: 'Description is required',
              invalid_type_error: 'Description must be a string',
            })
            .optional(),
          price: z
            .number({
              required_error: 'Price is required',
              invalid_type_error: 'Price must be a number',
              coerce: true,
            })
            .default(0),
          profitAmount: z
            .number({
              required_error: 'Profit Amount is required',
              invalid_type_error: 'Profit Amount must be a number',
              coerce: true,
            })
            .default(0),
          profitPercentage: z
            .number({
              required_error: 'Profit Percentage is required',
              invalid_type_error: 'Profit Percentage must be a number',
              coerce: true,
            })
            .default(0),

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
            .default(true),
          isBulkCost: z
            .boolean({
              required_error: 'Is Bulk Cost is required',
            })
            .default(false),
          soldBy: z.nativeEnum(ProductSoldBy).default(ProductSoldBy.Pieces),

          allowBackOrder: z
            .boolean({
              invalid_type_error: 'Allow back order must be a boolean',
            })
            .default(false),

          batches: z
            .array(batchSchema)
            .min(1, 'At least one batch is required'),

          activeBatch: batchSchema.optional(),
        }),
      }),
    )
    .min(1, 'Materials must have at least 1 item'),
})

const productSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  forSale: z.boolean({
    required_error: 'For Sale is required',
  }),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
      coerce: true,
    })
    .default(0),
  profitAmount: z
    .number({
      required_error: 'Profit Amount is required',
      invalid_type_error: 'Profit Amount must be a number',
      coerce: true,
    })
    .default(0),
  profitPercentage: z
    .number({
      required_error: 'Profit Percentage is required',
      invalid_type_error: 'Profit Percentage must be a number',
      coerce: true,
    })
    .default(0),

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
    .default(true),
  isBulkCost: z
    .boolean({
      required_error: 'Is Bulk Cost is required',
    })
    .default(false),
  soldBy: z.nativeEnum(ProductSoldBy).default(ProductSoldBy.Pieces),

  allowBackOrder: z
    .boolean({
      invalid_type_error: 'Allow back order must be a boolean',
    })
    .default(false),

  batches: z.array(batchSchema).min(1, 'At least one batch is required'),

  recipeSchema: z
    .object({
      id: z.string({ required_error: 'Recipe id is required' }),
    })
    .strip()
    .optional(),
})

export default useCreateProduct
