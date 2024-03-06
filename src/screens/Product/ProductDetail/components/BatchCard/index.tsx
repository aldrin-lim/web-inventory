import QuantityInput from 'components/QuantityInput'
import { FormikErrors, useFormik } from 'formik'
import CurrencyInput from 'react-currency-input-field'
import { ProductBatchSchema, ProductSoldBy } from 'types/product.types'
import { z } from 'zod'
import { useEffect, useMemo } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { TrashIcon } from '@heroicons/react/24/solid'
import Big from 'big.js'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { formatToPeso } from 'util/currency'
import { ProductAction } from '../..'
import { DatePicker } from '@mui/x-date-pickers'

import './styles.css'
import moment from 'moment'

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
}

const BatchCard = (props: BatchCardProps) => {
  const {
    batch,
    isBulkCost = false,
    onRemove,
    active = false,
    error,
    forSale,
    mode = 'add',
  } = props

  const formValue = batch
  const { getFieldProps, values, setFieldValue } = useFormik({
    onSubmit: () => {
      // TODO: When bulk cost is disabled, reset bulk cost to 0 and unit of measurement to pieces
    },
    initialValues: {
      ...formValue,
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        cost: z
          .number({ required_error: 'Cost is required', coerce: true })
          .min(0, 'Cost must be greater than 0'),
      }),
    ),
    enableReinitialize: true,
  })

  // const costPerUnit = isBulkCost ? Number(values.cost) / values.quantity : 0
  const costPerUnit = useMemo(() => {
    try {
      if (mode === 'edit') {
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
  }, [values.cost, values.quantity])
  const costPerUnitColor =
    costPerUnit > 0 && costPerUnit !== Infinity
      ? 'text-green-500'
      : 'text-gray-400'

  const debouncedValue = useDebounce(values, 300)
  useEffect(() => {
    props.onChange?.({
      ...debouncedValue,
      costPerUnit,
    })
  }, [debouncedValue])

  useEffect(() => {
    setFieldValue('costPerUnit', costPerUnit)
  }, [costPerUnit])

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
            value={values.quantity}
            onChange={(newValue) => {
              setFieldValue('quantity', newValue)
            }}
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

        {/* {soldBy === 'weight' && (
          <label className="form-control w-full ">
            <div className="">
              <span className="label-text-alt ">Unit of Measurement</span>
            </div>
            <MeasurementSelect
              disabled={disabled}
              value={{
                label:
                  measurementOptions.find(
                    (option) => option.value === values.unitOfMeasurement,
                  )?.label || '',
                value: values.unitOfMeasurement,
              }}
              onChange={(value) => {
                setFieldValue('unitOfMeasurement', value?.value)
              }}
            />
          </label>
        )} */}

        {/* If sold by weight */}
        {isBulkCost && (
          <>
            <label className="form-control w-full ">
              <div className="">
                <span className="label-text">Bulk Cost</span>
              </div>
              <CurrencyInput
                decimalsLimit={4}
                onBlur={getFieldProps('cost').onBlur}
                name={getFieldProps('cost').name}
                value={getFieldProps('cost').value || ''}
                type="text"
                tabIndex={2}
                className="input input-bordered w-full"
                prefix="₱"
                placeholder="Enter total cost for bulk purchase"
                onValueChange={(value) => {
                  setFieldValue('cost', value)
                }}
                disabled={values.isDeducted || mode === 'edit'}
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
              Cost: {formatToPeso(values.costPerUnit ?? 0)}/
              {values.unitOfMeasurement}
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
                onBlur={getFieldProps('cost').onBlur}
                name={getFieldProps('cost').name}
                value={getFieldProps('cost').value || ''}
                type="text"
                tabIndex={2}
                className="input input-bordered w-full"
                prefix="₱"
                placeholder="₱0"
                onValueChange={(value) => {
                  setFieldValue('cost', value)
                }}
                disabled={values.isDeducted || mode === 'edit'}
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
          <div className="ExpirationDatePicker flex flex-row gap-1">
            <DatePicker
              disabled={mode === 'edit'}
              sx={{ width: '100%' }}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  className: '',
                },
                actionBar: {
                  actions: ['clear', 'accept'],
                },
              }}
              value={moment(values.expirationDate)}
              onChange={(date) => {
                if (date) {
                  setFieldValue('expirationDate', moment(date).toDate())
                } else {
                  setFieldValue('expirationDate', null)
                }
              }}
              className="bg-base-100"
            />
            {/* <input
              {...getFieldProps('expirationDate')}
              disabled={mode === 'edit'}
              type="date"
              placeholder="Expiration Date"
              className="input input-bordered w-full"
            /> */}
            {mode === 'add' && (
              <button
                onClick={async () => {
                  await setFieldValue('expirationDate', '')
                  setFieldValue('expirationDate', null)
                }}
                className="btn btn-ghost"
              >
                <XMarkIcon className="w-6" />
              </button>
            )}
          </div>
        </label>
      </div>
    </div>
  )
}

export default BatchCard
