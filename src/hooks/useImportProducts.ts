import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

const useImportProducts = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isImporting } = useMutation({
    mutationFn: async (param: ImportProductSchema) => {
      const result = await httpClient
        .post<
          ImportProductSchema,
          AxiosResponse<z.infer<typeof ProductSchema>>
        >(`/products/import`, param)
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
        autoClose: 2000,
        theme: 'colored',
      })
      setError(error)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['products'])
      toast.success('Product successfully imported! ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  const importProducts = async (body: ImportProductSchema) => {
    await mutateAsync(body)
  }

  return {
    importProducts,
    isImporting,
    createProductError: error,
  }
}

type ImportProductSchema = z.infer<typeof validationSchema>

const validationSchema = z.object({
  products: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string({
        required_error: 'Name is required',
      }),
      description: z.string().optional(),
      cost: z.number({
        coerce: true,
        required_error: 'Cost is required',
      }),
      price: z.number({
        coerce: true,
        required_error: 'Price is required',
      }),
      category: z.string().optional(),
      allowBackOrder: z.enum(['Y', 'N'], {
        required_error: 'Allow back order is required',
        invalid_type_error: 'Allow back order must be Y or N',
      }),
      unitOfMeasurement: z.string({
        required_error: 'Unit of measurement is required',
      }),
      costPerUnit: z
        .number({
          coerce: true,
        })
        .optional(),
      quantity: z.number({
        coerce: true,
        required_error: 'Quantity is required',
      }),
      expiration: z
        .date({
          coerce: true,
          invalid_type_error: 'Expiration must be a date',
        })
        .optional(),
    }),
  ),
})

export default useImportProducts
