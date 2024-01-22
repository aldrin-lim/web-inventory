import { useEffect, useState } from 'react'
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
import useCreateProduct from 'hooks/useCreateProduct'
import { AddProductSchema } from 'api/product/createProduct'
import SlidingTransition from 'components/SlidingTransition'
import Description from './screens/Description'
import StockDetail from './screens/StockDetail'
import { ProductBatchSchema, ProductSoldBy } from 'types/product.types'
import { GetProductSchema } from 'api/product/getProductById'
import useDeleteProduct from 'hooks/useDeleteProduct'
import useUpdateProduct from 'hooks/useUpdateProduct'
import { UpdateProductSchema } from 'api/product/updateProductById'
import { v4 } from 'uuid'
import useCloneProduct from 'hooks/useCloneProduct'
import {
  computeProfitAmount,
  computeProfitPercentage,
  toNumber,
} from 'util/number'
import { ProductDetailSchema } from './ProductDetail.types'
import Big from 'big.js'
import CurrencyInput from 'react-currency-input-field'

enum ActiveScreen {
  None = 'none',
  Description = 'description',
  StockDetail = 'stockDetail',
}

type ProductDetailProps = {
  product?: z.infer<typeof GetProductSchema>
}

const defaultValue = {
  name: '',
  price: 0,
  cost: 0,
  images: [],
  profitAmount: 0,
  profitPercentage: 0,
  trackStock: false,
  description: '',
  profit: 0,
  category: '',
  soldBy: ProductSoldBy.Pieces,
  allowBackOrder: false,
  isBulkCost: false,
  batches: [
    {
      name: 'Batch 1',
      cost: 0,
      costPerUnit: 0,
      quantity: 1,
      unitOfMeasurement: 'pieces',
      expirationDate: null,
    },
  ],
} as z.infer<typeof ProductDetailSchema>

const GetActiveBatchParam = z.union([
  ProductBatchSchema,
  ProductBatchSchema.partial({ id: true }),
])
type GetActiveBatchParam = z.infer<typeof GetActiveBatchParam>[]
export const getActiveBatch = (batches: GetActiveBatchParam) => {
  // Find the first batch that has quantity > 0
  // Check if it has expiration date, if it has, check if its not expired
  // Batch is active when quantity > 0 and not expired or no expiration date
  const activeBatch = batches.find(
    (batch) =>
      batch.quantity > 0 &&
      (!batch.expirationDate || new Date(batch.expirationDate) > new Date()),
  )

  // If no active batch found, get the first batch
  if (!activeBatch) {
    return batches[0]
  }

  return activeBatch
}

export const ProductDetail = (props: ProductDetailProps) => {
  const { product } = props
  const navigate = useNavigate()

  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)

  const { createProduct, isCreating } = useCreateProduct()
  const { deleteProduct, isDeleting } = useDeleteProduct()
  const { updateProduct, isUpdating } = useUpdateProduct()
  const { cloneProduct, isCloning } = useCloneProduct()

  const [isStockReset, setIsStockReset] = useState(false)

  const isMutating = isCreating || isDeleting || isUpdating || isCloning

  const value = product
    ? ({
        ...product,
        profitAmount: product.profit,
        profitPercentage: computeProfitPercentage(
          product.price,
          product.isBulkCost
            ? toNumber(getActiveBatch(product.batches).costPerUnit)
            : toNumber(getActiveBatch(product.batches).cost),
        ),
        cost: product.activeBatch.cost,
      } as z.infer<typeof ProductDetailSchema>)
    : defaultValue
  const {
    submitForm,
    errors,
    getFieldProps,
    setFieldValue,
    values,
    setValues,
  } = useFormik({
    initialValues: value,
    validationSchema: toFormikValidationSchema(ProductDetailSchema),
    enableReinitialize: true,
    validateOnBlur: false,
    onSubmit: async (value) => {
      console.log(value)

      const parsedValue = ProductDetailSchema.parse(value)

      if (mode === 'add') {
        if (parsedValue.trackStock === false) {
          const requestBody: z.infer<typeof AddProductSchema> = {
            name: parsedValue.name,
            price: toNumber(parsedValue.price),
            profit: toNumber(parsedValue.profitAmount),
            soldBy: ProductSoldBy.Pieces,
            category: parsedValue.category,
            description: parsedValue.description,
            images: parsedValue.images,
            batches: [
              {
                ...defaultValue.batches[0],
                quantity: 1,
                cost: parsedValue.cost ?? 0,
              },
            ],

            allowBackOrder: false,
            trackStock: false,
            isBulkCost: false,
          }
          await createProduct(requestBody)
        } else {
          console.log('pasok')
          const requestBody: z.infer<typeof AddProductSchema> = {
            name: parsedValue.name,
            price: toNumber(parsedValue.price),
            profit: toNumber(parsedValue.profitAmount),
            soldBy: parsedValue.soldBy,
            category: parsedValue.category,
            description: parsedValue.description,
            images: parsedValue.images,
            batches: parsedValue.batches,
            allowBackOrder: parsedValue.allowBackOrder,
            trackStock: parsedValue.trackStock,
            isBulkCost: parsedValue.isBulkCost,
          }

          await createProduct(requestBody)
        }
        navigate(AppPath.ProductOverview)
      } else {
        const requestBody: z.infer<typeof UpdateProductSchema> = {
          name: parsedValue.name,
          price: parsedValue.price as number,
          profit: parsedValue.profitAmount as number,
          soldBy: parsedValue.soldBy,
          category: parsedValue.category,
          description: parsedValue.description,
          images: parsedValue.images,
          batches: parsedValue.batches as z.infer<
            typeof UpdateProductSchema
          >['batches'],
          allowBackOrder: parsedValue.allowBackOrder,
          trackStock: parsedValue.trackStock,
          isBulkCost: parsedValue.isBulkCost,
        }

        if (parsedValue.trackStock === false) {
          requestBody.batches = [
            {
              ...defaultValue.batches[0],
              quantity: 1,
              cost: parsedValue.cost ?? 0,
            },
          ]
        }

        if (product) {
          await updateProduct({
            id: product.id,
            product: requestBody,
          })
        }
      }
    },
    validateOnChange: false,
  })

  const mode: 'add' | 'edit' = product ? 'edit' : 'add'

  const showDescription = () => {
    setActiveScreen(ActiveScreen.Description)
  }

  const goBackToProductScreen = () => {
    setActiveScreen(ActiveScreen.None)
  }

  useEffect(() => {
    if (mode === 'add') {
      setFieldValue('cost', '')
      setFieldValue('price', '')
      setFieldValue('profitAmount', '')
      setFieldValue('profitPercentage', '')
    }
  }, [mode])

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
                console.log(errors)
                console.log(values)
                submitForm()
              }}
              onDelete={async () => {
                if (product) {
                  await deleteProduct({ id: product.id })
                  navigate(AppPath.ProductOverview)
                }
              }}
              onSave={function (): void {
                submitForm()
              }}
              onClone={async () => {
                if (product) {
                  await cloneProduct({ id: product.id })
                }
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

          {/* Cost per Unit */}
          {values.isBulkCost && (
            <div className="mb-2 flex w-full flex-row justify-between rounded-md bg-primary p-2 py-1 text-white">
              <p className="font-bold">Cost:</p>

              <div className="flex flex-row">
                <p className="font-bold">
                  ₱ {getActiveBatch(values.batches).costPerUnit}
                </p>
                /<p> {getActiveBatch(values.batches).unitOfMeasurement}</p>
              </div>
            </div>
          )}

          {/* Cost */}
          {values.isBulkCost === false && (
            <label className="form-control">
              <div className="form-control-label  ">
                <span className="label-text-alt text-gray-400">Cost</span>
              </div>
              <CurrencyInput
                decimalsLimit={2}
                prefix="₱"
                disabled={isMutating}
                name={getFieldProps('cost').name}
                value={values.cost}
                type="text"
                tabIndex={3}
                className="input input-bordered w-full"
                placeholder="₱0"
                inputMode="decimal"
                onValueChange={(value) => {
                  setFieldValue('cost', value)
                  const cost = toNumber(value)
                  if (values.price > 0) {
                    const price = toNumber(values.price)
                    const newProfitAmount = computeProfitAmount(price, cost)
                    const newProfitPercentage = computeProfitPercentage(
                      price,
                      cost,
                    )
                    setFieldValue('profitAmount', newProfitAmount)
                    setFieldValue('profitPercentage', newProfitPercentage)
                  }

                  if (
                    values.trackStock === false ||
                    values.isBulkCost === false
                  ) {
                    setFieldValue('batches.0.cost', toNumber(cost))
                  }
                }}
              />
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.cost}&nbsp;
                </span>
              </div>
            </label>
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
                value={values.price}
                type="text"
                tabIndex={2}
                className="input input-bordered w-full"
                placeholder="₱0"
                inputMode="decimal"
                onValueChange={(value) => {
                  setFieldValue('price', value)
                  const newPrice = toNumber(value)
                  const cost = values.isBulkCost
                    ? toNumber(getActiveBatch(values.batches).costPerUnit)
                    : toNumber(values.cost)
                  const newProfitAmount = computeProfitAmount(newPrice, cost)
                  const newProfitPercentage = computeProfitPercentage(
                    newPrice,
                    cost,
                  )
                  setFieldValue('profitAmount', toNumber(newProfitAmount))
                  setFieldValue(
                    'profitPercentage',
                    toNumber(newProfitPercentage),
                  )
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
                  disabled={isMutating}
                  onBlur={getFieldProps('profitPercentage').onBlur}
                  name={getFieldProps('profitPercentage').name}
                  value={values.profitPercentage}
                  placeholder="70"
                  type="text"
                  tabIndex={4}
                  inputMode="decimal"
                  className={[
                    'input w-[40px] border-none bg-transparent px-0 text-center focus:outline-none',
                  ].join(' ')}
                  onValueChange={(value) => {
                    setFieldValue('profitPercentage', value)
                    const newProfitPercentage = toNumber(value)
                    const cost = values.isBulkCost
                      ? toNumber(getActiveBatch(values.batches).costPerUnit)
                      : toNumber(values.cost)
                    // const newPrice = cost * (1 + newProfitPercentage / 100)
                    const newPrice = new Big(cost)
                      .times(
                        new Big(1).plus(new Big(newProfitPercentage).div(100)),
                      )
                      .round(2)
                      .toNumber()
                    const newProfitAmount = computeProfitAmount(newPrice, cost)

                    setFieldValue('price', newPrice)
                    setFieldValue('profitAmount', newProfitAmount)
                  }}
                />
                <p className="border-r-[1.5px] border-gray-300 px-2">%</p>
                <CurrencyInput
                  decimalsLimit={2}
                  prefix="₱"
                  disabled={isMutating}
                  onBlur={getFieldProps('profitAmount').onBlur}
                  name={getFieldProps('profitAmount').name}
                  value={values.profitAmount}
                  type="text"
                  tabIndex={5}
                  className={`input w-full border-none bg-transparent px-0 pl-2 focus:outline-none`}
                  placeholder="₱0"
                  inputMode="decimal"
                  onValueChange={(value) => {
                    setFieldValue('profitAmount', value)
                    const newProfitAmount = toNumber(value)
                    const cost = values.isBulkCost
                      ? toNumber(getActiveBatch(values.batches).costPerUnit)
                      : toNumber(values.cost)

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

          {/* Images */}
          <ProductImages
            disabled={isMutating}
            onImagesChange={(images) => {
              setFieldValue('images', images)
            }}
            images={values.images ?? []}
          />

          {/* Track Stock */}
          <div className="form-control flex w-full flex-row justify-between py-2">
            <span>Track Stock</span>
            <input
              {...getFieldProps('trackStock')}
              type="checkbox"
              onChange={(e) => {
                setFieldValue('trackStock', e.target.checked)
                if (values.trackStock === false && e.target.checked === true) {
                  setActiveScreen(ActiveScreen.StockDetail)
                }
                if (e.target.checked === false) {
                  setIsStockReset(true)
                  const newProfitAmount = computeProfitAmount(
                    toNumber(values.price),
                    toNumber(values.cost),
                  )
                  const newProfitPercentage = computeProfitPercentage(
                    toNumber(values.price),
                    toNumber(values.cost),
                  )
                  setValues({
                    ...values,
                    allowBackOrder: false,
                    isBulkCost: false,
                    soldBy: ProductSoldBy.Pieces,
                    profitAmount: newProfitAmount,
                    profitPercentage: newProfitPercentage,
                    trackStock: false,
                    batches: [
                      {
                        ...defaultValue.batches[0],
                        quantity: 1,
                        id: v4(),
                        cost: toNumber(values.cost),
                      },
                    ],
                  })
                }
              }}
              checked={values.trackStock}
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
        {/* <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre> */}
        {/* <pre className="text-xs">{JSON.stringify(errors, null, 2)}</pre> */}
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
        <StockDetail
          disabled={isStockReset === false && mode === 'edit'}
          activeBatch={props.product?.activeBatch}
          value={values}
          onBack={goBackToProductScreen}
          onComplete={async (value) => {
            if (value.batches.length === 0) {
              setIsStockReset(true)
              const cost = toNumber(values.cost)
              const newBatch = {
                ...defaultValue.batches[0],
                id: v4(),
                quantity: 1,
                cost,
              }
              const newProfitAmount = computeProfitAmount(
                toNumber(values.price),
                cost,
              )
              const newProfitPercentage = computeProfitPercentage(
                toNumber(values.price),
                cost,
              )
              await setValues({
                ...values,
                allowBackOrder: false,
                trackStock: false,
                isBulkCost: false,
                soldBy: ProductSoldBy.Pieces,
                profitPercentage: newProfitPercentage,
                profitAmount: newProfitAmount,
                batches: [newBatch],
              })
            } else {
              const cost = value.isBulkCost
                ? toNumber(getActiveBatch(value.batches).costPerUnit)
                : toNumber(values.cost)
              const newProfitAmount = computeProfitAmount(
                toNumber(values.price),
                cost,
              )
              const newProfitPercentage = computeProfitPercentage(
                toNumber(values.price),
                cost,
              )
              await setValues({
                ...values,
                allowBackOrder: value.allowBackOrder,
                batches: value.batches,
                soldBy: value.soldBy,
                isBulkCost: value.isBulkCost,
                profitPercentage: newProfitPercentage,
                profitAmount: newProfitAmount,
              })
            }
          }}
        />
      </SlidingTransition>
    </div>
  )
}

export default ProductDetail
