import RecipeDetails from '../RecipeDetails'
import { RecipeDetailContextProvider } from '../../Product/contexts/RecipeDetailContext'

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
