import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllRecipes from 'hooks/useAllRecipes'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import RecipeCard from './components/RecipeCard'
import GetStarted from './GetStarted'

const RecipeOverview = () => {
  const navigate = useNavigate()
  const { recipes, isLoading } = useAllRecipes()

  return (
    <div className="screen">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(AppPath.Root)}
          />,
          <ToolbarTitle key={2} title="Recipes" />,
          <ToolbarButton
            key={3}
            label="Add"
            onClick={() => navigate(AppPath.AddRecipe)}
          />,
        ]}
      />
      {isLoading && <Skeleton />}
      {!isLoading && recipes?.length === 0 && <GetStarted />}
      {!isLoading && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {recipes &&
            recipes.map((recipe) => (
              <RecipeCard
                onClick={() => navigate(`${AppPath.Recipe}/${recipe.id}`)}
                key={recipe.id}
                recipe={recipe}
              />
            ))}
        </div>
      )}
    </div>
  )
}

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center lg:block" />
        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center lg:block" />
      </div>
    </div>
  )
}

export default RecipeOverview
