import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { httpClient } from 'util/http'
import { z } from 'zod'

const useAdjustBatch = (productId: string) => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown>('')
  const { mutateAsync, isLoading: isLoading } = useMutation({
    mutationFn: async (param: z.infer<typeof AdjustBatchSchema>) => {
      const url = `/products/adjust`

      const result = await httpClient
        .post<unknown, AxiosResponse>(url, param)
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
      await queryClient.invalidateQueries(['product'])
      await queryClient.refetchQueries(['product'])
      toast.success('Product successfully cloned! ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  return {
    adjustBatch: mutateAsync,
    error,
    isLoading,
  }
}

export default useAdjustBatch

const AdjustBatchSchema = z.object({
  batchId: z.string({ required_error: 'Batch ID is required' }),
  newBatch: z.object({
    cost: z.number({ required_error: 'Cost is required' }),
    quantity: z.number({ required_error: 'Quantity is required' }),
  }),
  reason: z.string({ required_error: 'Reason is required' }),
})
