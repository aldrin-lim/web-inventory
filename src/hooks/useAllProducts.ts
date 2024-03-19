import { useQuery } from '@tanstack/react-query'
import * as API from 'api/product'

const useAllProducts = () => {
  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => API.getAllProducts(),
    retry: 0,
    refetchOnWindowFocus: true,
  })

  return {
    products: data || [],
    error,
    isLoading,
  }
}

export default useAllProducts
