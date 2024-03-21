import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Expense, ExpensesCategories } from 'types/expense.types'
import { z } from 'zod'

const useCreateExpense = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isCreating } = useMutation({
    mutationFn: async (param: z.infer<typeof CreateExpenseSchema>) => {
      const result = await axios
        .post<unknown, AxiosResponse<NonNullable<Expense>>>('/expenses', param)
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
      toast.success('Expense successfully created! ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  return {
    createExpense: mutateAsync,
    isCreating,
    createRecipeError: error,
  }
}

const CreateExpenseSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  category: z.nativeEnum(ExpensesCategories, {
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive(),
  isRecurring: z
    .boolean({
      invalid_type_error: 'isRecurring must be a boolean',
    })
    .optional(),
})

export default useCreateExpense
