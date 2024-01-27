import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/product'
import { CreateProductBodySchema } from 'api/product/createProduct'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppPath } from 'routes/AppRoutes.types'

const useCreateProduct = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isCreating } = useMutation({
    mutationFn: API.createProduct,
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
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['products'])
      toast.success('Product successfully created! ', {
        autoClose: 500,
        theme: 'colored',
      })
      navigate(`${AppPath.Products}/${data.id}`)
    },
  })

  const createProduct = async (body: CreateProductBodySchema) => {
    await mutateAsync(body)
  }

  return {
    createProduct,
    isCreating,
    createProductError: error,
  }
}

export default useCreateProduct
