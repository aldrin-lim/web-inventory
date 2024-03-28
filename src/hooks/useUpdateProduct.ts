import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { ProductSoldBy } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationFn: async (param: Param) => {
      const { id, ...rest } = param
      const result = await httpClient
        .patch<unknown, AxiosResponse<Param>>(`/products/${id}`, rest)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue. "
      console.log(error)
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
    onSuccess: async (_, param) => {
      await queryClient.invalidateQueries(['products'])
      await queryClient.invalidateQueries(['recipes'])
      await queryClient.refetchQueries(['recipe'])

      await queryClient.invalidateQueries(['product', param.id])
      toast.success('Product successfully updated! ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  const updateProduct = async (param: Param) => {
    await mutateAsync(param)
  }

  return {
    updateProduct,
    isUpdating,
    updateProductError: error,
  }
}

type Param = z.infer<typeof productSchema>

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

export default useUpdateProduct
