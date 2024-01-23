import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllRecipes from 'hooks/useAllRecipes'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import RecipeCard from './components/RecipeCard'

const RecipeOverview = () => {
  const navigate = useNavigate()
  const { recipes } = useAllRecipes()

  return (
    <>
      <div className="main-screen">
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
        <div className="container-card flex flex-row flex-wrap justify-center gap-4 pb-16">
          {recipes &&
            recipes.map((recipe) => (
              <RecipeCard
                onClick={() => navigate(`${AppPath.Recipe}/${recipe.id}`)}
                key={recipe.id}
                recipe={recipe}
              />
            ))}
        </div>
      </div>
    </>
  )
}

export default RecipeOverview
