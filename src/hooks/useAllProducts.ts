import { useQuery } from '@tanstack/react-query'
import { getAllProducts } from 'api/product.api'
import { PaginationOptions } from 'types/api.types'
import { GetAllProductFilterSchema } from 'types/product.types'

const useAllProducts = (
  bussinessId?: string,
  param?: PaginationOptions & GetAllProductFilterSchema,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', bussinessId, param],
    queryFn: () => getAllProducts(param),
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
