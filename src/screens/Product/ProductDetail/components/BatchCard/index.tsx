import QuantityInput from 'components/QuantityInput'
import { FormikErrors, useFormik } from 'formik'
import CurrencyInput from 'react-currency-input-field'
import { ProductBatchSchema, ProductSoldBy } from 'types/product.types'
import { measurementOptions } from 'util/measurement'
import { z } from 'zod'
import MeasurementSelect from '../MeasurementSelect'
import { useEffect, useMemo } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { TrashIcon } from '@heroicons/react/24/solid'
import Big from 'big.js'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const BatchSchema = ProductBatchSchema.partial({ id: true })

type BatchCardProps = {
  batch: z.infer<typeof BatchSchema>
  soldBy: ProductSoldBy
  isBulkCost?: boolean
  onChange?: (batch: z.infer<typeof BatchSchema>) => void
  onRemove: () => void
  disabled?: boolean
  active?: boolean
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
    soldBy,
    isBulkCost = false,
    onRemove,
    disabled = false,
    active = false,
    error,
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
    <div>
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
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onRemove}
          >
            <TrashIcon className="w-5 text-primary" />
          </button>
        </div>
        <p>Quantity</p>
        <QuantityInput
          value={values.quantity}
          onChange={(newValue) => {
            setFieldValue('quantity', newValue)
          }}
          className="w-full"
        />
        {soldBy === 'weight' && (
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
        )}

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
              Cost: ₱
              {isNaN(costPerUnit) || costPerUnit == Infinity
                ? '0.00'
                : costPerUnit}
              /{values.unitOfMeasurement}
            </p>
          </>
        )}

        {/* Expiration */}
        <label className="form-control w-full ">
          <div className="">
            <span className="label-text-alt ">Expiration</span>
          </div>
          <input
            {...getFieldProps('expirationDate')}
            type="date"
            placeholder="Expiration Date"
            className="input input-bordered w-full"
          />
        </label>
      </div>
    </div>
  )
}

export default BatchCard
