import SlidingTransition from 'components/SlidingTransition'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PrimaryAction from '../../Product/ProductDetail/components/ProductDetailPrimaryAction'
import ProductImages from '../../Product/ProductDetail/components/ProductImages'
import RecipeMaterialCard from './components/RecipeMaterialCard'
import {
  computeProfitAmount,
  computeProfitPercentage,
  toNumber,
} from 'util/number'
import { AppPath } from 'routes/AppRoutes.types'
import { useNavigate } from 'react-router-dom'
import Big from 'big.js'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import useCreateRecipe from 'hooks/useCreateRecipe'
import { useFormik } from 'formik'
import useUpdateRecipe from 'hooks/useUpdateRecipe'
import CurrencyInput from 'react-currency-input-field'
import useDeleteRecipe from 'hooks/useDeleteRecipe'
import useCloneRecipe from 'hooks/useCloneRecipe'
import { useCustomRoute } from 'util/route'
import Inventory from 'screens/Inventory'
import useAllProducts from 'hooks/useAllProducts'
import { v4 } from 'uuid'
import { getActiveBatch } from 'util/products'
import { MaterialSchema, MaterialType, RecipeSchema } from 'types/product.types'

type Material = z.infer<typeof MaterialSchema>

enum ScreenPath {
  Ingredients = `select-ingredients`,
  Others = `select-others`,
}

type RecipeDetailsProps = {
  recipe?: z.infer<typeof RecipeSchema>
}

const initialValue = {
  id: '',
  name: '',
  description: '',
  cost: 0,
  images: [],
  price: 0,
  profitAmount: 0,
  profitPercentage: 0,
  profit: 0,
  quantity: 0,
  materials: [],
} as z.infer<typeof RecipeDetailSchema>

const RecipeDetails = (props: RecipeDetailsProps) => {
  const { recipe } = props

  const navigate = useNavigate()

  const { currentScreen, isParentScreen, navigateToParent } =
    useCustomRoute(ScreenPath)

  const mode = recipe ? 'edit' : 'add'

  const [backorderError, setBackorderError] = useState('')

  const { products, isLoading: isProductsLoading } = useAllProducts()
  const { isCreating, createRecipe } = useCreateRecipe()
  const { isUpdating, updateRecipe } = useUpdateRecipe()
  const { isDeleting, deleteRecipe } = useDeleteRecipe()
  const { isCloning, cloneRecipe } = useCloneRecipe()

  const isMutating = isCreating || isUpdating || isDeleting || isCloning

  const formikValues = recipe ? recipe : initialValue

  const { setFieldValue, errors, getFieldProps, values, submitForm } =
    useFormik({
      initialValues: formikValues,
      onSubmit: async (formValue) => {
        // Check if materials are allowed backorder
        // If one of the matarial has backorder allowed, all materials must be allowed backorder

        if (mode === 'add') {
          await createRecipe(formValue)
          navigate(AppPath.RecipeOverview)
        } else {
          await updateRecipe({
            id: formValue.id as string,
            recipe: formValue,
          })
        }
      },
      validationSchema: toFormikValidationSchema(RecipeDetailSchema),
      enableReinitialize: true,
      validateOnBlur: false,
      validateOnChange: false,
    })

  useEffect(() => {
    if (mode === 'add') {
      if (
        recipe?.price &&
        recipe?.cost &&
        recipe.price > 0 &&
        recipe.cost > 0
      ) {
        const profitAmount = computeProfitAmount(recipe.price, recipe.cost)
        const profitPercentage = computeProfitPercentage(
          recipe.price,
          recipe.cost,
        )
        setFieldValue('profitAmount', profitAmount)
        setFieldValue('profitPercentage', profitPercentage)
      }
    }
  }, [recipe])

  useEffect(() => {
    const totalCost = values.materials.reduce((acc, material) => {
      const total = new Big(material.cost).times(new Big(material.quantity))
      return new Big(acc).plus(total).toNumber()
    }, 0)
    if (values?.price && totalCost && values.price > 0 && totalCost > 0) {
      const profitAmount = computeProfitAmount(values.price, totalCost)
      const profitPercentage = computeProfitPercentage(values.price, totalCost)
      setFieldValue('profitAmount', profitAmount)
      setFieldValue('profitPercentage', profitPercentage)
    }
    setFieldValue('cost', totalCost)
  }, [values.materials])

  const onRecipeMaterialRemove = (materialId: string) => {
    setFieldValue(
      'materials',
      values.materials.filter((material) => material.id !== materialId),
    )
  }

  const ingredients = values.materials.filter(
    (material) => material.type === MaterialType.Ingredient,
  )

  const others = values.materials.filter(
    (material) => material.type === MaterialType.Other,
  )

  return (
    <>
      <div
        className={['screen pb-9', !isParentScreen ? 'hidden-screen' : ''].join(
          ' ',
        )}
      >
        {isMutating && (
          <div className="fixed z-50 flex h-screen w-screen flex-col items-center justify-center bg-white opacity-70">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}
        <Toolbar
          items={[
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              disabled={isMutating}
              onClick={() => {
                navigate(AppPath.RecipeOverview)
              }}
            />,
            <ToolbarTitle
              key="title"
              title={recipe ? 'View Recipe' : 'Add Recipe'}
            />,
            <PrimaryAction
              disabled={isMutating}
              key="primaryAction"
              mode={mode}
              onCreate={() => {
                submitForm()
              }}
              onDelete={async () => {
                if (recipe && recipe.id) {
                  await deleteRecipe({
                    id: recipe.id,
                  })
                  navigate(AppPath.RecipeOverview)
                }
              }}
              onSave={() => {
                submitForm()
              }}
              onClone={async () => {
                if (recipe && recipe.id) {
                  const newRecipe = await cloneRecipe({
                    id: recipe.id,
                  })
                  navigate(`${AppPath.Recipe}/${newRecipe.id}`)
                }
              }}
            />,
          ]}
        />

        <div className="flex flex-col gap-2">
          <div className="mb-4">
            <ProductImages
              disabled={isMutating}
              size="sm"
              images={values.images ?? []}
              onImagesChange={(images) => {
                setFieldValue('images', images)
              }}
            />
          </div>
          {/* Recipe Name */}
          <label className="form-control w-full ">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Recipe Name</span>
            </div>
            <input
              {...getFieldProps('name')}
              disabled={isMutating}
              type="text"
              placeholder="(e.g., Cookies, Tea, etc.)"
              className="input input-bordered w-full"
              tabIndex={1}
            />
            {errors && errors.name && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.name}
                </span>
              </div>
            )}
          </label>

          {/* Cost and Profit */}
          <div className="sticky top-[50px] z-[1] flex flex-col gap-4 bg-base-100 py-2 pt-4">
            {/* Cost */}
            {values.materials.length > 0 && (
              <div className="flex w-full flex-row justify-between rounded-md bg-primary p-2 text-right font-bold text-primary-content">
                <p>Cost</p>
                <p>₱ {new Big(values.cost ?? 0).toNumber()}</p>
              </div>
            )}
            {errors && errors.cost && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.cost}
                </span>
              </div>
            )}

            {errors &&
              values.materials.length === 0 &&
              errors.materials &&
              typeof errors.materials === 'string' && (
                <div className="label py-0">
                  <span className="label-text-alt text-xs text-red-400">
                    {errors.materials}
                  </span>
                </div>
              )}

            {backorderError && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {backorderError}
                </span>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className="flex flex-row justify-between">
            <h1>Ingredients/Materials</h1>
            {ingredients.length > 0 && (
              <button
                onClick={() => navigate(ScreenPath.Ingredients)}
                className="btn btn-ghost btn-sm text-blue-400"
              >
                <PlusIcon className="w-5 " />
                Add
              </button>
            )}
          </div>

          {ingredients.length === 0 && (
            <button
              onClick={() => navigate(ScreenPath.Ingredients)}
              className="btn btn-square  mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300 "
            >
              <PlusIcon className="w-8 text-success" />
            </button>
          )}

          {/* Ingredients Card */}
          <div className="mt-[0]">
            {ingredients.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {ingredients.map((material, index) => (
                  <RecipeMaterialCard
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    errors={errors.materials as any}
                    key={index}
                    material={material}
                    onRemove={() => {
                      onRecipeMaterialRemove(material.id as string)
                    }}
                    onChange={(param) => {
                      const materialIndex = values.materials.findIndex(
                        (m) => m.id === material.id,
                      )
                      const newMaterial = {
                        ...param,
                        quantity: toNumber(param.quantity),
                      }

                      setFieldValue(`materials.${materialIndex}`, newMaterial)
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Others */}
          <div className="flex flex-row justify-between">
            <h1>Others</h1>
            {others.length > 0 && (
              <button
                onClick={() => navigate(ScreenPath.Others)}
                className="btn btn-ghost btn-sm text-blue-400"
              >
                <PlusIcon className="w-5 " />
                Add
              </button>
            )}
          </div>

          {others.length === 0 && (
            <button
              onClick={() => navigate(ScreenPath.Others)}
              className="btn btn-square  mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300 "
            >
              <PlusIcon className="w-8 text-success" />
            </button>
          )}

          {/* Others Card */}
          <div className="mt-[0]">
            {others.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {others.map((material, index) => (
                  <RecipeMaterialCard
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    errors={errors.materials as any}
                    key={index}
                    material={material}
                    onRemove={() => {
                      onRecipeMaterialRemove(material.id as string)
                    }}
                    onChange={(param) => {
                      const materialIndex = values.materials.findIndex(
                        (m) => m.id === material.id,
                      )
                      const newMaterial = {
                        ...param,
                        quantity: toNumber(param.quantity),
                      }

                      setFieldValue(`materials.${materialIndex}`, newMaterial)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Ingredients Screens */}
      <SlidingTransition
        direction="bottom"
        isVisible={currentScreen === ScreenPath.Ingredients}
        zIndex={10}
      >
        <Inventory
          isLoading={isProductsLoading}
          products={products
            .filter((product) => !product.recipe)
            .filter(
              (product) =>
                !values.materials.find(
                  (material) => material.product.id === product.id,
                ),
            )}
          onBack={() => navigateToParent()}
          onProductSelect={(product) => {
            const activeBatch = getActiveBatch(product.batches)
            if (!activeBatch) {
              throw new Error('No active batch found')
            }
            const cost = product.isBulkCost
              ? toNumber(activeBatch.costPerUnit)
              : toNumber(activeBatch.cost)

            setFieldValue('materials', [
              ...values.materials,
              {
                id: v4(),
                quantity: 0,
                cost,
                unitOfMeasurement: activeBatch.unitOfMeasurement,
                product,
                type: MaterialType.Ingredient,
              } as Material,
            ])
            navigateToParent()
          }}
        />
      </SlidingTransition>

      {/* Others Screens */}
      <SlidingTransition
        direction="bottom"
        isVisible={currentScreen === ScreenPath.Others}
        zIndex={10}
      >
        <Inventory
          isLoading={isProductsLoading}
          products={products
            .filter((product) => !product.recipe)
            .filter(
              (product) =>
                !values.materials.find(
                  (material) => material.product.id === product.id,
                ),
            )}
          onBack={() => navigateToParent()}
          onProductSelect={(product) => {
            const activeBatch = getActiveBatch(product.batches)
            if (!activeBatch) {
              throw new Error('No active batch found')
            }
            const cost = product.isBulkCost
              ? toNumber(activeBatch.costPerUnit)
              : toNumber(activeBatch.cost)

            setFieldValue('materials', [
              ...values.materials,
              {
                id: v4(),
                quantity: 0,
                cost,
                unitOfMeasurement: activeBatch.unitOfMeasurement,
                product,
                type: MaterialType.Other,
              } as Material,
            ])
            navigateToParent()
          }}
        />
      </SlidingTransition>
    </>
  )
}

const RecipeDetailSchema = RecipeSchema.extend({
  id: z.string().optional(),
  profitPercentage: z.coerce
    .number({
      required_error: 'Profit % is required',
      invalid_type_error: 'Profit  % is required',
    })
    .optional()
    .default(0),
  profitAmount: z.coerce
    .number({
      required_error: 'Profit is required',
      invalid_type_error: 'Profit is required',
    })
    .optional()
    .default(0),
  cost: z
    .number({
      coerce: true,
      required_error: 'Cost is required',
    })
    .optional()
    .default(0),
  price: z.coerce
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price is must be number',
    })
    .optional()
    .default(0),
})

export default RecipeDetails
