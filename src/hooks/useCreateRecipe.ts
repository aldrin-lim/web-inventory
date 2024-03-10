import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/recipe'
import {
  CreateRecipeRequestSchema,
  CreateRecipeSchema,
} from 'api/recipe/createRecipe'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

const useCreateRecipe = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isCreating } = useMutation({
    mutationFn: API.createRecipe,
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
      await queryClient.invalidateQueries(['recipes'])
      toast.success('Recipe successfully created! ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  const createRecipe = async (param: CreateRecipeRequestSchema) => {
    const validation = CreateRecipeSchema.safeParse(param)

    if (!validation.success) {
      const error = validation.error.issues[0].message
      setError(error)
      return
    }

    const requestBody = validation.data

    await mutateAsync(requestBody)
  }

  return {
    createRecipe,
    isCreating,
    createRecipeError: error,
  }
}

export default useCreateRecipe
