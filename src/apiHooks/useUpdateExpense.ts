import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Expense, ExpensesCategories } from 'types/expense.types'
import { z } from 'zod'

const useUpdateExpense = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isCreating } = useMutation({
    mutationFn: async (param: z.infer<typeof UpdateExpenseSchema>) => {
      const { id, ...rest } = param
      const result = await axios
        .patch<unknown, AxiosResponse<NonNullable<Expense>>>(
          `/expenses/${id}`,
          rest,
        )
        .then((res) => res.data)
      return result
    },
    retry: 0,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue."
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
      await queryClient.invalidateQueries(['expenses'])
      toast.success('Expense successfully updated! ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  return {
    updateExpense: mutateAsync,
    isCreating,
    createRecipeError: error,
  }
}

const UpdateExpenseSchema = z.object({
  id: z.string({
    required_error: 'Id is required',
    invalid_type_error: 'Id must be a string',
  }),
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .optional(),
  category: z
    .nativeEnum(ExpensesCategories, {
      required_error: 'Category is required',
      invalid_type_error: 'Category must be a string',
    })
    .optional(),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive()
    .optional(),
  isRecurring: z
    .boolean({
      invalid_type_error: 'isRecurring must be a boolean',
    })
    .optional(),
})

export default useUpdateExpense
