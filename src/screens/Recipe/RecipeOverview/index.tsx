import { Bars3Icon, ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllRecipes from 'hooks/useAllRecipes'
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import RecipeCard from './components/RecipeCard'
import GetStarted from './GetStarted'
import { useEffect } from 'react'
import { Analytics } from 'util/analytics'
import NewRecipe from '../screens/RecipeForm/NewRecipe'
import useBoundStore from 'stores/useBoundStore'
import EditRecipe from '../screens/RecipeForm/EditRecipe'

enum ScreenPath {
  New = 'new',
  Edit = ':id',
}

const RecipeOverview = () => {
  const navigate = useNavigate()
  const { recipes, isLoading } = useAllRecipes()

  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  useEffect(() => {
    Analytics.trackPageView('All Recipes')
  }, [])

  const reset = useBoundStore((state) => state.resetRecipeForm)
  useEffect(() => {
    if (isParentScreen) {
      reset()
    }
  }, [isParentScreen, reset])

  return (
    <>
      <div
        className={['screen', !isParentScreen ? 'hidden-screen' : ''].join(' ')}
      >
        <Toolbar
          start={
            <label
              htmlFor="my-drawer"
              className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
            >
              <Bars3Icon className="w-6" />
            </label>
          }
          middle={<ToolbarTitle title="Recipes" />}
          end={
            <ToolbarButton
              label="Add"
              onClick={() => navigate(ScreenPath.New)}
            />
          }
        />
        {isLoading && <Skeleton />}
        {!isLoading && recipes?.length === 0 && <GetStarted />}
        {!isLoading && (
          <div className={[isParentScreen ? 'screen' : 'hidden'].join(' ')}>
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
          </div>
        )}
      </div>
      <Routes>
        <Route path={`${ScreenPath.New}/*`} element={<NewRecipe />} />
        <Route path={`:id/*`} element={<EditRecipe />} />
      </Routes>
    </>
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
