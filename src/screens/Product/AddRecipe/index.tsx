import RecipeDetails from '../RecipeDetails'
import { RecipeDetailContextProvider } from '../contexts/RecipeDetailContext'

const AddRecipe = () => {
  return (
    <>
      <RecipeDetailContextProvider>
        <RecipeDetails />
      </RecipeDetailContextProvider>
    </>
  )
}

export default AddRecipe
