import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/product'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppPath } from 'routes/AppRoutes.types'

const useCloneProduct = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isLoading } = useMutation({
    mutationFn: API.cloneProduct,
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
      setError(error)
    },
    onSuccess: async (data) => {
      toast.success('Product successfully cloned! ', {
        autoClose: 2000,
        theme: 'colored',
      })
      await queryClient.invalidateQueries(['product', data.id])
      navigate(`${AppPath.Products}/${data.id}`)
    },
  })

  const cloneProduct = async (param: { id: string }) => {
    await mutateAsync(param)
  }

  return {
    cloneProduct,
    isCloning: isLoading,
    cloneProductError: error,
  }
}

export default useCloneProduct
