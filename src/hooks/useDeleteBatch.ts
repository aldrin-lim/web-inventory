import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { httpClient } from 'util/http'
import { z } from 'zod'

const useDeleteBatch = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown>('')
  const { mutateAsync, isLoading: isLoading } = useMutation({
    mutationFn: async (param: z.infer<typeof DeleteBatchSchema>) => {
      const url = `/products/${param.productId}/batches/${param.batchId}`

      const result = await httpClient
        .delete<unknown, AxiosResponse>(url)
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
      setError(errorMessage)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['products'])
      await queryClient.invalidateQueries(['product'])
      await queryClient.refetchQueries(['product'])
      toast.success('Product successfully cloned! ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  return {
    deleteBatch: mutateAsync,
    error,
    isLoading,
  }
}

export default useDeleteBatch

const DeleteBatchSchema = z.object({
  batchId: z.string({ required_error: 'Batch ID is required' }),
  productId: z.string({ required_error: 'Product ID is required' }),
})
