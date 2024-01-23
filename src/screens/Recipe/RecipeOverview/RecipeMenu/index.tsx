import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

const RecipeMenu = () => {
  return (
    <div className="section min-h-screen">
      <Toolbar
        items={[
          <ToolbarButton key={1} label="Cancel" />,
          <ToolbarTitle key={2} title="Add Recipe" />,
          <ToolbarButton key={3} label="Add" />,
        ]}
      />
    </div>
  )
}

export default RecipeMenu
