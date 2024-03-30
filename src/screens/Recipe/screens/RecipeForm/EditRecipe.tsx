import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import RecipeForm, { RecipeFormRef } from '.'
import { RecipeFormValues } from './hooks/useRecipeForm'
import MaterialList from './MaterialList'
import useAllProducts from 'hooks/useAllProducts'
import useBoundStore from 'stores/useBoundStore'
import { MaterialType } from 'types/product.types'
import { toNumber } from 'lodash'
import Big from 'big.js'
import useCloneRecipe from 'hooks/useCloneRecipe'
import useDeleteRecipe from 'hooks/useDeleteRecipe'
import useUpdateRecipe from 'hooks/useUpdateRecipe'
import useGetRecipe from 'hooks/useGetRecipe'
import PrimaryAction from 'screens/Product/ProductDetail/components/ProductDetailPrimaryAction'

enum ScreenPath {
  SelectIngredients = 'select-ingredients',
  SelectOthers = 'select-others',
}

const EditRecipe = () => {
  const navigate = useNavigate()
  const recipeFormRef = useRef<RecipeFormRef>(null)

  const { id } = useParams<{ id: string }>()

  const { recipe, isLoading: isRecipeLoading } = useGetRecipe(id)
  const { products } = useAllProducts()

  const resolvedPath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvedPath.pathname

  const setRecipeInitialValue = useBoundStore(
    (state) => state.setRecipeInitialValue,
  )

  const setRecipeFormValue = useBoundStore((state) => state.setRecipeFormValue)

  const initialFormValue = useBoundStore(
    (state) => state.recipeFormInitialValue,
  )

  const { isUpdating, updateRecipe } = useUpdateRecipe()
  const { isDeleting, deleteRecipe } = useDeleteRecipe()
  const { isCloning, cloneRecipe } = useCloneRecipe()

  const isMutating = isDeleting || isUpdating || isCloning

  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (recipe && isRecipeLoading === false) {
      if (initialFormValue.id !== recipe.id) {
        const formValue = {
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          cost: recipe.cost,
          images: recipe.images,
          price: 0,
          profitAmount: 0,
          profitPercentage: 0,
          profit: 0,
          quantity: 0,
          materials: recipe.materials,
          ingredients: recipe.materials.filter(
            (material) => material.type === MaterialType.Ingredient,
          ),
          others: recipe.materials.filter(
            (material) => material.type === MaterialType.Other,
          ),
        } as RecipeFormValues
        setRecipeInitialValue(formValue)
        setRecipeFormValue(formValue)
      }
      setIsLoading(false)
    }
  }, [
    recipe,
    isRecipeLoading,
    setRecipeInitialValue,
    setRecipeFormValue,
    initialFormValue.id,
  ])

  const unselectedMaterials = products
    .filter((product) => !product.recipe)
    .filter(
      (product) =>
        ![...(recipe?.materials ?? [])].find(
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
      middle={<ToolbarTitle key="title" title="Edit Recipe" />}
      end={
        <PrimaryAction
          key="primaryAction"
          onDelete={async () => {
            if (recipe?.id) {
              await deleteRecipe({ id: recipe.id })
              navigate('../')
            }
          }}
          onSave={function (): void {
            recipeFormRef.current?.submit()
          }}
          onClone={async () => {
            if (recipe) {
              await cloneRecipe({ id: recipe.id })
            }
          }}
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
    await updateRecipe({ id: values.id, recipe: requestBody })
  }

  if (!id) {
    throw new Error('No recipe id found (EditRecipe)')
  }

  if (isLoading) {
    return (
      <div className="">
        {renderToolbar()}
        <Skeleton />
      </div>
    )
  }

  return (
    <>
      <div className={[isParentScreen ? 'screen' : 'hidden'].join(' ')}>
        {isMutating && (
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

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="skeleton h-[48px] rounded-md" />

      <div className="skeleton h-[40px] rounded-md" />

      <div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default EditRecipe
