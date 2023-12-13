import { ChevronLeftIcon } from '@heroicons/react/24/solid'
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
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(AppPath.Products)}
            />,
            <ToolbarTitle key={2} title="Recipes" />,
            <ToolbarButton
              key={3}
              label="Add"
              onClick={() => navigate(AppPath.AddRecipe)}
            />,
          ]}
        />
      </div>
    </>
  )
}

export default RecipeOverview
