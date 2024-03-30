import { useQuery } from '@tanstack/react-query'
import * as API from 'api/product'

const useAllProducts = (enabled: boolean = true) => {
  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => API.getAllProducts(),
    retry: 0,
    refetchOnWindowFocus: false,
    enabled,
  })

  return {
    products: data || [],
    error,
    isLoading,
  }
}

export default useAllProducts
