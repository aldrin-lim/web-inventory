import { useMutation } from '@tanstack/react-query'
import * as API from 'api/recipe'
import axios from 'axios'
import { toast } from 'react-toastify'

const useDeleteRecipe = () => {
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
    onSuccess: () => {
      toast.success('Recipe successfully deleted ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  return {
    deleteRecipe,
    isDeleting,
    deleteRecipeError,
  }
}

export default useDeleteRecipe
