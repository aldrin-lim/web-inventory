import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/recipe'
import axios from 'axios'
import { toast } from 'react-toastify'

const useDeleteRecipe = () => {
  const queryClient = useQueryClient()

  const {
    mutateAsync: deleteRecipe,
    isLoading: isDeleting,
    error: deleteRecipeError,
  } = useMutation({
    mutationFn: API.deleteRecipe,
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
    },
    onSuccess: async () => {
      toast.success('Recipe successfully deleted ', {
        autoClose: 500,
        theme: 'colored',
      })
      await queryClient.invalidateQueries(['recipes'])
    },
  })

  return {
    deleteRecipe,
    isDeleting,
    deleteRecipeError,
  }
}

export default useDeleteRecipe
