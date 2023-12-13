import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllRecipes from 'hooks/useAllRecipes'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const RecipeOverview = () => {
  const navigate = useNavigate()
  const { recipes } = useAllRecipes()

  return (
    <>
      <div className="section absolute min-h-screen bg-base-100">
        <Toolbar
          items={[
            <ToolbarButton key={1} label="Cancel" />,
            <ToolbarTitle key={2} title="Recipes" />,
            <ToolbarButton
              key={3}
              label="Add"
              onClick={() => navigate(AppPath.AddRecipe)}
            />,
          ]}
        />
        <pre>{JSON.stringify(recipes, null, 2)}</pre>
      </div>
    </>
  )
}

export default RecipeOverview
