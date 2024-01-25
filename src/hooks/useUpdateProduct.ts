import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/product'
import { UpdateProductRequestScheam } from 'api/product/updateProduct'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationFn: API.updateProductById,
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
    onSuccess: (_, param) => {
      toast.success('Product successfully updated! ', {
        autoClose: 500,
        theme: 'colored',
      })
      queryClient.invalidateQueries(['product', param.id])
    },
  })

  const updateProduct = async (param: {
    id: string
    body: UpdateProductRequestScheam
  }) => {
    await mutateAsync({ id: param.id, product: param.body })
  }

  return {
    updateProduct,
    isUpdating,
    updateProductError: error,
  }
}

export default useUpdateProduct
