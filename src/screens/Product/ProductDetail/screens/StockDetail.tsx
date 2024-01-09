import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import QuantityInput from 'components/QuantityInput'
import CurrencyInput from 'react-currency-input-field'
import MeasurementSelect from '../components/MeasurementSelect'
import { useFormik } from 'formik'
import { useState } from 'react'
import { measurementOptions } from 'util/measurement'

type StockDetailProps = {
  onBack: () => void
}

const StockDetail = (props: StockDetailProps) => {
  const { onBack, onComplete } = props

  const { getFieldProps, values, setFieldValue } = useFormik({
    onSubmit: () => {
      // TODO: When bulk cost is disabled, reset bulk cost to 0 and unit of measurement to pieces
    },
    initialValues: {
      unitOfMeasurement: 'pieces',
      soldBy: 'pieces',
      bulkCost: 0,
      quantity: 0,
      allowBackOrder: false,
      expirationDate: null,
    },
  })

  const [isBulkCost, setIsBulkCost] = useState(false)

  const costPerUnit = +values.bulkCost / values.quantity
  const costPerUnitColor =
    costPerUnit > 0 && costPerUnit !== Infinity
      ? 'text-green-500'
      : 'text-gray-400'
  return (
    <div className="sub-screen">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            onClick={onBack}
            icon={<ChevronLeftIcon className="w-6" />}
          />,
          <ToolbarTitle key={2} title="Stock Detail" />,
          <ToolbarButton
            key={3}
            onClick={() => {
              onBack()
            }}
            label="Done"
          />,
        ]}
      />
      {/* Back order tracking */}
      <div className="form-control flex w-full flex-row justify-between py-2">
        <span>Allow selling when out of stock</span>
        <input
          {...getFieldProps('allowBackOrder')}
          type="checkbox"
          className="toggle toggle-primary"
        />
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
              value={'pieces'}
              checked={values.soldBy === 'pieces'}
              onChange={(e) => {
                setFieldValue('soldBy', e.target.value)
                if (e.target.checked) {
                  setIsBulkCost(false)
                  setFieldValue('bulkCost', 0)
                  setFieldValue('unitOfMeasurement', 'pieces')
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
              value={'weight'}
              checked={values.soldBy === 'weight'}
              onChange={(e) => {
                setFieldValue('soldBy', e.target.value)
                if (e.target.checked) {
                  setFieldValue('bulkCost', 0)
                  setFieldValue('unitOfMeasurement', 'kg')
                }
              }}
            />
            <span className="label-text">Weight</span>
          </label>
        </div>
      </div>

      {/* Bulk Cost */}
      <div className="flex w-full flex-row items-center justify-between">
        <p className="flex-grow">Stock:</p>

        {values.soldBy === 'weight' && (
          <div className="form-control ml-auto flex w-auto flex-row gap-2 ">
            <span>Bulk Cost</span>
            <div className="flex flex-row gap-2">
              <input
                onChange={(e) => {
                  setIsBulkCost(e.target.checked)
                  if (!e.target.checked === false) {
                    setFieldValue('bulkCost', 0)
                    setFieldValue('unitOfMeasurement', 'kg')
                  }
                }}
                type="checkbox"
                className="toggle toggle-primary"
              />
              <InformationCircleIcon className="w-5 text-neutral" />
            </div>
          </div>
        )}
      </div>

      {/* Batches */}
      {/* TODO: Populate this from batches */}
      <div className="flex flex-col gap-2 bg-gray-100 p-2">
        <p className="text-sm uppercase tracking-wider">Batch 1</p>
        <p>Quantity</p>
        <QuantityInput
          value={values.quantity}
          onChange={(newValue) => {
            setFieldValue('quantity', newValue)
          }}
          className="w-full"
        />

        {values.soldBy === 'weight' && (
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
                onBlur={getFieldProps('bulkCost').onBlur}
                name={getFieldProps('bulkCost').name}
                value={getFieldProps('bulkCost').value}
                type="text"
                tabIndex={2}
                className="input input-bordered w-full"
                prefix="₱"
                onValueChange={(value) => {
                  setFieldValue('bulkCost', value)
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

        {/* Warning */}
        {/* <label className="form-control w-full ">
          <div className="">
            <span className="label-text-alt ">Expiration warning before:</span>
          </div>
          <div className="flex flex-row gap-4">
            <input
              placeholder="Hours, Days, Weeks, Months"
              className="input input-bordered w-[120px]"
            />
            <div className="w-full">
              <MeasurementSelect
                measurements={['time']}
                value={{
                  label:
                    getAllMeasurementUnits(['time']).find(
                      (option) => option.value === values.warnBefore,
                    )?.label || '',
                  value: values.warnBefore,
                }}
                onChange={(value) => {
                  setFieldValue('warnBefore', value?.value)
                }}
              />
            </div>
          </div>
        </label> */}
        {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
      </div>

      <button className="flex-start btn btn-outline btn-primary btn-md w-full flex-shrink-0 flex-row flex-nowrap  ">
        <PlusIcon className="w-5 flex-shrink-0 " />

        <div className="flex flex-row items-center gap-2">
          <p className="">New Batch</p>
        </div>
      </button>
    </div>
  )
}

export default StockDetail
