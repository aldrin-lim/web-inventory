import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/recipe'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppPath } from 'routes/AppRoutes.types'

const useCloneRecipe = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isLoading } = useMutation({
    mutationFn: API.cloneRecipe,
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
    onSuccess: async (data) => {
      toast.success('Recipe successfully cloned! ', {
        autoClose: 500,
        theme: 'colored',
      })
      await queryClient.invalidateQueries(['recipe', data.id])
    },
  })

  const cloneRecipe = async (param: { id: string }) => {
    return await mutateAsync(param)
  }

  return {
    cloneRecipe,
    isCloning: isLoading,
    cloneRecipeError: error,
  }
}

export default useCloneRecipe
