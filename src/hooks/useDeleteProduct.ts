import { useMutation } from '@tanstack/react-query'
import { deleteProductById } from 'api/product.api'
import axios from 'axios'
import { toast } from 'react-toastify'

const useDeleteProduct = () => {
  const {
    mutateAsync: deleteProduct,
    isLoading: isDeleting,
    error: deleteProductError,
  } = useMutation({
    mutationFn: deleteProductById,
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
    deleteProduct,
    isDeleting,
    deleteProductError,
  }
}

export default useDeleteProduct
