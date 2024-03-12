import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'
import RecipeDetails from '../RecipeDetails'
import { Outlet } from 'react-router-dom'

type AddRecipeProps = {
  onBack?: () => void
}

const AddRecipe = (props: AddRecipeProps) => {
  useEffect(() => {
    mixpanel.track_pageview({ page: 'Add Recipe' })
  }, [])

  return (
    <div>
      <RecipeDetails onBack={props.onBack} />
      <Outlet />
    </div>
  )
}

export default AddRecipe
