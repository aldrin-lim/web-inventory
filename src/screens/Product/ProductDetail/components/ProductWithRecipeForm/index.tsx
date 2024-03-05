/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldConfig, FieldInputProps, FormikErrors } from 'formik'
import React from 'react'
import {
  AddProductDetailSchema,
  ProductDetailFormikValue,
} from '../../ProductDetail.types'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Big from 'big.js'
import { toNumber } from 'lodash'
import CurrencyInput from 'react-currency-input-field'
import {
  computeProfitAmount,
  computeProfitPercentage,
  profitPercentageColor,
} from 'util/number'
import { getActiveBatch } from 'util/products'
import ProductImages from '../ProductImages'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import CategoryDropdown from '../CategoryDropdown'

interface FormikProps {
  getFieldProps: (
    nameOrOptions: string | FieldConfig<any>,
  ) => FieldInputProps<any>
  values: ProductDetailFormikValue
  errors: FormikErrors<ProductDetailFormikValue>
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void> | Promise<FormikErrors<ProductDetailFormikValue>>
  setValues: (
    values: React.SetStateAction<ProductDetailFormikValue>,
    shouldValidate?: boolean,
  ) => Promise<FormikErrors<ProductDetailFormikValue>> | Promise<void>
}

interface ComponentStateProps {
  isMutating: boolean
  mode: string
}

interface AdditionalProps {
  showDescription: () => void
  defaultValue: AddProductDetailSchema
  removeRecipe: () => void
  showRecipeDetail: () => void
}

type ProductWithRecipeFormProps = FormikProps &
  ComponentStateProps &
  AdditionalProps

const ProductWithRecipeForm: React.FC<ProductWithRecipeFormProps> = ({
  isMutating,
  getFieldProps,
  values,
  errors,
  setFieldValue,
  mode,
  showDescription,
  removeRecipe,
  showRecipeDetail,
}) => {
  return (
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
      <div className="flex flex-row gap-2">
        <p>You used a recipe</p>
        {mode === 'add' && (
          <>
            <button
              disabled={isMutating}
              onClick={removeRecipe}
              className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left"
            >
              <span className="text-xs">Remove Recipe</span>
            </button>
            <button
              disabled={isMutating}
              className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left"
            >
              <InformationCircleIcon className="w-4" />
            </button>
          </>
        )}
        {mode === 'edit' && (
          <button
            disabled={isMutating}
            onClick={showRecipeDetail}
            className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left"
          >
            <span className="text-xs">View Recipe</span>
            <InformationCircleIcon className="w-4" />
          </button>
        )}
      </div>
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

      {/* Cost per Unit */}
      <div className="mb-2 flex w-full flex-row justify-between rounded-md bg-gray-200 p-2 py-1 text-black ">
        <p className="font-bold">Cost:</p>
        <div className="flex flex-row">
          <p className="font-bold">
            ₱ {new Big(values.recipe?.cost ?? 0).toNumber()}
          </p>
        </div>
      </div>

      {/* Price and Profit */}
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
              const cost = values.isBulkCost
                ? toNumber(getActiveBatch(values.batches).costPerUnit)
                : toNumber(values.cost)
              const newProfitAmount = computeProfitAmount(newPrice, cost)
              const newProfitPercentage = computeProfitPercentage(
                newPrice,
                cost,
              )
              setFieldValue('profitAmount', toNumber(newProfitAmount))
              setFieldValue('profitPercentage', toNumber(newProfitPercentage))
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
              profitPercentageColor(values.profitPercentage),
            ].join(' ')}
            onValueChange={(value) => {
              setFieldValue('profitPercentage', value)
              const newProfitPercentage = toNumber(value)
              const cost = values.isBulkCost
                ? toNumber(getActiveBatch(values.batches).costPerUnit)
                : toNumber(values.cost)
              // const newPrice = cost * (1 + newProfitPercentage / 100)
              const newPrice = new Big(cost)
                .times(new Big(1).plus(new Big(newProfitPercentage).div(100)))
                .toNumber()
              const newProfitAmount = computeProfitAmount(newPrice, cost)

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
              const cost = values.isBulkCost
                ? toNumber(getActiveBatch(values.batches).costPerUnit)
                : toNumber(values.cost)

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

      {/* Category */}
      <label className="form-control w-full ">
        <div className=" ">
          <span className="label-text-alt text-gray-400">Category</span>
        </div>
        <CategoryDropdown
          value={values.category}
          onChange={(option) => setFieldValue('category', option?.value)}
        />

        {errors.category && (
          <div className="label py-0">
            <span className="label-text-alt text-xs text-red-400">
              {errors.category}
            </span>
          </div>
        )}
      </label>

      {/* For Sale */}
      <div className="form-control flex w-full flex-row justify-between py-2">
        <span>Allow selling when out of stock</span>
        <input
          {...getFieldProps('allowBackOrder')}
          checked={values.allowBackOrder}
          type="checkbox"
          className="toggle toggle-primary"
        />
      </div>

      {/* Images */}
      <ProductImages
        disabled={isMutating}
        onImagesChange={(images) => {
          setFieldValue('images', images)
        }}
        images={values.images ?? []}
      />

      <div className="mt-2 flex flex-col gap-4 rounded-md bg-gray-200 p-4">
        <div className="flex flex-row items-center gap-6">
          <p>Quantity</p>
          <div className="w-full rounded-md bg-gray-300 p-1 text-center">
            {values.recipe?.quantity}
          </div>
        </div>
        <div className="hint text-primary">
          Quantity is auto-calculated based on recipe&apos;s available crafting
          materials in your inventory.
        </div>
      </div>
    </div>
  )
}

export default ProductWithRecipeForm
