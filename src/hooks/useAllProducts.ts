import { useQuery } from '@tanstack/react-query'
import { getAllProducts } from 'api/product.api'

const useAllProducts = (bussinessId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', bussinessId],
    queryFn: getAllProducts,
    retry: 0,
    enabled: Boolean(bussinessId),
  })

  return {
    products: data || [],
    error,
    isLoading,
  }
}

export default useAllProducts
