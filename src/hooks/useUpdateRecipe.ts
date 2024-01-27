import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/recipe'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import {
  UpdateRecipeRequestSchema,
  UpdateRecipeSchema,
} from 'api/recipe/updateRecipe'

const useUpdateRecipe = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationFn: API.updateRecipe,
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
    onSuccess: async (_, param) => {
      toast.success('Recipe successfully updated! ', {
        autoClose: 500,
        theme: 'colored',
      })
      await queryClient.invalidateQueries(['recipes'])
      await queryClient.invalidateQueries(['recipe', param.id])
    },
  })

  const updateRecipe = async (param: {
    id: string
    recipe: UpdateRecipeRequestSchema
  }) => {
    const validation = UpdateRecipeSchema.safeParse({
      id: param.id,
      ...param.recipe,
    })

    if (!validation.success) {
      const error = validation.error.issues[0].message
      console.log(error)
      return
    }

    const requestBody = validation.data
    await mutateAsync({ id: param.id, recipe: requestBody })
  }

  return {
    updateRecipe,
    isUpdating,
    updateRecipeError: error,
  }
}

export default useUpdateRecipe
