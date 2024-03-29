/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { z } from 'zod'
import {
  Field,
  FieldProps,
  useFormik,
  FormikProvider,
  FormikErrors,
  FieldArray,
  FieldArrayRenderProps,
} from 'formik'
import { useNavigate } from 'react-router-dom'
import {
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'

import { toast } from 'react-toastify'
import useRecipeFormValue, { RecipeFormValues } from './hooks/useRecipeForm'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import useBoundStore from 'stores/useBoundStore'
import { s } from 'vitest/dist/reporters-5f784f42.js'
import convert, { Measure, Unit } from 'convert-units'
import ImageLoader from 'components/ImageLoader'
import Big from 'big.js'
import QuantityInput from 'components/QuantityInput'
import { toNumber } from 'lodash'
import MeasurementSelect from 'screens/Product/ProductDetail/components/MeasurementSelect'
import { Product, ProductBatchSchema, ProductSoldBy } from 'types/product.types'
import { measurementOptions, pieceMesurement } from 'util/measurement'
import { getActiveBatch } from 'util/products'
import { formatToPeso } from 'util/currency'

enum ScreenPath {
  SelectIngredients = 'select-ingredients',
  SelectOthers = 'select-others',
}
export type RecipeFormRef = {
  submit: () => void
}

type RecipeFormProps = {
  onSubmit?: (values: RecipeFormValues) => void
}

const RecipeForm = (props: RecipeFormProps, ref: Ref<RecipeFormRef>) => {
  const navigate = useNavigate()
  const setRecipeFormValue = useBoundStore((state) => state.setRecipeFormValue)
  const initialValues = useBoundStore((state) => state.recipeFormInitialValue)

  const formValues = useBoundStore((state) => state.recipeFormValue)

  const formik = useFormik<RecipeFormValues>({
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

  useEffect(() => {
    setRecipeFormValue(values)
  }, [setRecipeFormValue, values])

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        const updatedErrors = await validateForm()
        if (updatedErrors && Object.keys(updatedErrors).length > 0) {
          const errorKey = Object.keys(updatedErrors)[0] as keyof NonNullable<
            FormikErrors<RecipeFormValues>
          >
          const errorMessage = updatedErrors[errorKey] as string
          toast.error(errorMessage, {
            autoClose: 500,
          })
        }
        submitForm()
      },
    }),
    [submitForm, validateForm],
  )

  const totalCost = useMemo(() => {
    const materials = [...values.ingredients, ...values.others]

    if (materials.length > 0) {
      return materials.reduce((acc, material) => {
        return new Big(acc).plus(new Big(material.cost)).toNumber()
      }, 0)
    }

    return 0
  }, [values.ingredients, values.others])

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

          {/* Cost and Profit */}
          {[...values.ingredients, ...values.others].length > 0 && (
            <div className="sticky top-[50px] z-[1] flex flex-col gap-4 bg-base-100 py-2 pt-4">
              {/* Cost */}
              <div className="flex w-full flex-row justify-between rounded-md bg-primary p-2 text-right font-bold text-primary-content">
                <p>Cost</p>
                <p>{formatToPeso(totalCost)}</p>
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
            </div>
          )}

          {/* Ingredients */}
          <div className="flex flex-row justify-between">
            <h1>Ingredients/Materials</h1>
            {values.ingredients.length > 0 && (
              <button
                onClick={() => navigate(ScreenPath.SelectIngredients)}
                className="btn btn-ghost btn-sm text-blue-400"
              >
                <PlusIcon className="w-5 " />
                Add
              </button>
            )}
          </div>

          {values.ingredients.length === 0 && (
            <button
              onClick={() => navigate(ScreenPath.SelectIngredients)}
              className="btn btn-square  mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300 "
            >
              <PlusIcon className="w-8 text-success" />
            </button>
          )}

          <FieldArray
            name="ingredients"
            render={({ remove, form, name }) => (
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {form.values.ingredients.map((_: unknown, index: number) => {
                  return (
                    <RecipeMaterialCard
                      key={index}
                      name={name}
                      index={index}
                      form={form}
                      remove={remove}
                    />
                  )
                })}
              </div>
            )}
          />

          {/* Others */}
          <div className="flex flex-row justify-between">
            <h1>Others</h1>
            {values.others.length > 0 && (
              <button
                onClick={() => navigate(ScreenPath.SelectOthers)}
                className="btn btn-ghost btn-sm text-blue-400"
              >
                <PlusIcon className="w-5 " />
                Add
              </button>
            )}
          </div>

          {values.others.length === 0 && (
            <button
              onClick={() => navigate(ScreenPath.SelectOthers)}
              className="btn btn-square  mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300 "
            >
              <PlusIcon className="w-8 text-success" />
            </button>
          )}

          <FieldArray
            name="others"
            render={({ remove, form, name }) => (
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {form.values.others.map((_: unknown, index: number) => {
                  return (
                    <RecipeMaterialCard
                      key={index}
                      name={name}
                      index={index}
                      form={form}
                      remove={remove}
                    />
                  )
                })}
              </div>
            )}
          />

          {/* End of Produt Form */}
        </div>
      </FormikProvider>
    </>
  )
}

type RecipeMaterialCardProps = {
  remove: FieldArrayRenderProps['remove']
  form: FieldArrayRenderProps['form']
  name: string
  index: number
  disabled?: boolean
}

const RecipeMaterialCard = (props: RecipeMaterialCardProps) => {
  const { remove, form, name, index, disabled = false } = props
  const image = form.values.images && form.values.images[0]

  const { values } = form
  const key = `${name}[${index}]`

  const material = form.getFieldMeta(`${name}[${index}]`)
    .value as RecipeFormValues['materials'][number]

  const measurement =
    material.unitOfMeasurement !== 'pieces'
      ? convert().describe(material.unitOfMeasurement as Unit).measure
      : ''

  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {}, [material.cost, material.quantity])

  useEffect(() => {
    // using convertible-units, change the cost per unit base from the values.unitOfMeasurement
    // by converting it
    // then set the cost per unit
  }, [form, values, material])

  const computeCost = (
    quantity: number,
    unitOfMeasurement: string,
    product: Product,
  ) => {
    const activeBatch = getActiveBatch(product.batches)
    if (activeBatch) {
      const cost = product.isBulkCost
        ? toNumber(activeBatch?.costPerUnit ?? 0)
        : toNumber(activeBatch?.cost ?? 0)
      const fromUnit = activeBatch.unitOfMeasurement
      const toUnit = unitOfMeasurement
      // Calculate the conversion factor from the product's unit to the material's unit
      let conversionFactor = 1
      if (product.soldBy === ProductSoldBy.Weight) {
        conversionFactor = convert(1)
          .from(fromUnit as Unit)
          .to(toUnit as Unit)
      }
      const newCostPerUnit = new Big(cost)
        .div(new Big(conversionFactor))
        // .round(2)
        .toNumber()

      const totalCost = new Big(quantity)
        .times(new Big(newCostPerUnit))
        .toNumber()
      setTotalCost(cost)
      return totalCost
    }
  }

  return (
    <div className="container-card relative flex flex-row flex-wrap justify-evenly gap-2">
      <div className="card card-compact w-[155px] border border-gray-300 bg-base-100">
        <figure className="h-[155px] w-[153px] overflow-hidden rounded-t-md bg-gray-300">
          <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
        </figure>
        <div className="card-body flex flex-col  !px-1 !py-2 text-left">
          <h2 className="card-title flex flex-grow items-start  text-sm">
            {material.product.name}
          </h2>

          <Field
            name={`${key}.quantity`}
            validate={(value: number) => {
              const validation = z
                .number({
                  required_error: 'Required',
                })
                .positive('Must be greater than 0')
                .safeParse(toNumber(value))
              if (validation.success === false) {
                console.log(validation.error.issues[0].message)
                return validation.error.issues[0].message
              }
              return null
            }}
          >
            {({ field, form, meta }: FieldProps) => (
              <div className="flex flex-col gap-1 text-xs">
                <QuantityInput
                  value={field.value}
                  onChange={(newValue) => {
                    form.setFieldValue(field.name, newValue)

                    // Side effect
                    const currentMaterial = form.getFieldMeta(
                      `${name}[${index}]`,
                    ).value as RecipeFormValues['materials'][number]
                    const totalCost = computeCost(
                      toNumber(newValue),
                      currentMaterial.unitOfMeasurement,
                      currentMaterial.product,
                    )
                    form.setFieldValue(`${name}[${index}].cost`, totalCost)
                  }}
                  className="w-full"
                />
                {meta.touched && meta.error && (
                  <div className="form-field-error label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {meta.error}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Field>

          <Field
            name={`${key}.unitOfMeasurement`}
            validate={(value: string) => {
              const validation = z
                .string({
                  required_error: 'Measurement is required',
                })
                .safeParse(value)
              if (validation.success === false) {
                console.log(validation.error.issues[0].message)
                return validation.error.issues[0].message
              }
              return null
            }}
          >
            {({ field, form, meta }: FieldProps) => (
              <div>
                {field.value !== 'pieces' && (
                  <MeasurementSelect
                    measurements={[measurement as Measure]}
                    disabled={disabled}
                    value={{
                      label:
                        measurementOptions.find(
                          (option) => option.value === field.value,
                        )?.label || '',
                      value: field.value,
                    }}
                    onChange={(value) => {
                      form.setFieldValue(field.name, value?.value)

                      // Side effect
                      const currentMaterial = form.getFieldMeta(
                        `${name}[${index}]`,
                      ).value as RecipeFormValues['materials'][number]
                      const totalCost = computeCost(
                        toNumber(currentMaterial.quantity),
                        value?.value as string,
                        currentMaterial.product,
                      )

                      form.setFieldValue(`${name}[${index}].cost`, totalCost)
                    }}
                  />
                )}
                {field.value === 'pieces' && (
                  <MeasurementSelect value={pieceMesurement} disabled />
                )}

                {meta.touched && meta.error && (
                  <div className="form-field-error label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {meta.error}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Field>
        </div>

        <button
          className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2 bg-primary"
          onClick={() => remove(index)}
        >
          <TrashIcon className="w-5 text-white" />
        </button>
        <div className="absolute left-0 top-2 max-w-[60%]">
          <div className="w-full truncate bg-primary p-1 text-sm text-primary-content">
            ₱ {totalCost}
          </div>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(RecipeForm)
