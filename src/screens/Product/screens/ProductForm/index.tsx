/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { toNumber } from 'lodash'
import { ProductSoldBy } from 'types/product.types'
import { z } from 'zod'
import {
  ChevronRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PencilIcon,
  PencilSquareIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  Field,
  FieldProps,
  FieldArray,
  FieldArrayRenderProps,
  useFormik,
  FormikProvider,
  FormikErrors,
} from 'formik'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { v4 } from 'uuid'
import {
  computeProfitAmount,
  computeProfitPercentage,
  padWithZeros,
  profitPercentageColor,
} from 'util/number'
import CurrencyInput from 'react-currency-input-field'
import { PIECES } from 'constants copy/measurement'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import { formatToPeso } from 'util/currency'
import Big from 'big.js'

import SlidingTransition from 'components/SlidingTransition'
import CategoryDropdown from 'screens/Product/ProductDetail/components/CategoryDropdown'
import MeasurementSelect from 'screens/Product/ProductDetail/components/MeasurementSelect'
import ProductImages from 'screens/Product/ProductDetail/components/ProductImages'
import useProductFormValue, {
  ProductFormValues,
} from 'screens/Product/hooks/useProductFormValue'
import { measurementOptions, unitAbbrevationsToLabel } from 'util/measurement'
import Description from './Description'
import RecipeList from './RecipeList'
import { toast } from 'react-toastify'
import AdjustmentDialog from 'screens/Product/ProductDetail/components/BatchCard/components/AdjustmentDialog'
import useBoundStore from 'stores/useBoundStore'
import { isExpired } from 'util/data'

export enum ScreenPath {
  Description = 'set-description',
  SelectRecipe = 'select-recipe',
}

export type ProductFormRef = {
  submit: () => void
}

type ProductFormProps = {
  onSubmit?: (values: ProductFormValues) => void
}

const ProductForm = (props: ProductFormProps, ref: Ref<ProductFormRef>) => {
  const navigate = useNavigate()
  const setProductFormValue = useBoundStore(
    (state) => state.setProductFormValue,
  )
  const initialValues = useBoundStore((state) => state.productFormInitialValue)
  const formValues = useBoundStore((state) => state.productFormValue)

  const formik = useFormik<ProductFormValues>({
    initialValues: formValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      props.onSubmit?.(values)
    },
  })

  const {
    values,
    errors,
    touched,
    setFieldValue,
    submitForm,
    validateForm,
    setFieldError,
  } = formik

  const bulkCostHint = values.isBulkCost
    ? 'ON: "Cost" serves as the combined cost of all items in this batch, used to calculate cost per unit.'
    : 'OFF: "Cost" serves as cost per individual unit in this batch.'

  useEffect(() => {
    if (values.batches && values.batches.length === 0) {
      setFieldError(
        'batches',
        'At least one batch is required. Please add one to continue',
      )
    }
  }, [values.batches, errors, setFieldError])

  useEffect(() => {
    setProductFormValue(values)
  }, [setProductFormValue, values])

  const computedCost = useMemo(() => {
    if (values.recipe) {
      return values.recipe.cost
    }

    const activeBatch = values.batches[0]

    if (!activeBatch) {
      return 0
    }

    if (activeBatch) {
      return values.isBulkCost
        ? toNumber(activeBatch.costPerUnit)
        : toNumber(values.currentCost)
    }

    return 0
  }, [values.batches, values.isBulkCost, values.currentCost, values.recipe])

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        const updatedErrors = await validateForm()
        if (updatedErrors && Object.keys(updatedErrors).length > 0) {
          const errorKey = Object.keys(updatedErrors)[0] as keyof NonNullable<
            FormikErrors<ProductFormValues>
          >
          const errorMessage = updatedErrors[errorKey] as string
          if (
            Object.keys(updatedErrors).length === 1 &&
            updatedErrors.batches &&
            Array.isArray(updatedErrors.batches) &&
            updatedErrors.batches[0]
          ) {
            const batchErrorKey = Object.keys(
              updatedErrors.batches[0],
            )[0] as keyof NonNullable<
              FormikErrors<ProductFormValues['batches'][number]>
            >

            const errorMessage =
              typeof updatedErrors.batches !== 'string' &&
              updatedErrors.batches[0] &&
              (updatedErrors.batches[0] as NonNullable<
                FormikErrors<ProductFormValues['batches'][number]>
              >) &&
              (
                updatedErrors.batches[0] as NonNullable<
                  FormikErrors<ProductFormValues['batches'][number]>
                >
              )[batchErrorKey]
            toast.error(`${errorMessage} (${values.batches[0].name})`, {
              autoClose: 700,
            })
          } else {
            toast.error(errorMessage, {
              autoClose: 500,
            })
          }
        }
        submitForm()
      },
    }),
    [submitForm, validateForm, values],
  )

  return (
    <>
      {/* <div className=" w-full bg-black/20"></div> */}
      <FormikProvider value={formik}>
        <div className="flex flex-col gap-2">
          {/* Name */}
          <Field
            name="name"
            validate={(value: string) => {
              const validation = z
                .string({
                  required_error: 'Name is required',
                })
                .min(1, 'Name is required')
                .safeParse(value)
              if (validation.success === false) {
                return validation.error.issues[0].message
              }

              return null
            }}
          >
            {({
              field, // { name, value, onChange, onBlur }
              meta,
            }: FieldProps) => (
              <label className="form-control w-full ">
                <div className="">
                  <span className="label-text-alt text-gray-400">
                    Product Name
                  </span>
                </div>
                <input
                  {...field}
                  autoComplete="off"
                  type="text"
                  placeholder="(e.g., Milk Tea, Coffee, etc.)"
                  className="input input-bordered w-full"
                  tabIndex={1}
                />

                {meta.touched && meta.error && (
                  <div className="form-field-error label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {meta.error}
                    </span>
                  </div>
                )}
              </label>
            )}
          </Field>

          {/* Recipe CTA */}
          {values.mode === 'add' && !values.recipe && (
            <button
              onClick={() => navigate(ScreenPath.SelectRecipe)}
              className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left"
            >
              Use a recipe
            </button>
          )}

          {values.mode === 'add' && values.recipe && (
            <div className="flex flex-row gap-2">
              <button className="btn btn-outline btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left">
                {values.recipe.name}
              </button>
              <button
                onClick={() => {
                  setFieldValue('recipe', undefined)
                  setFieldValue('profitAmount', '')
                  setFieldValue('profitPercentage', '')
                  setFieldValue('batches', [
                    {
                      id: v4(),
                      name: `Batch #${padWithZeros(1)}`,
                      cost: '',
                      costPerUnit: 0,
                      quantity: '',
                      unitOfMeasurement: PIECES,
                      isDeducted: false,
                      expirationDate: null,
                    },
                  ])
                }}
                className="btn btn-outline btn-primary btn-xs"
              >
                <TrashIcon className="w-3" />
              </button>
            </div>
          )}

          {values.mode === 'edit' && values.recipe && (
            <div className="flex flex-row gap-2">
              <button className="btn btn-outline btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left">
                Recipe used: {values.recipe.name}
              </button>
            </div>
          )}

          {/* Set Description CTA */}
          <Link
            to={ScreenPath.Description}
            preventScrollReset
            className="flex-start btn btn-ghost btn-xs w-full flex-shrink-0 flex-row flex-nowrap justify-between px-0"
          >
            <p className="text-overflow-ellipsis overflow-hidden truncate whitespace-nowrap break-words text-left">
              <span className="text-gray-400">
                {values.description === '' && 'Add Description'}
                {values.description}
              </span>
            </p>
            <ChevronRightIcon className="w-5 flex-shrink-0 text-secondary" />
          </Link>

          {/* For Recipe purpose Toggle */}
          {!values.recipe && (
            <Field name="isIngredient">
              {({ field, form }: FieldProps) => (
                <div className="form-control flex w-full flex-row gap-2 ">
                  <input
                    {...field}
                    checked={field.value}
                    autoComplete="off"
                    type="checkbox"
                    className="toggle toggle-primary"
                    disabled={values.mode === 'edit'}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.checked)

                      // Side effects
                      form.setFieldValue('currentCost', '')
                      form.setFieldValue('price', '')
                      form.setFieldValue('profitAmount', '')
                      form.setFieldValue('profitPercentage', '')
                      form.setFieldValue(
                        'batches',
                        form.values.batches.map(
                          (batch: ProductFormValues['batches']) => {
                            return {
                              ...batch,
                              cost: '',
                              costPerUnit: 0,
                            }
                          },
                        ),
                      )
                    }}
                  />
                  <span>For ingredients purposes only</span>
                </div>
              )}
            </Field>
          )}

          {/* Current Cost */}
          {!values.recipe &&
            values.isIngredient === false &&
            values.isBulkCost === false && (
              <Field
                name="currentCost"
                validate={(value: string) => {
                  if (values.isIngredient) {
                    return
                  }
                  if (!values.isIngredient || !values.isBulkCost) {
                    if (value === '') {
                      return 'Cost is required'
                    }
                    const validation = z
                      .number({
                        required_error: 'Cost is required',
                        invalid_type_error: 'Cost must be a number',
                      })
                      .nonnegative('Cost must be a positive number')
                      .safeParse(toNumber(value))
                    if (validation.success === false) {
                      console.log(validation.error.issues[0].message)
                      return validation.error.issues[0].message
                    }
                    return null
                  }

                  return null
                }}
              >
                {({ field, form, meta }: FieldProps) => (
                  <label className="form-control">
                    <div className="">
                      <span className="label-text-alt text-gray-400">Cost</span>
                    </div>
                    <CurrencyInput
                      // {...field}
                      autoComplete="off"
                      decimalsLimit={4}
                      prefix="₱"
                      type="text"
                      tabIndex={3}
                      className="input input-bordered w-full"
                      placeholder="₱0"
                      inputMode="decimal"
                      value={field.value}
                      onValueChange={async (value) => {
                        form.setFieldValue(field.name, value ?? '')

                        // Side effects
                        if (form.values.isBulkCost === false) {
                          setFieldValue(
                            'batches',
                            form.values.batches.map(
                              (batch: ProductFormValues['batches']) => {
                                return {
                                  ...batch,
                                  cost: value,
                                }
                              },
                            ),
                          )
                        }
                      }}
                    />
                    {meta.touched && meta.error && (
                      <div className="form-field-error label py-0">
                        <span className="label-text-alt text-xs text-red-400">
                          {meta.error}
                        </span>
                      </div>
                    )}
                  </label>
                )}
              </Field>
            )}

          {/* Bulk Cost */}
          {values.isBulkCost && (
            <div>
              <div className="my-1 flex w-full flex-row justify-between rounded-md bg-gray-200 p-2 py-1  ">
                <p className="font-bold">Cost:</p>
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <p className="font-bold">
                      {getBulkCost(values.overAllMeasurement, values.batches)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Cost from Recipe */}
          {values.recipe && (
            <div>
              <div className="my-1 flex w-full flex-row justify-between rounded-md bg-gray-200 p-2 py-1  ">
                <p className="font-bold">Cost:</p>
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <p className="font-bold">
                      {formatToPeso(values.recipe.cost)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          {values.isIngredient === false && (
            <Field
              name="price"
              validate={(value: string) => {
                if (values.isIngredient) {
                  return
                }
                if (!values.isIngredient || values.recipe) {
                  if (value === '') {
                    return 'Price is required'
                  }
                  const validation = z
                    .number({
                      required_error: 'Price is required',
                      invalid_type_error: 'Price must be a number',
                    })
                    .nonnegative('Price must be a positive number')
                    .safeParse(toNumber(value))
                  if (validation.success === false) {
                    console.log(validation.error.issues[0].message)
                    return validation.error.issues[0].message
                  }
                  return null
                }

                return null
              }}
            >
              {({
                field, // { name, value, onChange, onBlur }
                form,
                meta,
              }: FieldProps) => (
                <label className="form-control">
                  <div className="">
                    <span className="label-text-alt text-gray-400">Price</span>
                  </div>
                  <CurrencyInput
                    autoComplete="off"
                    decimalsLimit={4}
                    prefix="₱"
                    type="text"
                    tabIndex={3}
                    className="input input-bordered w-full"
                    placeholder="₱0"
                    inputMode="decimal"
                    value={field.value}
                    onValueChange={async (value) => {
                      form.setFieldValue(field.name, value ?? '')

                      // Side Effects
                      const cost = computedCost
                      const newPrice = toNumber(value)
                      const newProfitAmount = computeProfitAmount(
                        newPrice,
                        cost,
                      )
                      const newProfitPercentage = computeProfitPercentage(
                        newPrice,
                        cost,
                      )

                      form.setFieldValue(
                        'profitAmount',
                        toNumber(newProfitAmount),
                      )
                      form.setFieldValue(
                        'profitPercentage',
                        toNumber(newProfitPercentage),
                      )
                    }}
                  />
                  {meta.touched && meta.error && (
                    <div className="form-field-error label py-0">
                      <span className="label-text-alt text-xs text-red-400">
                        {meta.error}
                      </span>
                    </div>
                  )}
                </label>
              )}
            </Field>
          )}

          {/* Profit */}
          {values.isIngredient === false && (
            <div className="form-control">
              <div className="">
                <span className="label-text-alt text-gray-400">Profit</span>
              </div>
              <div className="form-control input input-bordered relative flex flex-row items-center">
                <Field
                  name="profitPercentage"
                  validate={(value: string) => {
                    if (values.isIngredient) {
                      return
                    }
                    if (!values.isIngredient || !values.isBulkCost) {
                      if (value === '') {
                        return 'Profit % is required'
                      }
                      const validation = z
                        .number({
                          required_error: 'Profit % is required',
                          invalid_type_error: 'Profit % must be a number',
                        })
                        .nonnegative('Profit must be a positive number')
                        .safeParse(toNumber(value))
                      if (validation.success === false) {
                        console.log(validation.error.issues[0].message)
                        return validation.error.issues[0].message
                      }
                      return null
                    }

                    return null
                  }}
                >
                  {({ field, form }: FieldProps) => (
                    <CurrencyInput
                      autoComplete="off"
                      decimalsLimit={4}
                      placeholder="70"
                      type="text"
                      tabIndex={4}
                      disableGroupSeparators={true}
                      inputMode="decimal"
                      className={[
                        'input w-1/2 border-none bg-transparent px-0 text-left focus:outline-none',
                        profitPercentageColor(field.value ?? 0),
                      ].join(' ')}
                      onBlur={field.onBlur}
                      name={field.name}
                      value={field.value}
                      onValueChange={async (value) => {
                        form.setFieldValue(field.name, value)

                        // Side effects
                        const newProfitPercentage = toNumber(value)
                        const cost = computedCost

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

                        form.setFieldValue('price', newPrice)
                        await form.setFieldValue(
                          'profitAmount',
                          newProfitAmount,
                        )
                        if (values.recipe) {
                          await setFieldValue(
                            'batches.0.cost',
                            values.recipe.cost,
                          )
                        }
                      }}
                    />
                  )}
                </Field>

                <p className="border-r-[1.5px] border-gray-300 px-2">%</p>
                <Field
                  name="profitAmount"
                  validate={(value: string) => {
                    if (values.isIngredient) {
                      return
                    }
                    if (!values.isIngredient || !values.isBulkCost) {
                      if (value === '') {
                        return 'Profit is required'
                      }
                      const validation = z
                        .number({
                          required_error: 'Profit is required',
                          invalid_type_error: 'Profit must be a number',
                        })
                        .nonnegative('Profit must be a positive number')
                        .safeParse(toNumber(value))
                      if (validation.success === false) {
                        console.log(validation.error.issues[0].message)
                        return validation.error.issues[0].message
                      }
                      return null
                    }

                    return null
                  }}
                >
                  {({ field, form }: FieldProps) => (
                    <CurrencyInput
                      {...field}
                      autoComplete="off"
                      decimalsLimit={4}
                      prefix="₱"
                      type="text"
                      tabIndex={5}
                      className={`input w-full border-none bg-transparent px-0 pl-2 focus:outline-none`}
                      placeholder="₱0"
                      inputMode="decimal"
                      name={field.name}
                      value={field.value}
                      onChange={undefined}
                      onValueChange={async (value) => {
                        form.setFieldValue(field.name, value)

                        // Side effects
                        const newProfitAmount = toNumber(value)
                        const cost = computedCost
                        const newPrice = new Big(cost)
                          .plus(new Big(newProfitAmount))
                          .toNumber()
                        const newProfitPercentage = computeProfitPercentage(
                          newPrice,
                          cost,
                        )

                        await form.setFieldValue('price', newPrice)
                        await form.setFieldValue(
                          'profitPercentage',
                          newProfitPercentage,
                        )
                        if (values.recipe) {
                          await form.setFieldValue(
                            'batches.0.cost',
                            values.recipe.cost,
                          )
                        }
                      }}
                    />
                  )}
                </Field>
              </div>
              {((touched.profitAmount && errors.profitAmount) ||
                (touched.profitPercentage && errors.profitPercentage)) && (
                <div className="form-field-error label py-0">
                  <span className="label-text-alt text-xs text-red-400">
                    {errors.profitAmount || errors.profitPercentage}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Category */}
          <Field name="category">
            {({ field, form }: FieldProps) => (
              <label className="form-control w-full ">
                <div className=" ">
                  <span className="label-text-alt text-gray-400">Category</span>
                </div>
                <CategoryDropdown
                  value={field.value}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
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
            )}
          </Field>

          {/* Images */}
          <div className="py-4">
            <ProductImages
              onImagesChange={(images) => {
                setFieldValue('images', images)
              }}
              images={values.images ?? []}
            />
          </div>

          {/* For Recipe purpose Toggle */}
          <Field name="allowBackOrder">
            {({ field }: FieldProps) => (
              <div className="form-control flex w-full flex-row gap-2 ">
                <input
                  {...field}
                  checked={field.value}
                  autoComplete="off"
                  type="checkbox"
                  className="toggle toggle-primary"
                />
                <span>Allow selling when out of stock</span>
              </div>
            )}
          </Field>

          {/* Soldy By */}
          {!values.recipe && (
            <>
              <p>Use/Sell By:</p>
              <div className="bg-gray-100  p-2">
                <div className="form-control ">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      autoComplete="off"
                      type="radio"
                      className="radio-primary radio"
                      name="soldBy"
                      value={ProductSoldBy.Pieces}
                      checked={values.soldBy === ProductSoldBy.Pieces}
                      disabled={values.mode === 'edit'}
                      onChange={(e) => {
                        setFieldValue('soldBy', e.target.value)

                        // Side effects
                        if (e.target.checked) {
                          setFieldValue(
                            'batches',
                            values.batches.map((batch) => {
                              return {
                                ...batch,
                                unitOfMeasurement: PIECES,
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
                      autoComplete="off"
                      type="radio"
                      className="radio-primary radio"
                      name="soldBy"
                      value={ProductSoldBy.Weight}
                      checked={values.soldBy === ProductSoldBy.Weight}
                      disabled={values.mode === 'edit'}
                      onChange={(e) => {
                        setFieldValue('soldBy', e.target.value)

                        // Side effects
                        setFieldValue('overAllMeasurement', 'g')
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
                      <span className="label-text-alt ">
                        Unit of Measurement
                      </span>
                    </div>
                    <MeasurementSelect
                      disabled={values.mode === 'edit'}
                      value={{
                        label:
                          measurementOptions.find(
                            (option) =>
                              option.value === values.overAllMeasurement,
                          )?.label || '',
                        value: values.overAllMeasurement ?? '',
                      }}
                      onChange={(value) => {
                        if (!value) {
                          return
                        }
                        setFieldValue('overAllMeasurement', value?.value)
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
            </>
          )}

          {/* Bulk Cost Toggle */}
          {!values.recipe && (
            <Field
              name="isBulkCost"
              validate={(value: string) => {
                if (values.isIngredient) {
                  return
                }
                if (!values.isIngredient || !values.isBulkCost) {
                  if (value === '') {
                    return 'Profit is required'
                  }
                  const validation = z
                    .number({
                      required_error: 'Profit is required',
                      invalid_type_error: 'Profit must be a number',
                    })
                    .nonnegative('Profit must be a positive number')
                    .safeParse(toNumber(value))
                  if (validation.success === false) {
                    console.log(validation.error.issues[0].message)
                    return validation.error.issues[0].message
                  }
                  return null
                }

                return null
              }}
            >
              {({ field, form }: FieldProps) => (
                <>
                  <div className="flex w-full flex-row items-center justify-between">
                    <p className="flex flex-grow flex-row items-center gap-2">
                      Batches:
                    </p>

                    <div className="form-control ml-auto flex w-auto flex-row gap-3  ">
                      <span>Bulk Cost</span>
                      <div className="flex flex-row gap-2">
                        <input
                          {...field}
                          checked={field.value}
                          autoComplete="off"
                          type="checkbox"
                          className="toggle toggle-primary"
                          disabled={values.mode === 'edit'}
                          onChange={(e) => {
                            form.setFieldValue(field.name, e.target.checked)

                            // Side effects
                            form.setFieldValue(
                              'batches',
                              form.values.batches.map(
                                (batch: ProductFormValues['batches']) => {
                                  return {
                                    ...batch,
                                    cost: '',
                                  }
                                },
                              ),
                            )
                          }}
                        />
                        <div
                          className="tooltip tooltip-left before:max-w-[200px] before:text-left "
                          data-tip={bulkCostHint}
                        >
                          <InformationCircleIcon className="bulk-cost-tip w-6 text-neutral" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs">
                    Batches are like individual containers for your stock, each
                    marked with its own arrival date, cost, quantity, and
                    expiration.
                  </p>
                </>
              )}
            </Field>
          )}

          {/* Add Batches*/}
          {!values.recipe && values.mode === 'add' && (
            <FieldArray
              name="batches"
              render={({ push, remove, form, name }) => (
                <>
                  {form.values.batches.map((_: unknown, index: number) => {
                    return (
                      <BatchItem
                        key={index}
                        name={name}
                        index={index}
                        form={form}
                        remove={remove}
                      />
                    )
                  })}
                  {errors.batches && typeof errors.batches === 'string' && (
                    <div className="alert my-4 rounded-sm text-sm text-base-content/50">
                      {errors.batches}
                    </div>
                  )}
                  <button
                    onClick={() =>
                      push({
                        id: v4(),
                        name: createBatchName(form.values.batches),
                        cost: form.values.isBulkCost
                          ? ''
                          : form.values.currentCost,
                        costPerUnit: 0,
                        quantity: '',
                        unitOfMeasurement: form.values.overAllMeasurement,
                        isDeducted: false,
                        expirationDate: null,
                      })
                    }
                    id="add-batch-button"
                    className="flex-start btn btn-outline btn-primary btn-md w-full flex-shrink-0 flex-row flex-nowrap  "
                  >
                    <PlusIcon className="w-5 flex-shrink-0 " />

                    <div className="flex flex-row items-center gap-2">
                      <p className="">New Batch</p>
                    </div>
                  </button>
                </>
              )}
            />
          )}

          {/* Edit Batches*/}
          {!values.recipe && values.mode === 'edit' && (
            <FieldArray
              name="batches"
              render={({ push, remove, form, name }) => {
                const originalBatchesId = initialValues.batches.map(
                  (batch: ProductFormValues['batches'][number]) => batch.id,
                )
                return (
                  <>
                    {form.values.batches.map((_: unknown, index: number) => {
                      const isDisabled = originalBatchesId.includes(
                        form.values.batches[index].id,
                      )
                      return (
                        <BatchItem
                          disabled={isDisabled}
                          key={index}
                          name={name}
                          index={index}
                          form={form}
                          remove={remove}
                        />
                      )
                    })}
                    {errors.batches && typeof errors.batches === 'string' && (
                      <div className="alert my-4 rounded-sm text-sm text-base-content/50">
                        {errors.batches}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        let cost = ''

                        if (
                          !values.recipe &&
                          values.isIngredient === false &&
                          values.isBulkCost === false
                        ) {
                          cost = form.values.currentCost
                        }
                        push({
                          id: v4(),
                          name: createBatchName(form.values.batches),
                          cost,
                          costPerUnit: 0,
                          quantity: '',
                          unitOfMeasurement: form.values.overAllMeasurement,
                          isDeducted: false,
                          expirationDate: null,
                        })
                      }}
                      id="add-batch-button"
                      className="flex-start btn btn-outline btn-primary btn-md w-full flex-shrink-0 flex-row flex-nowrap  "
                    >
                      <PlusIcon className="w-5 flex-shrink-0 " />

                      <div className="flex flex-row items-center gap-2">
                        <p className="">New Batch</p>
                      </div>
                    </button>
                  </>
                )
              }}
            />
          )}

          {/* Stock Warning */}
          <Field name="stockWarning">
            {({ field, form }: FieldProps) => (
              <label className="form-control mt-4 w-full ">
                <p className="">Low stock warning level</p>
                <p className="label-text-alt  text-gray-400">
                  Receive a notification when stock reaches this level
                </p>
                <div className="join w-full">
                  <CurrencyInput
                    {...field}
                    autoComplete="off"
                    decimalsLimit={4}
                    type="text"
                    className="input join-item input-bordered w-full"
                    inputMode="decimal"
                    placeholder="Quantity (Optional)"
                    onChange={undefined}
                    value={field.value}
                    onValueChange={(value) => {
                      form.setFieldValue(field.name, value)
                    }}
                  />
                  <div className="indicator">
                    <button className="btn join-item no-animation">
                      {unitAbbrevationsToLabel(form.values.overAllMeasurement)}
                    </button>
                  </div>
                </div>
              </label>
            )}
          </Field>

          {values.recipe && (
            <div className="RecipeDetail my-4 flex flex-col gap-4 rounded-md bg-gray-200 p-4">
              <div className="flex flex-row items-center justify-start gap-4">
                Quantity
                <button className="btn no-animation w-auto flex-grow">
                  {values.recipe.quantity}
                </button>
              </div>
              <div className="grid grid-cols-12 gap-2">
                {values.recipe.materials.map((material, index) => {
                  const { name } = material.product
                  let totalQuantity = material.product.totalQuantity
                  if (
                    material.product.outOfStock &&
                    material.product.allowBackOrder
                  ) {
                    totalQuantity = material.product.batches.reduce(
                      (acc, batch) => acc + batch.quantity,
                      0,
                    )
                  }
                  const image = material.product.images?.[0]
                  const productMeasurement =
                    material.product.soldBy === ProductSoldBy.Weight
                      ? material.product.activeBatch?.unitOfMeasurement
                      : 'pcs'
                  // const materialMeasurement =
                  //   material.product.soldBy === ProductSoldBy.Weight
                  //     ? material.unitOfMeasurement
                  //     : 'pcs'
                  return (
                    <div key={index} className="col-span-3 flex flex-col gap-2">
                      {/* {image && <image className="h-6 w-6" src={image} />} */}
                      {image && (
                        <img className="mx-auto h-10 w-10" src={image} />
                      )}
                      {!image && (
                        <div className="mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-md bg-gray-300">
                          <PhotoIcon className="w-3" />
                        </div>
                      )}
                      <p className="text-center text-xs font-bold ">{name}</p>
                      <p className="text-center text-xs">
                        {material.quantity}/{totalQuantity} {productMeasurement}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* End of Produt Form */}
        </div>

        {/* <pre className="text-[10px]">{JSON.stringify(values, null, 2)}</pre> */}
      </FormikProvider>
      <Routes>
        <Route path={`${ScreenPath.Description}/*`} element={<Description />} />
        <Route path={`${ScreenPath.SelectRecipe}/*`} element={<RecipeList />} />
      </Routes>
    </>
  )
}

type BatchItemProps = {
  remove: FieldArrayRenderProps['remove']
  form: FieldArrayRenderProps['form']
  name: string
  index: number
  disabled?: boolean
}

const BatchItem = (props: BatchItemProps) => {
  const { remove, form, name, index, disabled = false } = props
  const { values } = form
  const key = `${name}[${index}]`

  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false)

  const batch = form.getFieldMeta(`${name}[${index}]`)
    .value as ProductFormValues['batches'][number]

  if (!batch) {
    return null
  }

  const costPerUnitStyling =
    (batch.costPerUnit ?? 0) > 0 ? 'text-green-400' : 'text-base-content/50'

  return (
    <>
      {showAdjustmentDialog && (
        <AdjustmentDialog
          productId={form.values.id}
          batch={batch}
          onClose={() => setShowAdjustmentDialog(false)}
        />
      )}
      <div className="mb-2 flex flex-col gap-2 rounded-lg border border-neutral/30 p-2 py-4">
        {isExpired(batch.expirationDate) && (
          <div className="alert-sm alert alert-warning flex flex-row justify-start gap-2 rounded-md p-1 text-xs text-warning-content">
            <ExclamationTriangleIcon className="w-4" />
            This batch is expired{' '}
          </div>
        )}
        {/* Name */}
        <Field name={`${key}.name`}>
          {({ field }: FieldProps) => (
            <p className="flex flex-row items-center gap-2 text-sm uppercase tracking-wider">
              {field.value}
              {disabled === false && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="w-5 text-primary" />
                </button>
              )}
              {disabled === true && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => {
                    setShowAdjustmentDialog(true)
                  }}
                >
                  <PencilSquareIcon className="w-5 text-primary" />
                </button>
              )}
            </p>
          )}
        </Field>

        {/* Quantity */}
        <Field
          name={`${key}.quantity`}
          validate={(value: string) => {
            if (value)
              if (value === '') {
                return 'Quantity is required'
              }
            const validation = z
              .number({
                required_error: 'Quantity is required',
              })
              .nonnegative('Quantity must be a positive number')
              .safeParse(toNumber(value))
            if (validation.success === false) {
              console.log(validation.error.issues[0].message)
              return validation.error.issues[0].message
            }
            return null
          }}
        >
          {({
            field, // { name, value, onChange, onBlur }
            form,
            meta,
          }: FieldProps) => (
            <label className="form-control">
              <p>Quantity</p>
              <CurrencyInput
                // {...field}
                autoComplete="off"
                decimalsLimit={4}
                type="text"
                tabIndex={3}
                className="input input-bordered w-full"
                placeholder="Enter Batch Quantity"
                inputMode="decimal"
                value={field.value}
                disabled={disabled}
                onValueChange={async (value) => {
                  form.setFieldValue(field.name, value ?? '')

                  // Side effect
                  if (values.isBulkCost) {
                    form.setFieldValue(
                      `${key}.costPerUnit`,
                      computeCostPerUnit(toNumber(batch.cost), toNumber(value)),
                    )
                  }
                }}
              />
              {meta.touched && meta.error && (
                <div className="form-field-error label py-0">
                  <span className="label-text-alt text-xs text-red-400">
                    {meta.error}
                  </span>
                </div>
              )}
            </label>
          )}
        </Field>

        {/* Cost / Bulk Cost */}
        {/* Show only when isForSale  */}
        {(values.isIngredient || values.isBulkCost) && (
          <Field
            name={`${key}.cost`}
            validate={(value: string) => {
              if (values.isIngredient || values.isBulkCost) {
                if (value === '') {
                  return 'Cost is required'
                }
                const validation = z
                  .number({
                    required_error: 'Cost is required',
                    invalid_type_error: 'Cost must be a number',
                  })
                  .nonnegative('Cost must be a positive number')
                  .safeParse(toNumber(value))
                if (validation.success === false) {
                  return validation.error.issues[0].message
                }
                return null
              }

              return null
            }}
          >
            {({ field, form, meta }: FieldProps) => (
              <label className="form-control">
                <p className="">{values.isIngredient ? 'Cost' : 'Bulk Cost'}</p>
                <p className="label-text-alt text-gray-400">
                  {values.isBulkCost
                    ? 'Enter amount spent to purchase this batch'
                    : 'Enter the cost for each individual item in this batch '}
                </p>
                <CurrencyInput
                  autoComplete="off"
                  decimalsLimit={4}
                  prefix="₱"
                  type="text"
                  tabIndex={3}
                  className="input input-bordered w-full"
                  placeholder="₱0"
                  inputMode="decimal"
                  value={field.value}
                  disabled={disabled}
                  onValueChange={async (value) => {
                    form.setFieldValue(field.name, value ?? '')

                    // Side effect
                    if (values.isBulkCost) {
                      form.setFieldValue(
                        `${key}.costPerUnit`,
                        computeCostPerUnit(
                          toNumber(value),
                          toNumber(batch.quantity),
                        ),
                      )
                    }
                  }}
                />
                {meta.touched && meta.error && (
                  <div className="form-field-error label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {meta.error}
                    </span>
                  </div>
                )}
              </label>
            )}
          </Field>
        )}

        {form.values && form.values.isBulkCost === true && (
          <p className={['text-sm', costPerUnitStyling].join(' ')}>
            {formatToPeso(batch.costPerUnit ?? 0)}/
            {form.values.overAllMeasurement}
          </p>
        )}

        {/* Expiration Date*/}
        <Field
          name={`${key}.expirationDate`}
          validate={(value: string) => {
            const validation = z
              .date({
                coerce: true,
                invalid_type_error: 'Expiration must be a date',
              })
              .optional()
              .safeParse(value)
            if (validation.success === false) {
              console.log(validation.error.issues[0].message)
              return validation.error.issues[0].message
            }
            return null
          }}
        >
          {({
            field, // { name, value, onChange, onBlur }
            form,
            meta,
          }: FieldProps) => (
            <label className="form-control">
              <div className="">
                <span className=" ">Expiration(Optional)</span>
              </div>
              <div className={`ExpirationDatePicker flex flex-row gap-1`}>
                <DatePicker
                  disabled={disabled}
                  disablePast
                  sx={{
                    width: '100%',
                    ':disabled': { backgroundColor: '#000' },
                  }}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      color: 'secondary',
                      className: '',
                      placeholder:
                        disabled === true ? 'N/A' : 'Expiration Date',
                    },
                    actionBar: {
                      actions: ['clear', 'accept', 'cancel'],
                    },
                  }}
                  value={field.value ? moment(field.value, 'YYYY-MM-DD') : null}
                  onAccept={(date) => {
                    form.setFieldValue(field.name, date ?? null)
                  }}
                  className={`border-none outline-none`}
                />
              </div>
              {meta.touched && meta.error && (
                <div className="form-field-error label py-0">
                  <span className="label-text-alt text-xs text-red-400">
                    {meta.error}
                  </span>
                </div>
              )}
            </label>
          )}
        </Field>
      </div>
    </>
  )
}

// NOTE: This only for Add Prdouct, as we consider the first batch as the active batch
const getBulkCost = (
  measurement: string,
  batches: ProductFormValues['batches'],
) => {
  if (batches.length === 0) {
    return `${formatToPeso(0)}/${measurement}`
  }

  return `${formatToPeso(toNumber(batches[0].costPerUnit))}/${measurement}`
}

const createBatchName = (batches: ProductFormValues['batches']) => {
  if (batches.length === 0) {
    return `Batch #${padWithZeros(1)}`
  }

  const getLastBatch = batches[batches.length - 1]
  const lastBatchNumber = Number(getLastBatch.name.split('#')[1])

  return `Batch #${padWithZeros(lastBatchNumber + 1)}`
}

const computeCostPerUnit = (cost: number, quantity: number) => {
  if (quantity === 0) {
    return 0
  }
  return new Big(cost).div(quantity).round(4).toNumber()
}

export default forwardRef(ProductForm)
