import { ChevronLeftIcon } from '@heroicons/react/24/solid'
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
import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'
import SlidingTransition from 'components/SlidingTransition'
import AddRecipe from '../AddRecipe'
import { AnimatePresence } from 'framer-motion'

enum ScreenPath {
  AddRecipe = 'add-recipe',
  ViewRecipe = ':id',
}

const RecipeOverview = () => {
  const navigate = useNavigate()
  const { recipes, isLoading } = useAllRecipes()

  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  useEffect(() => {
    mixpanel.track_pageview({ page: 'All Recipes' })
  }, [])

  return (
    <>
      <div
        className={['screen', !isParentScreen ? 'hidden-screen' : ''].join(' ')}
      >
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
              onClick={() => navigate(ScreenPath.AddRecipe)}
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
      <AnimatePresence>
        <Routes>
          <Route
            path={`${ScreenPath.AddRecipe}/*`}
            element={
              <SlidingTransition isVisible>
                <AddRecipe onBack={() => navigate(resolvePath)} />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
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
