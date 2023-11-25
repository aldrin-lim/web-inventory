import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct } from 'api/product.api'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppPath } from 'routes/AppRoutes.types'

const useCreateProduct = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
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
    onSuccess: async (data) => {
      toast.success('Product successfully created! ', {
        autoClose: 2000,
        theme: 'colored',
      })
      await queryClient.setQueryData(['product', data.id], data)
      navigate(`${AppPath.Products}/${data.id}`)
    },
  })

  return {
    createProduct: createProductAsync,
    isCreating,
    createProductError,
  }
}

export default useCreateProduct
