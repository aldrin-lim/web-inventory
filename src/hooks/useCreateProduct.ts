import { useMutation } from '@tanstack/react-query'
import { createProduct } from 'api/product.api'
import { toast } from 'react-toastify'

const useCreateProduct = () => {
  const {
    mutateAsync: createProductAsync,
    isLoading: isCreating,
    error: createProductError,
  } = useMutation({
    mutationFn: createProduct,
    retry: 0,
    onError: () => {
      toast.error("We're sorry, we've encountered an issue. ", {
        autoClose: 50000,
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
