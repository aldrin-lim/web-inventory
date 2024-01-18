import SlidingTransition from 'components/SlidingTransition'
import ProductSelectionList from './ProductSelectionList'
import { useState } from 'react'
import { z } from 'zod'
import { Material, Recipe, RecipeSchema } from 'types/recipe.types'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PrimaryAction from '../ProductDetail/components/ProductDetailPrimaryAction'
import ProductImages from '../ProductDetail/components/ProductImages'
import CurrencyInput from 'react-currency-input-field'
import { useFormik } from 'formik'
import RecipeMaterialCard from './RecipeDetailsForm/components/RecipeMaterialCard'
import { getActiveBatch } from '../ProductDetail'
import { toNumber } from 'util/number'

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
  cost: null,
  images: [],
  price: null,
  profitAmount: null,
  profitPercentage: null,
  measurement: 'pieces',
  quantity: 0,
  materials: [],
} as z.infer<typeof RecipeDetailSchema>

const RecipeDetails = (props: RecipeDetailsProps) => {
  const { recipe } = props

  const mode = recipe ? 'edit' : 'add'

  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)
  const [cost, setCost] = useState(0)

  const { setFieldValue, errors, getFieldProps, values } = useFormik({
    initialValues: recipe || initialValue,
    onSubmit: async (values) => {
      // await createRecipe(values)
    },
    validationSchema: RecipeDetailSchema,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
  })

  const closeProductSelection = () => {
    setActiveScreen(ActiveScreen.None)
  }

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
        <ProductImages
          images={[]}
          onImagesChange={() => {
            //
          }}
        />
        <div className="flex flex-col gap-2">
          {/* Recipe Name */}
          <label className="form-control w-full ">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Recipe Name</span>
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
            <p>₱ 0.00</p>
          </div>

          {/* Price and Profit */}
          <div className="flex w-full flex-row gap-4">
            {/* Price Input */}
            <label className="form-control max-w-[40%]">
              <div className="form-control-label  ">
                <span className="label-text-alt text-gray-400">Price</span>
              </div>
              <CurrencyInput
                // onBlur={getFieldProps('price').onBlur}
                // name={getFieldProps('price').name}
                // value={priceDisplayValue ?? ''}
                type="text"
                tabIndex={2}
                className="input input-bordered w-full"
                prefix="₱"
                placeholder="₱0"
                decimalsLimit={9}
                onValueChange={(value) => {
                  // setFieldValue('price', value)
                  // const newPrice = toNumber(value)
                  // console.log('newPrice', toNumber(value))
                  // const cost = values.isBulkCost
                  //   ? toNumber(getActiveBatch(values.batches).costPerUnit)
                  //   : toNumber(values.cost)
                  // const newProfitAmount = computeProfitAmount(newPrice, cost)
                  // const newProfitPercentage = computeProfitPercentage(
                  //   newPrice,
                  //   cost,
                  // )
                  // setFieldValue('profitAmount', toNumber(newProfitAmount))
                  // setFieldValue(
                  //   'profitPercentage',
                  //   toNumber(newProfitPercentage),
                  // )
                }}
                allowNegativeValue={false}
              />
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {/* {errors.price}&nbsp; */}
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
                  // onBlur={getFieldProps('profitPercentage').onBlur}
                  // name={getFieldProps('profitPercentage').name}
                  // value={profitPercentageDisplayValue ?? ''}
                  type="text"
                  tabIndex={4}
                  className={[
                    'input w-[40px] border-none bg-transparent px-0 text-center focus:outline-none',
                  ].join(' ')}
                  decimalsLimit={9}
                  onValueChange={(value) => {
                    // setFieldValue('profitPercentage', value)
                    // const newProfitPercentage = toNumber(value)
                    // const cost = values.isBulkCost
                    //   ? toNumber(getActiveBatch(values.batches).costPerUnit)
                    //   : toNumber(values.cost)
                    // const newPrice = cost * (1 + newProfitPercentage / 100)
                    // const newProfitAmount = computeProfitAmount(newPrice, cost)
                    // setFieldValue('price', newPrice)
                    // setFieldValue('profitAmount', newProfitAmount)
                  }}
                  disableGroupSeparators
                  allowNegativeValue={false}
                  maxLength={6}
                />
                <p className="border-r-[1.5px] border-gray-300 px-2">%</p>
                <CurrencyInput
                  // onBlur={getFieldProps('profitAmount').onBlur}
                  // name={getFieldProps('profitAmount').name}
                  // value={profitAmountDisplayValue ?? ''}
                  type="text"
                  tabIndex={5}
                  className={`input w-full border-none bg-transparent px-0 pl-2 focus:outline-none`}
                  prefix="₱"
                  placeholder="₱0"
                  decimalsLimit={9}
                  onValueChange={(value) => {}}
                  allowNegativeValue={false}
                />
              </div>
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {/* {errors.profitAmount}&nbsp; */}
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

          {values.materials.length > 0 && (
            <div className="flex flex-row gap-2">
              {values.materials.map((material) => (
                <RecipeMaterialCard key={material.id} material={material} />
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
  cost: z
    .number({
      coerce: true,
      required_error: 'Price is required',
    })
    .nullable(),
  price: z
    .number({
      coerce: true,
      required_error: 'Price is required',
    })
    .nullable(),
})

export default RecipeDetails
