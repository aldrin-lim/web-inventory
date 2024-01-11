import QuantityInput from 'components/QuantityInput'
import { useFormik } from 'formik'
import CurrencyInput from 'react-currency-input-field'
import { ProductBatchSchema, ProductSoldBy } from 'types/product.types'
import { measurementOptions } from 'util/measurement'
import { z } from 'zod'
import MeasurementSelect from '../MeasurementSelect'
import { useEffect } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { TrashIcon } from '@heroicons/react/24/solid'

const BatchSchema = ProductBatchSchema.partial({ id: true })

type BatchCardProps = {
  batch: z.infer<typeof BatchSchema>
  soldBy: ProductSoldBy
  isBulkCost?: boolean
  onChange?: (batch: z.infer<typeof BatchSchema>) => void
  onRemove: () => void
}

const defaultValue = {
  name: 'Batch 1',
  cost: 0,
  costPerUnit: 0,
  quantity: 0,
  unitOfMeasurement: 'pieces',
} as z.infer<typeof BatchSchema>

const BatchCard = (props: BatchCardProps) => {
  const { batch, soldBy, isBulkCost = false, onRemove } = props

  const formValue = batch ?? defaultValue
  const { getFieldProps, values, setFieldValue } = useFormik({
    onSubmit: () => {
      // TODO: When bulk cost is disabled, reset bulk cost to 0 and unit of measurement to pieces
    },
    initialValues: {
      ...formValue,
    },
    enableReinitialize: true,
  })

  const costPerUnit = isBulkCost ? Number(values.cost) / values.quantity : 0
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

  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-2">
      <div className="flex flex-row justify-between">
        <p className="text-sm uppercase tracking-wider">{batch.name}</p>
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
              onBlur={getFieldProps('cost').onBlur}
              name={getFieldProps('cost').name}
              value={getFieldProps('cost').value}
              type="text"
              tabIndex={2}
              className="input input-bordered w-full"
              prefix="₱"
              onValueChange={(value) => {
                setFieldValue('cost', value)
              }}
              allowNegativeValue={false}
            />
          </label>
          <p className={`${costPerUnitColor}`}>
            Cost: ₱
            {isNaN(costPerUnit) || costPerUnit == Infinity
              ? '0.00'
              : costPerUnit.toFixed(2)}
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
      {/* <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre> */}
    </div>
  )
}

export default BatchCard
