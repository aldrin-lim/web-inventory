import QuantityInput from 'components/QuantityInput'
import { FormikErrors } from 'formik'
import CurrencyInput from 'react-currency-input-field'
import { ProductBatchSchema, ProductSoldBy } from 'types/product.types'
import { z } from 'zod'
import { useEffect, useMemo, useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import Big from 'big.js'
import { ProductAction } from '../..'
import { DatePicker } from '@mui/x-date-pickers'

import './styles.css'
import moment from 'moment'
import AdjustmentDialog from './components/AdjustmentDialog'

const BatchSchema = ProductBatchSchema.partial({ id: true })

type BatchCardProps = {
  batch: z.infer<typeof BatchSchema>
  soldBy: ProductSoldBy
  isBulkCost?: boolean
  onChange?: (batch: z.infer<typeof BatchSchema>) => void
  onRemove?: (batchId: string) => void
  disabled?: boolean
  active?: boolean
  forSale?: boolean
  computeCostPerUnit?: boolean
  mode?: ProductAction
  error?: FormikErrors<{
    id: string
    name: string
    cost: number
    quantity: number
    unitOfMeasurement: string
    expirationDate: Date | null
    costPerUnit?: number | undefined
  }>
  productId: string
}

const BatchCard = (props: BatchCardProps) => {
  const {
    batch,
    isBulkCost = false,
    onRemove,
    active = false,
    error,
    forSale,
    disabled,
    productId,
    onChange,
  } = props

  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false)

  const [quantity, setQuantity] = useState(batch.quantity)

  useEffect(() => {
    setQuantity(batch.quantity)
  }, [batch.quantity])

  const values = batch

  const costPerUnit = useMemo(() => {
    try {
      if (disabled) {
        return isBulkCost ? values.costPerUnit ?? 0 : values.cost ?? 0
      }
      if (values.isDeducted) {
        return isBulkCost ? values.costPerUnit ?? 0 : values.cost ?? 0
      }
      const newCost = isBulkCost
        ? new Big(values.cost ?? 0).div(values.quantity ?? 0).toNumber()
        : 0
      return newCost
    } catch {
      return 0
    }
  }, [
    isBulkCost,
    disabled,
    values.cost,
    values.costPerUnit,
    values.isDeducted,
    values.quantity,
  ])

  const costPerUnitColor =
    costPerUnit > 0 && costPerUnit !== Infinity
      ? 'text-green-500'
      : 'text-gray-400'

  const isExpired =
    values.expirationDate && new Date(values.expirationDate) < new Date()

  const expiredStyle = 'border-warning/40 !bg-warning/10'
  const activeStyle = 'border-primary/60 bg-primary/10'

  const additionalStyle = useMemo(() => {
    if (isExpired) {
      return expiredStyle
    }

    if (active) {
      return activeStyle
    }

    return ''
  }, [active, activeStyle, expiredStyle, isExpired])

  return (
    <>
      {/* Adjustment dialog */}
      {showAdjustmentDialog && (
        <AdjustmentDialog
          productId={productId}
          batch={batch}
          onClose={() => setShowAdjustmentDialog(false)}
        />
      )}
      <div id={active ? 'active-batch-card' : ''}>
        <div
          className={`flex flex-col gap-2 rounded-lg border border-neutral/30 p-2 py-4 ${additionalStyle}`}
        >
          {active && (
            <span className="text-xs font-bold text-primary">
              (CURRENTLY USED)
            </span>
          )}
          {isExpired && (
            <span className="text-xs font-bold text-warning">(EXPIRED)</span>
          )}
          <div className="flex flex-row justify-between">
            <p className="flex flex-row items-center gap-2 text-sm uppercase tracking-wider">
              {batch.name}
            </p>
            {onRemove && (
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => onRemove(batch?.id ?? '')}
              >
                <TrashIcon className="w-5 text-primary" />
              </button>
            )}
          </div>
          <div>
            <p>Quantity</p>
            <QuantityInput
              value={quantity}
              onChange={(newValue) => {
                const updateCostPerUnit = newValue
                  ? new Big(values.cost ?? 0).div(newValue ?? 0).toNumber()
                  : 0

                onChange?.({
                  ...values,
                  quantity: newValue,
                  costPerUnit: updateCostPerUnit,
                })
              }}
              onAdd={() => {
                if (disabled) {
                  setShowAdjustmentDialog(true)
                }
              }}
              onSubtract={() => {
                if (disabled) {
                  setShowAdjustmentDialog(true)
                }
              }}
              // disabled={disabled}
              className="w-full"
            />
            {error?.quantity && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {error.quantity}
                </span>
              </div>
            )}
          </div>

          {/* If sold by weight */}
          {isBulkCost && (
            <>
              <label className="form-control w-full ">
                <div className="">
                  <span className="label-text">Bulk Cost</span>
                </div>
                <CurrencyInput
                  decimalsLimit={4}
                  value={values.cost}
                  type="text"
                  tabIndex={2}
                  className="input input-bordered w-full"
                  prefix="₱"
                  placeholder="Enter total cost for bulk purchase"
                  onValueChange={(value) => {
                    const updateCostPerUnit = value
                      ? new Big(value ?? 0).div(values.quantity ?? 0).toNumber()
                      : 0
                    onChange?.({
                      ...values,
                      cost: value,
                      costPerUnit: updateCostPerUnit,
                    })
                  }}
                  disabled={disabled}
                  allowNegativeValue={false}
                />
                {error?.cost && (
                  <div className="label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {error.cost}
                    </span>
                  </div>
                )}
              </label>
              <p className={`${costPerUnitColor}`}>
                Cost: {costPerUnit}/{values.unitOfMeasurement}
              </p>
            </>
          )}

          {!forSale && !isBulkCost && (
            <>
              <label className="form-control w-full ">
                <div className="">
                  <span className="label-text">Cost</span>
                </div>
                <CurrencyInput
                  decimalsLimit={4}
                  value={values.cost}
                  type="text"
                  tabIndex={2}
                  className="input input-bordered w-full"
                  prefix="₱"
                  placeholder="₱0"
                  onValueChange={(value) => {
                    const updateCostPerUnit = new Big(value ?? 0)
                      .div(values.quantity ?? 0)
                      .toNumber()
                    onChange?.({
                      ...values,
                      cost: value ?? '',
                      costPerUnit: updateCostPerUnit,
                    })
                  }}
                  disabled={disabled}
                  allowNegativeValue={false}
                />
                {error?.cost && (
                  <div className="label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {error.cost}
                    </span>
                  </div>
                )}
              </label>
            </>
          )}

          {/* Expiration */}
          <label className="form-control w-full">
            <div className="">
              <span className="label-text-alt ">Expiration(Optional)</span>
            </div>
            <div className={`ExpirationDatePicker flex flex-row gap-1`}>
              <DatePicker
                disablePast
                disabled={disabled}
                sx={{ width: '100%', ':disabled': { backgroundColor: '#000' } }}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    color: 'secondary',
                    className: '',
                  },
                  actionBar: {
                    actions: ['clear', 'accept', 'cancel'],
                  },
                }}
                value={moment(values.expirationDate)}
                onAccept={(date) => {
                  if (date) {
                    onChange?.({
                      ...values,
                      expirationDate: moment(date).toDate(),
                    })
                  } else {
                    onChange?.({ ...values, expirationDate: null })
                  }
                }}
                className={` border-none outline-none ${
                  disabled ? 'input-disabled' : 'bg-base-100'
                }`}
              />
            </div>
          </label>
        </div>
      </div>
    </>
  )
}

export default BatchCard
