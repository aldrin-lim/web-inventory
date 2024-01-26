import SlidingTransition from 'components/SlidingTransition'
import { useEffect } from 'react'
import { z } from 'zod'
import {
  Material,
  MaterialType,
  Recipe,
  RecipeSchema,
} from 'types/recipe.types'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PrimaryAction from '../../Product/ProductDetail/components/ProductDetailPrimaryAction'
import ProductImages from '../../Product/ProductDetail/components/ProductImages'
import RecipeMaterialCard from './RecipeDetailsForm/components/RecipeMaterialCard'
import { getActiveBatch } from '../../Product/ProductDetail'
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

enum ScreenPath {
  Ingredients = `select-ingredients`,
  Others = `select-others`,
}

type RecipeDetailsProps = {
  recipe?: Recipe
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
  measurement: 'pieces',
  quantity: 0,
  materials: [],
} as z.infer<typeof RecipeDetailSchema>

const RecipeDetails = (props: RecipeDetailsProps) => {
  const { recipe } = props

  const navigate = useNavigate()

  const { currentScreen, isParentScreen, navigateToParent } =
    useCustomRoute(ScreenPath)

  const mode = recipe ? 'edit' : 'add'

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

  const onRecipeMaterialRemove = (index: number) => {
    setFieldValue(
      'materials',
      values.materials.filter((_, i) => i !== index),
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
        <Toolbar
          items={[
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => {
                navigate(AppPath.RecipeOverview)
              }}
            />,
            <ToolbarTitle
              key="title"
              title={recipe ? 'View Recipe' : 'Add Recipe'}
            />,
            <PrimaryAction
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
          <div className="sticky top-[50px]  z-[10] flex flex-col gap-4 bg-base-100 py-2 pt-4">
            {/* Cost */}
            <div className="flex w-full flex-row justify-between rounded-md bg-primary p-2 text-right font-bold text-primary-content">
              <p>Cost</p>
              <p>₱ {values.cost}</p>
            </div>
            {errors && errors.cost && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.cost}
                </span>
              </div>
            )}

            {/* Price and Profit */}
            <div className="flex w-full flex-row gap-2">
              {/* Price Input */}
              <label className="form-control max-w-[40%]">
                <div className="form-control-label  ">
                  <span className="label-text-alt text-gray-400">Price</span>
                </div>
                <CurrencyInput
                  decimalsLimit={2}
                  prefix="₱"
                  disabled={isMutating}
                  onBlur={getFieldProps('price').onBlur}
                  name={getFieldProps('price').name}
                  value={values.price || ''}
                  type="text"
                  tabIndex={2}
                  className="input input-bordered w-full"
                  placeholder="₱0"
                  inputMode="decimal"
                  onValueChange={(value) => {
                    setFieldValue('price', value)
                    if (values.cost > 0) {
                      const newPrice = toNumber(value)
                      const cost = values.cost
                      const newProfitAmount = computeProfitAmount(
                        newPrice,
                        cost,
                      )
                      const newProfitPercentage = computeProfitPercentage(
                        newPrice,
                        cost,
                      )
                      setFieldValue('profitAmount', toNumber(newProfitAmount))
                      setFieldValue(
                        'profitPercentage',
                        toNumber(newProfitPercentage),
                      )
                    }
                  }}
                />
                <div className="label py-0">
                  <span className="label-text-alt text-xs text-red-400">
                    {errors.price}&nbsp;
                  </span>
                </div>
              </label>
              {/* Profit */}
              <div className="form-control">
                <div className="form-control input input-bordered relative flex flex-row items-center">
                  <div className="form-control-label  ">
                    <span className="label-text-alt text-gray-400">Profit</span>
                  </div>
                  <CurrencyInput
                    decimalsLimit={2}
                    disableGroupSeparators
                    disabled={isMutating}
                    onBlur={getFieldProps('profitPercentage').onBlur}
                    name={getFieldProps('profitPercentage').name}
                    value={values.profitPercentage || ''}
                    type="text"
                    tabIndex={4}
                    inputMode="decimal"
                    placeholder="70%"
                    className={[
                      'input w-[40px] border-none bg-transparent px-0 text-center focus:outline-none',
                    ].join(' ')}
                    onChange={({ target: { value } }) => {
                      setFieldValue('profitPercentage', value)
                      if (values.cost > 0) {
                        const newProfitPercentage = toNumber(value)
                        const cost = values.cost
                        const newPrice = new Big(cost)
                          .times(
                            new Big(1).plus(
                              new Big(newProfitPercentage).div(100),
                            ),
                          )
                          .round(2)
                          .toNumber()

                        const newProfitAmount = computeProfitAmount(
                          newPrice,
                          cost,
                        )
                        setFieldValue('price', newPrice)
                        setFieldValue('profitAmount', newProfitAmount)
                      }
                    }}
                  />
                  <p className="border-r-[1.5px] border-gray-300 px-2">%</p>
                  <CurrencyInput
                    decimalsLimit={2}
                    prefix="₱"
                    disabled={isMutating}
                    onBlur={getFieldProps('profitAmount').onBlur}
                    name={getFieldProps('profitAmount').name}
                    value={values.profitAmount || ''}
                    type="text"
                    tabIndex={5}
                    className={`input w-full border-none bg-transparent px-0 pl-2 focus:outline-none`}
                    placeholder="₱0"
                    inputMode="decimal"
                    onValueChange={(value) => {
                      setFieldValue('profitAmount', value)
                      if (values.cost > 0) {
                        const newProfitAmount = toNumber(value)
                        const cost = values.cost

                        // const newPrice = cost + newProfitAmount
                        const newPrice = new Big(cost)
                          .plus(new Big(newProfitAmount))
                          .round(2)
                          .toNumber()
                        const newProfitPercentage = computeProfitPercentage(
                          newPrice,
                          cost,
                        )

                        setFieldValue('price', newPrice)
                        setFieldValue('profitPercentage', newProfitPercentage)
                      }
                    }}
                  />
                </div>
                <div className="label py-0">
                  <span className="label-text-alt text-xs text-red-400">
                    {errors.profitAmount || errors.profitPercentage}&nbsp;
                  </span>
                </div>
              </div>
            </div>
          </div>

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

          {/* Ingredients */}
          <div className="flex flex-row justify-between">
            <h1>Materials</h1>
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
                      onRecipeMaterialRemove(index)
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
                      onRecipeMaterialRemove(index)
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
          products={products.filter(
            (product) =>
              !values.materials.find(
                (material) => material.product.id === product.id,
              ),
          )}
          onBack={() => navigateToParent()}
          onProductSelect={(product) => {
            const activeBatch = getActiveBatch(product.batches)
            const cost = product.isBulkCost
              ? toNumber(activeBatch.costPerUnit)
              : toNumber(activeBatch.cost)

            setFieldValue('materials', [
              ...values.materials,
              {
                id: v4(),
                quantity: 0,
                cost,
                unitOfMeasurement: getActiveBatch(product.batches)
                  .unitOfMeasurement,
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
          products={products.filter(
            (product) =>
              !values.materials.find(
                (material) => material.product.id === product.id,
              ),
          )}
          onBack={() => navigateToParent()}
          onProductSelect={(product) => {
            const activeBatch = getActiveBatch(product.batches)
            const cost = product.isBulkCost
              ? toNumber(activeBatch.costPerUnit)
              : toNumber(activeBatch.cost)

            setFieldValue('materials', [
              ...values.materials,
              {
                id: v4(),
                quantity: 0,
                cost,
                unitOfMeasurement: getActiveBatch(product.batches)
                  .unitOfMeasurement,
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
    .positive('Must be greater than 0'),
  profitAmount: z.coerce
    .number({
      required_error: 'Profit is required',
      invalid_type_error: 'Profit is required',
    })
    .positive('Must be greater than 0'),
  cost: z
    .number({
      coerce: true,
      required_error: 'Cost is required',
    })
    .positive('Must be greater than 0'),
  price: z.coerce
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price is must be number',
    })
    .positive('Must be greater than 0'),
})

export default RecipeDetails
