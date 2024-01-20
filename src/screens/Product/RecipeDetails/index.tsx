import SlidingTransition from 'components/SlidingTransition'
import ProductSelectionList from './ProductSelectionList'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { Material, Recipe, RecipeSchema } from 'types/recipe.types'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PrimaryAction from '../ProductDetail/components/ProductDetailPrimaryAction'
import ProductImages from '../ProductDetail/components/ProductImages'
import { useFormik } from 'formik'
import RecipeMaterialCard from './RecipeDetailsForm/components/RecipeMaterialCard'
import { getActiveBatch } from '../ProductDetail'
import {
  computeProfitAmount,
  computeProfitPercentage,
  toNumber,
} from 'util/number'
import { AppPath } from 'routes/AppRoutes.types'
import { useNavigate } from 'react-router-dom'
import Big from 'big.js'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { toast } from 'react-toastify'

enum ActiveScreen {
  None = 'none',
  ProductGrid = 'ProductGrid',
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
  price: null,
  profitAmount: null,
  profitPercentage: null,
  profit: 0,
  measurement: 'pieces',
  quantity: 0,
  materials: [],
} as z.infer<typeof RecipeDetailSchema>

const RecipeDetails = (props: RecipeDetailsProps) => {
  const { recipe } = props

  const navigate = useNavigate()

  const mode = recipe ? 'edit' : 'add'

  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)

  const formikValues = recipe
    ? {
        ...recipe,
        profitAmount: computeProfitAmount(recipe.price, recipe.cost),
        profitPercentage: computeProfitPercentage(recipe.price, recipe.cost),
      }
    : initialValue

  const { setFieldValue, errors, getFieldProps, values } = useFormik({
    initialValues: formikValues,
    onSubmit: async () => {
      // await createRecipe(values)
    },
    validationSchema: toFormikValidationSchema(RecipeDetailSchema),
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
  })

  useEffect(() => {
    if (recipe?.price && recipe?.cost && recipe.price > 0 && recipe.cost > 0) {
      const profitAmount = computeProfitAmount(recipe.price, recipe.cost)
      const profitPercentage = computeProfitPercentage(
        recipe.price,
        recipe.cost,
      )
      setFieldValue('profitAmount', profitAmount)
      setFieldValue('profitPercentage', profitPercentage)
    }
  }, [recipe])

  const closeProductSelection = () => {
    setActiveScreen(ActiveScreen.None)
  }

  useEffect(() => {
    const totalCost = values.materials.reduce((acc, material) => {
      const total = new Big(material.cost).times(new Big(material.quantity))
      return new Big(acc).plus(total).toNumber()
    }, 0)
    setFieldValue('cost', totalCost)
  }, [values.materials])

  return (
    <div
      className={`RecipeDetail main-screen ${
        activeScreen === ActiveScreen.None ? 'h-full' : 'h-screen'
      }`}
    >
      <div className="sub-screen">
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
              onCreate={function (): void {}}
              onDelete={async () => {}}
              onSave={function (): void {}}
              onClone={async () => {}}
            />,
          ]}
        />

        <div className="fixed left-0 top-[48px] z-[10] !mt-0 flex flex-col gap-2 bg-base-100 pt-4">
          <div className="flex flex-col gap-2 bg-base-100 px-6 ">
            <ProductImages
              images={[]}
              onImagesChange={() => {
                //
              }}
            />
            {/* Recipe Name */}
            <label className="form-control w-full ">
              <div className="form-control-label  ">
                <span className="label-text-alt text-gray-400">
                  Recipe Name
                </span>
              </div>
              <input
                type="text"
                placeholder="(e.g., Cookies, Tea, etc.)"
                className="input input-bordered w-full"
                tabIndex={1}
              />
            </label>

            {/* Cost */}
            <div className="flex w-full flex-row justify-between rounded-md bg-primary p-2 text-right font-bold text-primary-content">
              <p>Cost</p>
              <p>₱ {values.cost}</p>
            </div>

            {/* Price and Profit */}
            <div className="flex w-full flex-row gap-2">
              {/* Price Input */}
              <label className="form-control max-w-[40%]">
                <div className="form-control-label  ">
                  <span className="label-text-alt text-gray-400">Price</span>
                </div>
                <input
                  // disabled={isMutating}
                  onBlur={getFieldProps('price').onBlur}
                  name={getFieldProps('price').name}
                  value={values.price ?? ''}
                  type="text"
                  tabIndex={2}
                  className="input input-bordered w-full"
                  placeholder="₱0"
                  inputMode="decimal"
                  onChange={({ target: { value } }) => {
                    const regex = /^-?(\d+)?(\.\d*)?$/
                    if (regex.test(value) || value === '') {
                      setFieldValue('price', value)
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
                  <input
                    // disabled={isMutating}
                    onBlur={getFieldProps('profitPercentage').onBlur}
                    name={getFieldProps('profitPercentage').name}
                    value={values.profitPercentage ?? ''}
                    type="text"
                    tabIndex={4}
                    inputMode="decimal"
                    className={[
                      'input w-[40px] border-none bg-transparent px-0 text-center focus:outline-none',
                    ].join(' ')}
                    onChange={({ target: { value } }) => {
                      const regex = /^-?(\d+)?(\.\d*)?$/
                      if (regex.test(value) || value === '') {
                        setFieldValue('profitPercentage', value)
                        const newProfitPercentage = toNumber(value)
                        const cost = values.cost
                        // const newPrice = cost * (1 + newProfitPercentage / 100)
                        const newPrice = new Big(cost)
                          .times(
                            new Big(1).plus(
                              new Big(newProfitPercentage).div(100),
                            ),
                          )
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
                  <input
                    // disabled={isMutating}
                    onBlur={getFieldProps('profitAmount').onBlur}
                    name={getFieldProps('profitAmount').name}
                    value={values.profitAmount ?? ''}
                    type="text"
                    tabIndex={5}
                    className={`input w-full border-none bg-transparent px-0 pl-2 focus:outline-none`}
                    placeholder="₱0"
                    inputMode="decimal"
                    onChange={({ target: { value } }) => {
                      const regex = /^-?(\d+)?(\.\d*)?$/
                      if (regex.test(value) || value === '') {
                        setFieldValue('profitAmount', value)
                        const newProfitAmount = toNumber(value)
                        const cost = values.cost

                        // const newPrice = cost + newProfitAmount
                        const newPrice = new Big(cost)
                          .plus(new Big(newProfitAmount))
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
                    {errors.profitAmount}&nbsp;
                  </span>
                </div>
              </div>
            </div>

            {/* Materials */}
            <div className="flex flex-row justify-between">
              <h1>Materials</h1>
              {values.materials.length > 0 && (
                <button
                  onClick={() => setActiveScreen(ActiveScreen.ProductGrid)}
                  className="btn btn-ghost btn-sm text-blue-400"
                >
                  <PlusIcon className="w-5 " />
                  Add
                </button>
              )}
            </div>

            {/* Materials Card */}
            {values.materials.length === 0 && (
              <button
                onClick={() => setActiveScreen(ActiveScreen.ProductGrid)}
                className="btn btn-square  mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300 "
              >
                <PlusIcon className="w-8 text-success" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-[450px]">
          {values.materials.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2">
              {values.materials.map((material, index) => (
                <RecipeMaterialCard
                  key={index}
                  material={material}
                  onChange={(updateMaterial) => {
                    setFieldValue(`materials.${index}`, updateMaterial)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <SlidingTransition
        direction="bottom"
        isVisible={activeScreen === ActiveScreen.ProductGrid}
        zIndex={10}
      >
        <ProductSelectionList
          onProductSelect={(product) => {
            const activeBatch = getActiveBatch(product.batches)
            const cost = product.isBulkCost
              ? toNumber(activeBatch.costPerUnit)
              : toNumber(activeBatch.cost)

            const productExists = values.materials.find(
              (material) => material.product.id === product.id,
            )

            if (!productExists) {
              setFieldValue('materials', [
                ...values.materials,
                {
                  quantity: 0,
                  cost,
                  unitOfMeasurement: getActiveBatch(product.batches)
                    .unitOfMeasurement,
                  product,
                } as Material,
              ])
            } else {
              toast.warn('Product is already in the recipe', {
                autoClose: 1000,
                theme: 'colored',
              })
            }
            setActiveScreen(ActiveScreen.None)
          }}
          onClose={closeProductSelection}
        />
      </SlidingTransition>
    </div>
  )
}

const RecipeDetailSchema = RecipeSchema.extend({
  profitPercentage: z.coerce
    .number({
      required_error: 'Profit % is required',
      invalid_type_error: 'Profit  % is required',
    })
    .nullable(),
  profitAmount: z.coerce
    .number({
      required_error: 'Profit is required',
      invalid_type_error: 'Profit is required',
    })
    .nullable(),
  cost: z.number({
    coerce: true,
    required_error: 'Price is required',
  }),
  price: z.coerce
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price is required',
    })
    .nullable(),
})

export default RecipeDetails
