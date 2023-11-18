import { useMutation } from '@tanstack/react-query'
import { createProduct } from 'api/product.api'

const useUser = () => {
  const {
    mutateAsync: createProductAsync,
    isLoading: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: createProduct,
    retry: 0,
  })

  return {
    createProduct: createProductAsync,
    isCreating,
    createError,
  }
}

export default useUser
