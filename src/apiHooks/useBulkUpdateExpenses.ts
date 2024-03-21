import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { OperationsSchema } from 'screens/Expense/hook/useExpenses'
import { httpClient } from 'util/http'
import { z } from 'zod'

const useBulkUpdateExpenses = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationFn: async (operations: z.infer<typeof OperationsSchema>) => {
      return await httpClient
        .patch<unknown, AxiosResponse<void>>('/expenses', operations)
        .then((res) => res.data)
    },
    retry: 0,
    onError: (error: unknown) => {
      let errorMessage = "We're sorry, there was an issue with the update."
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage
      }
      toast.error(errorMessage, {
        autoClose: 500,
        theme: 'colored',
      })
      setError(error)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['expenses'])
      await queryClient.refetchQueries(['expenses'])
      toast.success('Expenses successfully updated!', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  return {
    bulkUpdateExpenses: mutateAsync,
    isUpdating,
    updateError: error,
  }
}

export default useBulkUpdateExpenses
