/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldConfig, FieldInputProps, FormikErrors } from 'formik'
import React from 'react'
import {
  AddProductDetailSchema,
  ProductDetailFormikValue,
} from '../../ProductDetail.types'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid'
import Big from 'big.js'
import { toNumber } from 'lodash'
import CurrencyInput from 'react-currency-input-field'
import { ProductSoldBy } from 'types/product.types'
import {
  computeProfitAmount,
  computeProfitPercentage,
  profitPercentageColor,
} from 'util/number'
import { getActiveBatch } from 'util/products'
import { v4 } from 'uuid'
import ProductImages from '../ProductImages'
import { useNavigate } from 'react-router-dom'
import { ScreenPath } from '../..'
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
  setIsStockReset: React.Dispatch<React.SetStateAction<boolean>>
  showRecipeList: () => void
}

interface AdditionalProps {
  showDescription: () => void
  defaultValue: AddProductDetailSchema
}

type ProductFormProps = FormikProps & ComponentStateProps & AdditionalProps

const ProductForm: React.FC<ProductFormProps> = ({
  isMutating,
  getFieldProps,
  values,
  errors,
  setFieldValue,
  mode,
  setIsStockReset,
  setValues,
  showDescription,
  defaultValue,
  showRecipeList,
}) => {
  const navigate = useNavigate()
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
      {mode === 'add' && (
        <button
          onClick={showRecipeList}
          disabled={isMutating}
          className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left"
        >
          Create product using a recipe
        </button>
      )}

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
        <div className="mb-2 flex w-full flex-row justify-between rounded-md bg-gray-200 p-2 py-1 text-black ">
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
            decimalsLimit={4}
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
                const newProfitPercentage = computeProfitPercentage(price, cost)
                setFieldValue('profitAmount', newProfitAmount)
                setFieldValue('profitPercentage', newProfitPercentage)
              }

              if (values.trackStock === false || values.isBulkCost === false) {
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

      {/* Price*/}
      {values.forSale && (
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
            <div className="label py-0">
              <span className="label-text-alt text-xs text-red-400">
                {errors.price}&nbsp;
              </span>
            </div>
          </label>
        </div>
      )}

      {/* Profit */}
      {values.forSale && (
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
          <div className="label py-0">
            <span className="label-text-alt text-xs text-red-400">
              {errors.profitAmount}&nbsp;
            </span>
          </div>
        </div>
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

        {errors.name && (
          <div className="label py-0">
            <span className="label-text-alt text-xs text-red-400">
              {errors.name}
            </span>
          </div>
        )}
      </label>

      {/* For Sale */}
      <div className="form-control flex w-full flex-row justify-between py-2">
        <span>I want to use it for Recipe Only</span>
        <input
          {...getFieldProps('forSale')}
          type="checkbox"
          onChange={(e) => {
            setFieldValue('forSale', !e.target.checked)
          }}
          checked={!values.forSale}
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

      {/* Track Stock */}
      <div className="form-control flex w-full flex-row justify-between py-2">
        <span>Track Stock</span>
        <input
          {...getFieldProps('trackStock')}
          type="checkbox"
          onChange={(e) => {
            setFieldValue('trackStock', e.target.checked)
            if (values.trackStock === false && e.target.checked === true) {
              navigate(ScreenPath.StockDetail)
            }
            if (e.target.checked === true) {
              if (mode === 'edit') {
                setIsStockReset(true)
              }
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
          onClick={() => navigate(ScreenPath.StockDetail)}
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
  )
}

export default ProductForm
