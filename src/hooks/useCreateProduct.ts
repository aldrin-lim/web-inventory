import { useMutation } from '@tanstack/react-query'
import { createProduct } from 'api/product.api'

const useCreateProduct = () => {
  const {
    mutateAsync: createProductAsync,
    isLoading: isCreating,
    error: createProductError,
  } = useMutation({
    mutationFn: createProduct,
    retry: 0,
  })

  return {
    createProduct: createProductAsync,
    isCreating,
    createProductError,
  }
}

export default useCreateProduct
