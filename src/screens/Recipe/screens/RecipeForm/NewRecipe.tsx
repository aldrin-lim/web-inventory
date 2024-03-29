import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { Route, Routes, useNavigate, useResolvedPath } from 'react-router-dom'
import { useRef } from 'react'
import RecipeForm, { RecipeFormRef } from '.'
import { RecipeFormValues } from './hooks/useRecipeForm'
import { v4 } from 'uuid'
import useCreateRecipe from 'hooks/useCreateRecipe'
import MaterialList from './MaterialList'
import useAllProducts from 'hooks/useAllProducts'
import useBoundStore from 'stores/useBoundStore'
import { MaterialType } from 'types/product.types'
import { toNumber } from 'lodash'
import Big from 'big.js'

enum ScreenPath {
  SelectIngredients = 'select-ingredients',
  SelectOthers = 'select-others',
}

const NewRecipe = () => {
  const navigate = useNavigate()
  const recipeFormRef = useRef<RecipeFormRef>(null)

  const resolvedPath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvedPath.pathname

  const formValues = useBoundStore((state) => state.recipeFormValue)

  const { isCreating, createRecipe } = useCreateRecipe()

  const { products, isLoading } = useAllProducts()
  const unselectedMaterials = products
    .filter((product) => !product.recipe)
    .filter(
      (product) =>
        ![...formValues.others, ...formValues.ingredients].find(
          (material) => material.product.id === product.id,
        ),
    )

  const renderToolbar = () => (
    <Toolbar
      start={
        <ToolbarButton
          icon={<ChevronLeftIcon className="w-6" />}
          onClick={() => {
            navigate('../')
          }}
        />
      }
      middle={<ToolbarTitle key="title" title="New Recipe" />}
      end={
        <ToolbarButton
          onClick={async () => {
            recipeFormRef.current?.submit()
          }}
          label="Save"
        />
      }
    />
  )

  const onSubmit = async (values: RecipeFormValues) => {
    const materials = [...values.ingredients, ...values.others].map(
      (material) => ({
        ...material,
        quantity: toNumber(material.quantity),
      }),
    )

    const totalCost = materials.reduce((acc, material) => {
      return new Big(acc).plus(new Big(material.cost)).toNumber()
    }, 0)

    const requestBody = {
      id: v4(),
      name: values.name,
      description: '',
      cost: totalCost,
      images: values.images,
      price: 0,
      profitAmount: 0,
      profitPercentage: 0,
      profit: 0,
      quantity: 0,
      materials,
    }
    await createRecipe(requestBody)
    navigate('../')
  }

  return (
    <>
      <div className={[isParentScreen ? 'screen' : 'hidden'].join(' ')}>
        {isCreating && (
          <div className="loading-cover fixed z-50 flex h-screen w-screen flex-col items-center justify-center bg-white opacity-70">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}
        {renderToolbar()}
        <RecipeForm onSubmit={onSubmit} ref={recipeFormRef} />
      </div>
      <Routes>
        <Route
          path={`${ScreenPath.SelectIngredients}/*`}
          element={
            <MaterialList
              type={MaterialType.Ingredient}
              isLoading={isLoading}
              products={unselectedMaterials}
            />
          }
        />
        <Route
          path={`${ScreenPath.SelectOthers}/*`}
          element={
            <MaterialList
              type={MaterialType.Other}
              isLoading={isLoading}
              products={unselectedMaterials}
            />
          }
        />
      </Routes>
    </>
  )
}

export default NewRecipe
