import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'
import RecipeDetails from '../RecipeDetails'

const AddRecipe = () => {
  useEffect(() => {
    mixpanel.track_pageview({ page: 'Add Recipe' })
  }, [])
  return <RecipeDetails />
}

export default AddRecipe
