import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProductById } from 'api/product.api'
import axios from 'axios'
import { toast } from 'react-toastify'

const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  const {
    mutateAsync: updateProduct,
    isLoading: isUpdating,
    error: updateProductError,
  } = useMutation({
    mutationFn: updateProductById,
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
    onSuccess: (_, param) => {
      toast.success('Product successfully updated! ', {
        autoClose: 2000,
        theme: 'colored',
      })
      queryClient.invalidateQueries(['product', param.id])
    },
  })

  return {
    updateProduct,
    isUpdating,
    updateProductError,
  }
}

export default useUpdateProduct
