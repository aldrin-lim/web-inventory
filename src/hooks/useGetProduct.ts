import { useQuery } from '@tanstack/react-query'
import { getProductById } from 'api/product.api'

const useGetProduct = (productId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId as string),
    retry: 0,
    enabled: Boolean(productId),
    refetchOnWindowFocus: false,
  })

  return {
    product: data,
    error,
    isLoading,
  }
}

export default useGetProduct
