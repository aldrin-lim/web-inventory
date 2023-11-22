import { useMutation } from '@tanstack/react-query'
import { createProduct } from 'api/product.api'
import axios from 'axios'
import { toast } from 'react-toastify'

const useCreateProduct = () => {
  const {
    mutateAsync: createProductAsync,
    isLoading: isCreating,
    error: createProductError,
  } = useMutation({
    mutationFn: createProduct,
    retry: 0,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue. "
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response?.data?.message
        }
      }
      toast.error(errorMessage, {
        autoClose: 3000,
        theme: 'colored',
      })
    },
  })

  return {
    createProduct: createProductAsync,
    isCreating,
    createProductError,
  }
}

export default useCreateProduct
