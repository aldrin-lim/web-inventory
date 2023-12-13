import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllRecipes from 'hooks/useAllRecipes'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { Recipe } from 'types/recipe.types'
import calculateMaterialCost from 'util/recipe/calculateMaterialCost'

const fakeRecipe: Recipe = {
  id: '9d015344-b15b-4bfe-b5a1-925540d5f47a',
  name: 'Cookie',
  description: 'A test recipe2',
  images: [],
  measurement: 'pieces',
  quantity: 0,
  cost: 0,
  materials: [
    {
      id: '',
      measurement: 'g',
      quantity: 500,
      cost: 0,
      product: {
        id: '74ca1b7b-5b57-4fbe-af4f-405992b4a3ba',
        name: 'Butter',
        description: '',
        cost: 100,
        price: 149,
        profit: 29,
        images: [],
        quantity: 2,
        measurement: 'kg',
        category: '',
        allowBackOrder: true,
        expiryDate: null,
      },
    },
    {
      id: '',
      measurement: 'g',
      quantity: 100,
      cost: 0,
      product: {
        id: '74ca1b7b-5b57-4fbe-af4f-405992b4a3ba',
        name: 'Dough',
        description: '',
        cost: 120,
        price: 149,
        profit: 29,
        images: [],
        quantity: 3.96832,
        measurement: 'lb',
        category: '',
        allowBackOrder: true,
        expiryDate: null,
      },
    },
  ],
}

const material = fakeRecipe.materials[0]
const maxQty = calculateMaterialCost(
  material.quantity,
  material.measurement,
  material.product.cost,
  material.product.measurement,
)

console.log('cost', maxQty)

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
