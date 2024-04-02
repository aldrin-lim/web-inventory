import { useQuery } from '@tanstack/react-query'
import * as API from 'api/product'

const useGetProduct = (productId?: string, enabled: boolean = true) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => API.getProductById(productId as string),
    retry: 0,
    enabled: Boolean(productId) && enabled,
    refetchOnWindowFocus: false,
  })

  return {
    product: data,
    error,
    isLoading,
  }
}

export default useGetProduct
