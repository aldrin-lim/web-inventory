import { useEffect } from 'react'
import RecipeDetails from '../RecipeDetails'
import { Outlet } from 'react-router-dom'
import { Analytics } from 'util/analytics'

type AddRecipeProps = {
  onBack?: () => void
}

const AddRecipe = (props: AddRecipeProps) => {
  useEffect(() => {
    Analytics.trackPageView('Add Recipe')
  }, [])

  return (
    <div>
      <RecipeDetails onBack={props.onBack} />
      <Outlet />
    </div>
  )
}

export default AddRecipe
