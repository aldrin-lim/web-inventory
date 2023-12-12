import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const RecipeOverview = () => {
  const navigate = useNavigate()
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
      </div>
    </>
  )
}

export default RecipeOverview
