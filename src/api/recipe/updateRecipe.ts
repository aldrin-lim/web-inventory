import { AxiosResponse } from 'axios'
import { RecipeSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (param: {
  id: string
  recipe: z.infer<typeof UpdateRecipeSchema>
}) => {
  const { id, recipe } = param
  const url = `/recipes/${id}`

  const result = await httpClient
    .patch<
      z.infer<typeof UpdateRecipeSchema>,
      AxiosResponse<z.infer<typeof RecipeSchema>>
    >(url, recipe)
    .then((res) => res.data)
  return result || []
}

// Schema and Types
export const UpdateRecipeSchema = RecipeSchema.omit({
  id: true,
})

export type UpdateRecipeRequestSchema = z.infer<typeof UpdateRecipeSchema>
