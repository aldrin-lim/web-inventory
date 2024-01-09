import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PrimaryAction from './components/ProductDetailPrimaryAction'
import ProductImages from './components/ProductImages'
import { z } from 'zod'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import CurrencyInput from 'react-currency-input-field'
import useCreateProduct from 'hooks/useCreateProduct'
import { AddProductSchema } from 'api/product/createProduct'
import SlidingTransition from 'components/SlidingTransition'
import Description from './screens/Description'
import StockDetail from './screens/StockDetail'

enum ActiveScreen {
  None = 'none',
  Description = 'description',
  StockDetail = 'stockDetail',
}

type ProductDetailProps = {
  product?: z.infer<typeof ProductDetailSchema>
}

export const ProductDetail = (props: ProductDetailProps) => {
  const { product } = props
  const navigate = useNavigate()

  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)

  const { createProduct, isCreating } = useCreateProduct()

  const isMutating = isCreating

  const { submitForm, errors, getFieldProps, setFieldValue, values } =
    useFormik({
      initialValues: {
        id: null,
        name: '',
        price: 0,
        cost: 0,
        images: [],
        profitAmount: 0,
        profitPercentage: 50,
        trackStock: false,
        description: '',
      } as z.infer<typeof ProductDetailSchema>,
      validationSchema: toFormikValidationSchema(ProductDetailSchema),
      enableReinitialize: true,
      onSubmit: async (value) => {
        const parsedValue = ProductDetailSchema.parse(value)

        if (!product) {
          if (parsedValue.trackStock === false) {
            const requestBody: z.infer<typeof AddProductSchema> = {
              cost: parsedValue.cost,
              name: parsedValue.name,
              price: parsedValue.price,
              profit: parsedValue.profitAmount,
              quantity: 0,
              measurement: 'pieces',
              batches: [
                {
                  cost: parsedValue.cost,
                  name: 'Batch 1',
                  quantity: 0,
                  unitOfMeasurement: 'pieces',
                  costPerUnit: 0,
                },
              ],
            }
            await createProduct(requestBody)
          }
        }
      },
      validateOnChange: false,
    })

  const showDescription = () => {
    setActiveScreen(ActiveScreen.Description)
  }

  const goBackToProductScreen = () => {
    setActiveScreen(ActiveScreen.None)
  }

  return (
    <div
      className={`ProductDetail main-screen ${
        activeScreen === ActiveScreen.None ? 'h-full' : 'h-screen'
      }`}
    >
      <div className="sub-screen">
        <Toolbar
          items={[
            <ToolbarButton
              key={2}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(AppPath.ProductOverview)}
              disabled={isMutating}
            />,
            <ToolbarTitle
              key="title"
              title={product ? 'View Product' : 'Add Product'}
            />,
            <PrimaryAction
              mode={product ? 'edit' : 'add'}
              key="primaryAction"
              disabled={isMutating}
              isLoading={isMutating}
              onCreate={function (): void {
                submitForm()
              }}
              onDelete={function (): void {
                throw new Error('Function not implemented.')
              }}
              onSave={function (): void {
                // submitForm()
              }}
              onClone={function (): void {
                throw new Error('Function not implemented.')
              }}
            />,
          ]}
        />
        <div className="flex flex-col items-start gap-2">
          {/* Product Name */}
          <label className="form-control w-full ">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Product Name</span>
            </div>
            <input
              {...getFieldProps('name')}
              type="text"
              placeholder="(e.g., Milk Tea, Coffee, etc.)"
              className="input input-bordered w-full"
              tabIndex={1}
              disabled={isMutating}
            />

            {errors.name && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.name}
                </span>
              </div>
            )}
          </label>

          {/* Recipe CTA */}
          <button
            disabled={isMutating}
            className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left"
          >
            Create product using a recipe
          </button>

          {/* Set Description CTA */}
          <button
            onClick={showDescription}
            disabled={isMutating}
            className="flex-start btn btn-ghost w-full flex-shrink-0 flex-row flex-nowrap justify-between px-0"
          >
            <p className="text-overflow-ellipsis overflow-hidden truncate whitespace-nowrap break-words text-left">
              <span className="text-gray-400">
                {values.description === '' && 'Add Description'}
                {values.description}
              </span>
            </p>
            <ChevronRightIcon className="w-5 flex-shrink-0 text-secondary" />
          </button>

          {/* Price Input */}
          <label className="form-control">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Price</span>
            </div>
            <CurrencyInput
              disabled={isMutating}
              onBlur={getFieldProps('price').onBlur}
              name={getFieldProps('price').name}
              value={getFieldProps('price').value}
              type="text"
              tabIndex={2}
              className="input input-bordered w-full"
              prefix="₱"
              onValueChange={(value) => {
                setFieldValue('price', value)
                if (value) {
                  const newProfitAmount = +value - Number(values.cost)
                  const newProfitPercentage =
                    (newProfitAmount / Number(values.cost)) * 100
                  setFieldValue('profitAmount', newProfitAmount)
                  setFieldValue(
                    'profitPercentage',
                    // If has decimal show 2 decimal places, else show 0
                    newProfitPercentage % 1
                      ? newProfitPercentage.toFixed(2)
                      : newProfitPercentage.toFixed(0),
                  )
                }
              }}
              allowNegativeValue={false}
            />
            <div className="label py-0">
              <span className="label-text-alt text-xs text-red-400">
                {errors.price}&nbsp;
              </span>
            </div>
          </label>

          {/* Cost and Profit */}
          <div className="flex w-full flex-row gap-2">
            {/* Cost */}
            <label className="form-control max-w-[40%]">
              <div className="form-control-label  ">
                <span className="label-text-alt text-gray-400">Cost</span>
              </div>
              <CurrencyInput
                disabled={isMutating}
                onBlur={getFieldProps('cost').onBlur}
                name={getFieldProps('cost').name}
                value={getFieldProps('cost').value}
                type="text"
                tabIndex={3}
                className="input input-bordered w-full"
                prefix="₱"
                onValueChange={(value) => {
                  setFieldValue('cost', value)
                  if (value) {
                    const newProfitAmount = Number(values.price) - +value
                    const newProfitPercentage = (newProfitAmount / +value) * 100
                    setFieldValue('profitAmount', newProfitAmount)
                    setFieldValue(
                      'profitPercentage',
                      // If has decimal show 2 decimal places, else show 0
                      newProfitPercentage % 1
                        ? newProfitPercentage.toFixed(2)
                        : newProfitPercentage.toFixed(0),
                    )
                  }
                }}
                allowNegativeValue={false}
              />
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.cost}&nbsp;
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
                  disabled={isMutating}
                  onBlur={getFieldProps('profitPercentage').onBlur}
                  name={getFieldProps('profitPercentage').name}
                  value={getFieldProps('profitPercentage').value}
                  type="text"
                  tabIndex={4}
                  className={`input w-[40px] border-none bg-transparent px-0 text-center focus:outline-none ${
                    values.profitPercentage < 0 ? 'text-red-500' : ''
                  }`}
                  onValueChange={(value) => {
                    setFieldValue('profitPercentage', value)
                    if (value) {
                      const newPrice =
                        Number(values.cost) * (1 + (+value || 0) / 100)
                      setFieldValue('price', newPrice.toFixed(2))
                      // Rount to 2 decimal places
                      setFieldValue(
                        'profitAmount',
                        (newPrice - Number(values.cost)).toFixed(2),
                      )
                    }
                  }}
                  disableGroupSeparators
                  allowNegativeValue={false}
                  maxLength={6}
                />
                <p className="border-r-[1.5px] border-gray-300 px-2">%</p>
                <CurrencyInput
                  disabled={isMutating}
                  onBlur={getFieldProps('profitAmount').onBlur}
                  name={getFieldProps('profitAmount').name}
                  value={getFieldProps('profitAmount').value}
                  type="text"
                  tabIndex={5}
                  fixedDecimalLength={2}
                  className={`input w-full border-none bg-transparent px-0 pl-2 focus:outline-none`}
                  prefix="₱"
                  onValueChange={(value) => {
                    setFieldValue('profitAmount', value)
                    if (value) {
                      const newProfitPercentage =
                        (+value / Number(values.cost)) * 100
                      const newPrice = Number(values.cost) + +value
                      setFieldValue('price', newPrice.toFixed(2))
                      setFieldValue(
                        'profitPercentage',
                        // If has decimal show 2 decimal places, else show 0
                        newProfitPercentage % 1
                          ? newProfitPercentage.toFixed(2)
                          : newProfitPercentage.toFixed(0),
                      )
                    }
                  }}
                  allowNegativeValue={false}
                />
              </div>
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.profitAmount}&nbsp;
                </span>
              </div>
            </div>
          </div>

          {/* Images */}
          <ProductImages
            disabled={isMutating}
            onImagesChange={() => {}}
            images={[]}
          />

          {/* Track Stock */}
          <div className="form-control flex w-full flex-row justify-between py-2">
            <span>Track Stock</span>
            <input
              {...getFieldProps('trackStock')}
              type="checkbox"
              onChange={(e) => {
                setFieldValue('trackStock', e.target.checked)
                console.log(values.trackStock, e.target.checked)
                if (values.trackStock === false && e.target.checked === true) {
                  setActiveScreen(ActiveScreen.StockDetail)
                }
              }}
              className="toggle toggle-primary"
            />
          </div>

          {/* Manage Stock */}
          {values.trackStock && (
            <button
              onClick={() => setActiveScreen(ActiveScreen.StockDetail)}
              className="flex-start btn btn-outline btn-primary btn-md w-full flex-shrink-0 flex-row flex-nowrap justify-between "
            >
              <div className="flex flex-row items-center gap-2">
                <HomeIcon className="w-5 flex-shrink-0 " />
                <p className="">Manage Stock</p>
              </div>
              <ChevronRightIcon className="w-5 flex-shrink-0 " />
            </button>
          )}
        </div>
      </div>

      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ActiveScreen.Description}
        zIndex={11}
      >
        <Description
          description={values.description}
          onBack={goBackToProductScreen}
          onComplete={(desription) => {
            setFieldValue('description', desription)
          }}
        />
      </SlidingTransition>

      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ActiveScreen.StockDetail}
        zIndex={11}
      >
        <StockDetail onBack={goBackToProductScreen} />
      </SlidingTransition>
    </div>
  )
}

const ProductDetailSchema = z.object({
  id: z.string({ required_error: 'Product ID is required' }).nullable(),
  name: z.string({ required_error: 'Product name is required' }),
  description: z.string().default(''),
  price: z.coerce
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price is required',
    })
    .min(0),
  cost: z.coerce
    .number({
      required_error: 'Cost is required',
      invalid_type_error: 'Cost is required',
    })
    .min(0),
  profitPercentage: z.coerce.number({
    required_error: 'Profit % is required',
    invalid_type_error: 'Profit  % is required',
  }),
  profitAmount: z.coerce.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit is required',
  }),
  images: z.array(z.string()).default([]),
  trackStock: z.boolean().default(false),
})

export default ProductDetail
