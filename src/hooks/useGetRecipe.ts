import { useQuery } from '@tanstack/react-query'
import * as API from 'api/recipe'

const useGetRecipe = (recipeId?: string, enabled: boolean = true) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => API.getRecipe(recipeId as string),
    retry: 0,
    enabled: Boolean(recipeId) && enabled,
    refetchOnWindowFocus: false,
  })

  return {
    recipe: data,
    error,
    isLoading,
  }
}

export default useGetRecipe
