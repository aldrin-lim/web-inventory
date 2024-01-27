import { useQuery } from '@tanstack/react-query'
import { PaginationOptions } from 'types/api.types'
import * as API from 'api/recipe'

const useAllRecipes = (param?: PaginationOptions) => {
  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: ['recipes', param],
    queryFn: () => API.getAllRecipe(param),
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })

  return {
    recipes: data,
    error,
    isLoading,
  }
}

export default useAllRecipes
