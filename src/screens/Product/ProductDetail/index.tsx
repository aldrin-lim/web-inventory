import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PrimaryAction from './components/ProductDetailPrimaryAction'
import { z } from 'zod'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import useCreateProduct from 'hooks/useCreateProduct'
import SlidingTransition from 'components/SlidingTransition'
import Description from './screens/Description'
import {
  ProductBatchSchema,
  ProductSoldBy,
  RecipeSchema,
} from 'types/product.types'
import { GetProductSchema } from 'api/product/getProductById'
import useDeleteProduct from 'hooks/useDeleteProduct'
import useUpdateProduct from 'hooks/useUpdateProduct'
import { v4 } from 'uuid'
import useCloneProduct from 'hooks/useCloneProduct'
import {
  computeProfitAmount,
  computeProfitPercentage,
  padWithZeros,
  profitPercentageColor,
  toNumber,
} from 'util/number'
import {
  FormikValuesSchema,
  ProductDetailFormikValue,
} from './ProductDetail.types'
import { useCustomRoute } from 'util/route'
import { toast } from 'react-toastify'
import { getActiveBatch } from 'util/products'
import Big from 'big.js'
import CurrencyInput from 'react-currency-input-field'
import CategoryDropdown from './components/CategoryDropdown'
import ProductImages from './components/ProductImages'
import { cloneDeep } from 'lodash'
import { measurementOptions, unitAbbrevationsToLabel } from 'util/measurement'
import BatchCard from './components/BatchCard'
import MeasurementSelect from './components/MeasurementSelect'
import { motion } from 'framer-motion'

type Recipe = z.infer<typeof RecipeSchema>

export enum ScreenPath {
  Description = 'description',
  StockDetail = 'stock-detail',
  SelectRecipe = 'select-recipe',
  RecipeDetail = 'recipe-details',
}

type ProductDetailProps = {
  product?: z.infer<typeof GetProductSchema>
}

export type ProductAction = 'add' | 'edit'

export const ProductDetail = (props: ProductDetailProps) => {
  const { product } = props
  const location = useLocation()

  const defaultValue = useMemo(() => {
    return {
      name: '',
      price: undefined,
      images: [],
      profitAmount: undefined,
      profitPercentage: undefined,
      overallCost: undefined,
      trackStock: true,
      description: '',
      profit: 0,
      category: '',
      soldBy: ProductSoldBy.Pieces,
      allowBackOrder: false,
      isBulkCost: false,
      availability: '',
      forSale: true,
      outOfStock: false,
      totalQuantity: 0,
      isExpired: false,
      id: v4(),
      batches: [
        {
          id: v4(),
          name: `Batch #${padWithZeros(1)}`,
          cost: 0,
          costPerUnit: 0,
          quantity: 1,
          unitOfMeasurement: 'pieces',
          expirationDate: null,
          isDeducted: false,
        },
      ],
    } as ProductDetailFormikValue
  }, [])
  const navigate = useNavigate()

  // const product = useMemo(() => {
  //   if (!props.product) {
  //     return undefined
  //   }

  //   const updatedProduct = props.product as ViewProductDetailSchema

  //   if (updatedProduct.isBulkCost === false && !props.product.recipe) {
  //     updatedProduct.cost = getActiveBatch(props.product.batches)?.cost ?? 0
  //   }

  //   if (props.product.recipe) {
  //     updatedProduct.cost = props.product.recipe.cost
  //   }
  //   return updatedProduct
  // }, [props.product])

  const mode: ProductAction = product ? 'edit' : 'add'

  const { currentScreen, isParentScreen, navigateToParent } =
    useCustomRoute(ScreenPath)

  const { createProduct, isCreating } = useCreateProduct()
  const { deleteProduct, isDeleting } = useDeleteProduct()
  const { updateProduct, isUpdating } = useUpdateProduct()
  const { cloneProduct, isCloning } = useCloneProduct()

  const isMutating = isCreating || isDeleting || isUpdating || isCloning

  const overallMeasurment =
    product?.soldBy === ProductSoldBy.Pieces
      ? 'pieces'
      : product?.batches[0]?.unitOfMeasurement ?? 'g'

  const [unitOfMeasurement, setUnitOfMeasurement] = useState(overallMeasurment)
  const [showMore, setShowMore] = useState(false)

  const overallCostFromBatches: number | undefined =
    product &&
    !product.isBulkCost &&
    product.batches[0] &&
    product.batches[0].cost
      ? product.batches[0].cost
      : 0

  const overallCost = overallCostFromBatches
    ? overallCostFromBatches
    : undefined

  const initialValues = product ?? defaultValue
  const {
    submitForm,
    errors,
    getFieldProps,
    setFieldValue,
    values,
    setValues,
    setFieldError,
  } = useFormik<ProductDetailFormikValue>({
    initialValues: {
      ...initialValues,
      overallCost,
    },
    validationSchema: toFormikValidationSchema(
      FormikValuesSchema.superRefine(async (data, ctx) => {
        // TODO: Rename isForSale to isIngredient
        const isIngredient = data.forSale === false
        // If ingredient, no need to validate overall cost
        if (!isIngredient) {
          const priceValidation = z
            .number({
              coerce: true,
              required_error: 'Price is required',
              invalid_type_error: 'Price must be a number',
            })
            .positive('Price must be greater than 0')
            .safeParse(toNumber(data.price))
          const profitAmountValidation = z
            .number({
              required_error: 'Profit Amount is required',
              invalid_type_error: 'Profit Amount must be a number',
              coerce: true,
            })
            .positive('Profit Amount must be greater than 0')
            .safeParse(toNumber(data.profitAmount))
          const profitPercentageValidation = z
            .number({
              required_error: 'Profit Percentage is required',
              invalid_type_error: 'Profit Percentage must be a number',
              coerce: true,
            })
            .positive('Profit Percentage must be greater than 0')
            .safeParse(toNumber(data.profitPercentage))
          if (priceValidation.success === false) {
            ctx.addIssue({
              path: ['price'], // Path to the field
              message: priceValidation.error.issues[0].message,
              code: 'custom',
            })
          }
          if (profitAmountValidation.success === false) {
            ctx.addIssue({
              path: ['profitAmount'], // Path to the field
              message: profitAmountValidation.error.issues[0].message,
              code: 'custom',
            })
          }
          if (profitPercentageValidation.success === false) {
            ctx.addIssue({
              path: ['profitPercentage'], // Path to the field
              message: profitPercentageValidation.error.issues[0].message,
              code: 'custom',
            })
          }

          if (data.isBulkCost === false) {
            const overallCostValidation = z
              .number({
                required_error: 'Cost is required',
                invalid_type_error: 'Cost must be a number',
                coerce: true,
              })
              .positive('Cost must be greater than 0')
              .safeParse(toNumber(data.overallCost))
            if (overallCostValidation.success === false) {
              ctx.addIssue({
                path: ['overallCost'], // Path to the field
                message: overallCostValidation.error.issues[0].message,
                code: 'custom',
              })
            }
          }
        }

        // Validate batches

        if (mode === 'add') {
          data.batches.forEach((batch) => {
            const quantityValidation = z
              .number({
                coerce: true,
                required_error: 'Quantity is required',
                invalid_type_error: 'Quantity must be a number',
              })
              .positive('Quantity must be greater than 0')
              .safeParse(batch.quantity)
            if (quantityValidation.success === false) {
              const index = data.batches.findIndex((b) => b.id === batch.id)
              ctx.addIssue({
                path: ['batches', index, 'quantity'], // Path to the field
                message: quantityValidation.error.issues[0].message,
                code: 'custom',
              })
            }
          })
        }
      }),
    ),
    enableReinitialize: true,
    validateOnBlur: false,
    onSubmit: async (formValue) => {
      // formValue.price = toNumber(formValue.price)
      // formValue.profitPercentage = toNumber(formValue.profitPercentage)
      // formValue.profitAmount = toNumber(formValue.profitAmount)
      // if (formValue.isBulkCost === false) {
      //   formValue.batches = formValue.batches.map((batch) => {
      //     return {
      //       ...batch,
      //       cost: toNumber(formValue.cost),
      //     }
      //   })
      // }
      // const validation = (
      //   product ? UpdateProductBodySchema : CreateProductBodySchema
      // ).safeParse(formValue)
      // if (!validation.success) {
      //   const error = validation.error.issues[0].message
      //   console.log(validation.error)
      //   toast.error(error, {
      //     autoClose: 500,
      //     theme: 'colored',
      //   })
      //   return
      // }
      // if (product) {
      //   await updateProduct({
      //     id: product.id,
      //     body: validation.data,
      //   })
      // } else {
      //   await createProduct(validation.data as CreateProductBodySchema)
      //   if (location.state?.from) {
      //     navigate(location.state.from)
      //     return
      //   }
      //   navigate(AppPath.ProductOverview)
      // }
    },
    validateOnChange: false,
  })

  const showDescription = () => {
    navigate(ScreenPath.Description)
  }

  // useEffect(() => {
  //   if (mode === 'add') {
  //     setFieldValue('cost', '')
  //     setFieldValue('price', '')
  //     setFieldValue('profitAmount', '')
  //     setFieldValue('profitPercentage', '')
  //   }
  // }, [mode])

  const showRecipeList = () => {
    navigate(ScreenPath.SelectRecipe)
  }

  const onRecipeSelect = async (recipe: Recipe) => {
    navigateToParent()
    await setValues(initialValues)
    setFieldValue('recipe', recipe)
    setFieldValue('name', recipe.name)
    setFieldValue('cost', recipe.cost)
  }

  const removeRecipe = () => {
    setValues(initialValues)
  }

  const goBack = () => {
    if (location.state?.from) {
      navigate(location.state.from)
      return
    }
    navigate(AppPath.ProductOverview)
  }

  const hideCost = () => {
    if (values.forSale === false) {
      return true
    }

    if (values.isBulkCost === true) {
      return true
    }

    return false
  }

  // Memoized values
  const showCostInput = useMemo(() => {
    // TODO: Rename isForSale to isIngredient
    const isIngredient = values.forSale === false

    if (isIngredient) {
      return false
    }

    if (values.isBulkCost === true) {
      return false
    }

    return true
  }, [values.forSale, values.isBulkCost])

  const showPriceAndProfit = useMemo(() => {
    // TODO: Rename isForSale to isIngredient
    const isIngredient = values.forSale === false
    if (isIngredient) {
      return false
    }

    return true
  }, [values.forSale])

  const activeBatch = values.activeBatch ?? getActiveBatch(values.batches)

  const computedCost = useMemo(() => {
    if (activeBatch) {
      return values.isBulkCost
        ? toNumber(activeBatch.costPerUnit)
        : toNumber(values.overallCost)
    }

    return 0
  }, [])

  const nonActiveBatches = useMemo(() => {
    return values.batches.filter((batch) => batch.id !== activeBatch?.id)
  }, [values.batches, activeBatch])

  // Event handlers

  const submitFormikForm = () => {
    if (values.batches.length === 0) {
      toast.error('No batch available for use', {
        autoClose: 1000,
        theme: 'colored',
      })
      return
    }
    submitForm()
  }

  const addNewBatch = async () => {
    const newBatch = {
      id: v4(),
      name: `Batch #${padWithZeros(values.batches.length + 1)} `,
      cost: computedCost,
      costPerUnit: 0,
      quantity: 1,
      unitOfMeasurement:
        values.soldBy === ProductSoldBy.Pieces
          ? 'pieces'
          : values.batches[0]?.unitOfMeasurement ?? 'g',
      expirationDate: null,
    } as z.infer<typeof ProductBatchSchema>

    await setFieldValue('batches', [...values.batches, newBatch])
    if (!showMore) {
      setShowMore(true)
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
    const lastBatchElement = document.querySelector('#add-batch-button')
    if (lastBatchElement) {
      lastBatchElement.scrollIntoView()
    }

    if (!activeBatch) {
      const newActiveBatchElement = document.querySelector('#active-batch-card')
      if (newActiveBatchElement) {
        const topPos =
          newActiveBatchElement.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: topPos - 80, // Subtract 20 pixels to adjust the final position
          behavior: 'smooth', // Optional: Adds smooth scrolling
        })
      }
    }
  }

  const goBackToProductScreen = () => {
    navigateToParent()
  }

  useEffect(() => {
    console.log('activeBatch', activeBatch)
    // Prevent confusion when the there are no active batches
    if (!activeBatch) {
      if (!showMore) {
        setShowMore(true)
      }
    }
  }, [activeBatch])

  return (
    <>
      <div
        className={[
          'screen  pb-9',
          !isParentScreen ? 'hidden-screen' : '',
        ].join(' ')}
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
              onClick={goBack}
              disabled={isMutating}
            />,
            <ToolbarTitle
              key="title"
              title={product ? 'Edit Product' : 'New Product'}
            />,
            <PrimaryAction
              mode={product ? 'edit' : 'add'}
              key="primaryAction"
              disabled={isMutating}
              isLoading={isMutating}
              onCreate={() => {
                submitFormikForm()
              }}
              onDelete={async () => {
                if (product) {
                  await deleteProduct({ id: product.id })
                  navigate(AppPath.ProductOverview)
                }
              }}
              onSave={function (): void {
                console.log('active', getActiveBatch(values.batches))
                if (!getActiveBatch(values.batches)) {
                  toast.error('No batch usable found', {
                    autoClose: 1000,
                    theme: 'colored',
                  })
                  return
                }
                // submitForm()
              }}
              onClone={async () => {
                if (product) {
                  await cloneProduct({ id: product.id })
                }
              }}
            />,
          ]}
        />
        <div className="flex flex-col gap-4">
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
          {mode === 'add' && (
            <button
              onClick={showRecipeList}
              disabled={isMutating}
              className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left"
            >
              Use a recipe
            </button>
          )}

          {/* Set Description CTA */}
          <button
            onClick={showDescription}
            disabled={isMutating}
            className="flex-start btn btn-ghost btn-xs w-full flex-shrink-0 flex-row flex-nowrap justify-between px-0"
          >
            <p className="text-overflow-ellipsis overflow-hidden truncate whitespace-nowrap break-words text-left">
              <span className="text-gray-400">
                {values.description === '' && 'Add Description'}
                {values.description}
              </span>
            </p>
            <ChevronRightIcon className="w-5 flex-shrink-0 text-secondary" />
          </button>

          {/* For Sale */}
          {mode === 'add' && (
            <div className="form-control flex w-full flex-row gap-2 py-2">
              <input
                {...getFieldProps('forSale')}
                type="checkbox"
                onChange={(e) => {
                  setFieldValue('forSale', !e.target.checked)
                  if (e.target.checked === true) {
                    setFieldValue('price', undefined)
                    setFieldValue('profitAmount', undefined)
                    setFieldValue('profitPercentage', undefined)

                    // Set all cost to zero
                    const batches = cloneDeep(values.batches)
                    const updatedBatches = batches.map((batch) => {
                      return {
                        ...batch,
                        cost: 0,
                      }
                    })
                    setFieldValue('batches', updatedBatches)
                  }
                }}
                checked={!values.forSale}
                className="toggle toggle-primary"
              />
              <span>For ingredients purposes only</span>
            </div>
          )}

          {/* Cost per Unit */}
          {values.isBulkCost && (
            <div>
              <div className=" w-full">
                <span className="text-xs">{activeBatch?.name}</span>
              </div>
              <div className="mb-2 flex w-full flex-row justify-between rounded-md bg-gray-200 p-2 py-1 text-black ">
                <p className="font-bold">Cost:</p>
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <p className="font-bold">
                      ₱ {getActiveBatch(values.batches)?.costPerUnit ?? 0}
                    </p>
                    /
                    <p>
                      {' '}
                      {getActiveBatch(values.batches)?.unitOfMeasurement ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cost Input */}
          {showCostInput && (
            <label className="form-control">
              <div className="form-control-label  ">
                <span className="label-text-alt text-gray-400">Cost</span>
              </div>
              <CurrencyInput
                decimalsLimit={4}
                prefix="₱"
                disabled={isMutating}
                name={getFieldProps('cost').name}
                value={values.overallCost}
                type="text"
                tabIndex={3}
                className="input input-bordered w-full"
                placeholder="₱0"
                inputMode="decimal"
                onValueChange={(value) => {
                  setFieldValue('overallCost', value)
                  const cost = toNumber(value)
                  if (values.price && values.price > 0) {
                    const price = toNumber(values.price)
                    const newProfitAmount = computeProfitAmount(price, cost)
                    const newProfitPercentage = computeProfitPercentage(
                      price,
                      cost,
                    )
                    setFieldValue('profitAmount', newProfitAmount)
                    setFieldValue('profitPercentage', newProfitPercentage)
                  }

                  // Set the cost of all batches
                  const batches = cloneDeep(values.batches)
                  const updatedBatches = batches.map((batch) => {
                    return {
                      ...batch,
                      cost: toNumber(overallCost),
                    }
                  })
                  setFieldValue('batches', updatedBatches)
                }}
              />
              {errors.overallCost && (
                <div className="label py-0">
                  <span className="label-text-alt text-xs text-red-400">
                    {errors.overallCost}
                  </span>
                </div>
              )}
            </label>
          )}

          {showPriceAndProfit && (
            <>
              {/* Price*/}
              <div className="flex w-full flex-row gap-2">
                {/* Price Input */}
                <label className="form-control ">
                  <div className="form-control-label  ">
                    <span className="label-text-alt text-gray-400">Price</span>
                  </div>
                  <CurrencyInput
                    decimalsLimit={4}
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
                      const cost = computedCost
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
                    }}
                  />
                  {errors.price && (
                    <div className="label py-0">
                      <span className="label-text-alt text-xs text-red-400">
                        {errors.price}
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {/* Profit */}
              <div className="form-control">
                <div className="form-control input input-bordered relative flex flex-row items-center">
                  <div className="form-control-label  ">
                    <span className="label-text-alt text-gray-400">Profit</span>
                  </div>
                  <CurrencyInput
                    decimalsLimit={4}
                    disabled={isMutating}
                    onBlur={getFieldProps('profitPercentage').onBlur}
                    name={getFieldProps('profitPercentage').name}
                    value={values.profitPercentage}
                    placeholder="70"
                    type="text"
                    tabIndex={4}
                    disableGroupSeparators={true}
                    inputMode="decimal"
                    className={[
                      'input w-1/2 border-none bg-transparent px-0 text-left focus:outline-none',
                      profitPercentageColor(values.profitPercentage ?? 0),
                    ].join(' ')}
                    onValueChange={(value) => {
                      setFieldValue('profitPercentage', value)
                      const newProfitPercentage = toNumber(value)
                      const cost = computedCost
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
                    }}
                  />
                  <p className="border-r-[1.5px] border-gray-300 px-2">%</p>
                  <CurrencyInput
                    decimalsLimit={4}
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
                      const cost = computedCost

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
                    }}
                  />
                </div>
                {errors.profitAmount && (
                  <div className="label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {errors.profitAmount}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Category */}
          <label className="form-control w-full ">
            <div className=" ">
              <span className="label-text-alt text-gray-400">Category</span>
            </div>
            <CategoryDropdown
              value={values.category}
              onChange={(option) => {
                console.log(option)
                setFieldValue('category', option?.value)
              }}
            />

            {errors.category && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.category}
                </span>
              </div>
            )}
          </label>

          {/* Images */}
          <ProductImages
            disabled={isMutating}
            onImagesChange={(images) => {
              setFieldValue('images', images)
            }}
            images={values.images ?? []}
          />
          {/* Low Stock warning */}
          <label className="form-control w-full ">
            <div className="form-control-label z-10 ">
              <span className="label-text-alt text-gray-400">
                Warn when quantity is below
              </span>
            </div>
            <div className="join w-full">
              <CurrencyInput
                decimalsLimit={4}
                disabled={isMutating}
                onBlur={getFieldProps('stockWarning').onBlur}
                name={getFieldProps('stockWarning').name}
                value={values.profitAmount}
                type="text"
                className="input join-item input-bordered w-full"
                inputMode="decimal"
                placeholder="Quantity"
                onValueChange={(value) => {
                  setFieldValue('stockWarning', value)
                }}
              />
              <div className="indicator">
                <button className="btn join-item no-animation">
                  {unitAbbrevationsToLabel(unitOfMeasurement)}
                </button>
              </div>
            </div>
          </label>

          {/* Back order toggle */}
          <div className="form-control flex w-full flex-row gap-2 py-2">
            <input
              {...getFieldProps('allowBackOrder')}
              checked={values.allowBackOrder}
              type="checkbox"
              className="toggle toggle-primary"
            />
            <span>Allow selling when out of stock</span>
          </div>

          {/* Sell by */}
          <p>Use/Sell By:</p>
          <div className="bg-gray-100  p-2">
            <div className="form-control ">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  {...getFieldProps('soldBy')}
                  type="radio"
                  className="radio-primary radio"
                  name="soldBy"
                  value={ProductSoldBy.Pieces}
                  checked={values.soldBy === ProductSoldBy.Pieces}
                  disabled={mode === 'edit'}
                  onChange={(e) => {
                    setFieldValue('soldBy', e.target.value)
                    if (e.target.checked) {
                      setFieldValue(
                        'batches',
                        values.batches.map((batch) => {
                          return {
                            ...batch,
                            unitOfMeasurement: 'pieces',
                          }
                        }),
                      )
                    }
                  }}
                />
                <span className="label-text">Pieces</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  {...getFieldProps('soldBy')}
                  type="radio"
                  className="radio-primary radio"
                  name="soldBy"
                  value={ProductSoldBy.Weight}
                  checked={values.soldBy === ProductSoldBy.Weight}
                  disabled={mode === 'edit'}
                  onChange={(e) => {
                    setFieldValue('soldBy', e.target.value)
                    setUnitOfMeasurement('g')
                    if (e.target.checked) {
                      setFieldValue(
                        'batches',
                        values.batches.map((batch) => {
                          return {
                            ...batch,
                            unitOfMeasurement: 'g',
                          }
                        }),
                      )
                    }
                  }}
                />
                <span className="label-text">Weight</span>
              </label>
            </div>
            {/* Unit of measurement */}
            {values.soldBy === 'weight' && (
              <label className="form-control w-full ">
                <div className="">
                  <span className="label-text-alt ">Unit of Measurement</span>
                </div>
                <MeasurementSelect
                  disabled={mode === 'edit'}
                  value={{
                    label:
                      measurementOptions.find(
                        (option) => option.value === unitOfMeasurement,
                      )?.label || '',
                    value: unitOfMeasurement,
                  }}
                  onChange={(value) => {
                    if (!value) {
                      return
                    }
                    setUnitOfMeasurement(value?.value)
                    setFieldValue(
                      'batches',
                      values.batches.map((batch) => {
                        return {
                          ...batch,
                          unitOfMeasurement: value?.value,
                        }
                      }),
                    )
                  }}
                />
              </label>
            )}
          </div>

          {/* Bulk Cost Toggle */}
          <div className="flex w-full flex-row items-center justify-between">
            <p className="flex-grow">Stock:</p>

            <div className="form-control ml-auto flex w-auto flex-row gap-2 ">
              <span>Bulk Cost</span>
              <div className="flex flex-row gap-2">
                <input
                  {...getFieldProps('isBulkCost')}
                  checked={values.isBulkCost}
                  disabled={mode === 'edit'}
                  onChange={(e) => {
                    setFieldValue('isBulkCost', e.target.checked)
                    if (e.target.checked) {
                      setFieldValue(
                        'batches',
                        values.batches.map((batch) => {
                          return {
                            ...batch,
                            cost: 0,
                            costPerUnit: 0,
                          }
                        }),
                      )
                    }
                  }}
                  type="checkbox"
                  className="toggle toggle-primary"
                />
                <InformationCircleIcon className="w-5 text-neutral" />
              </div>
            </div>
          </div>

          {/* No Active Batch Warning */}
          {!activeBatch && (
            <div className="mt-4 text-center text-gray-400">
              No batch available for use. Please add a batch to continue.
            </div>
          )}

          {/* Active Batch */}
          {activeBatch &&
            [activeBatch].map((batch, index) => {
              return (
                <motion.div
                  key={batch.id}
                  initial={{ backgroundColor: '#856AD4', opacity: 0.5 }}
                  animate={{ background: '#FFF', opacity: 1 }}
                  transition={{ ease: 'easeInOut', duration: 0.4 }}
                >
                  <BatchCard
                    mode={mode}
                    active={true}
                    onRemove={async (batchId) => {
                      const newBatches = [...values.batches]
                      const updatedBatches = newBatches.filter(
                        (batch) => batch.id !== batchId,
                      )
                      await setFieldValue('batches', updatedBatches)
                    }}
                    onChange={async (updatedBatch) => {
                      await setFieldValue(
                        'batches',
                        values.batches.map((batch) => {
                          if (batch.id === updatedBatch.id) {
                            return updatedBatch
                          }
                          return {
                            ...batch,
                            unitOfMeasurement: updatedBatch.unitOfMeasurement,
                          }
                        }),
                      )
                    }}
                    error={
                      errors.batches &&
                      (errors.batches[
                        values.batches.findIndex((b) => b.id === batch.id)
                      ] as never)
                    }
                    batch={batch}
                    key={index}
                    soldBy={values.soldBy}
                    isBulkCost={values.isBulkCost}
                    forSale={values.forSale}
                  />
                </motion.div>
              )
            })}

          {/* Non active batches */}

          {nonActiveBatches.length > 0 && (
            <div
              className={`collapse collapse-arrow rounded-sm bg-base-100 ${
                showMore ? 'collapse-open' : 'collapse-close'
              }`}
            >
              <div
                onClick={() => setShowMore(!showMore)}
                className="collapse-title mx-auto w-[160px] px-0 text-center"
              >
                Show {showMore ? 'Less' : 'More'}
              </div>
              <div className="BatchesContainer collapse-content space-y-4 p-0">
                {nonActiveBatches.map((batch, index) => {
                  return (
                    <BatchCard
                      mode={mode}
                      onRemove={async (batchId) => {
                        const newBatches = [...values.batches]
                        const updatedBatches = newBatches.filter(
                          (batch) => batch.id !== batchId,
                        )
                        await setFieldValue('batches', updatedBatches)
                      }}
                      onChange={async (updatedBatch) => {
                        await setFieldValue(
                          'batches',
                          values.batches.map((batch) => {
                            if (batch.id === updatedBatch.id) {
                              return updatedBatch
                            }
                            return {
                              ...batch,
                              unitOfMeasurement: updatedBatch.unitOfMeasurement,
                            }
                          }),
                        )
                      }}
                      error={
                        errors.batches &&
                        (errors.batches[
                          values.batches.findIndex((b) => b.id === batch.id)
                        ] as never)
                      }
                      batch={batch}
                      key={index}
                      soldBy={values.soldBy}
                      isBulkCost={values.isBulkCost}
                      forSale={values.forSale}
                    />
                  )
                })}
              </div>
            </div>
          )}

          <button
            onClick={addNewBatch}
            id="add-batch-button"
            className="flex-start btn btn-outline btn-primary btn-md w-full flex-shrink-0 flex-row flex-nowrap  "
          >
            <PlusIcon className="w-5 flex-shrink-0 " />

            <div className="flex flex-row items-center gap-2">
              <p className="">New Batch</p>
            </div>
          </button>
        </div>
      </div>

      <SlidingTransition
        direction="right"
        isVisible={currentScreen === ScreenPath.Description}
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

      {/*
      <SlidingTransition
        direction="right"
        isVisible={currentScreen === ScreenPath.SelectRecipe}
        zIndex={11}
      >
        <RecipeList onBack={navigateToParent} onRecipeSelect={onRecipeSelect} />
      </SlidingTransition>
      {values.recipe && (
        <SlidingTransition
          direction="right"
          isVisible={currentScreen === ScreenPath.RecipeDetail}
          zIndex={11}
        >
          <RecipeDetails onBack={navigateToParent} recipe={values.recipe} />
        </SlidingTransition>
      )} */}
    </>
  )
}

export default ProductDetail
