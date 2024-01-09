import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useFormik } from 'formik'
import { useState } from 'react'
import BatchCard from '../components/BatchCard'
import { ProductSoldBy } from 'types/product.types'

type StockDetailProps = {
  onBack: () => void
}

const defaultValue = {
  unitOfMeasurement: 'pieces',
  soldBy: ProductSoldBy.Pieces,
  allowBackOrder: false,
  batches: [
    {
      name: 'Batch 1',
      cost: 0,
      costPerUnit: 0,
      quantity: 0,
      unitOfMeasurement: 'pieces',
    },
  ],
}

const StockDetail = (props: StockDetailProps) => {
  const { onBack, onComplete } = props

  const { getFieldProps, values, setFieldValue } = useFormik({
    onSubmit: () => {
      // TODO: When bulk cost is disabled, reset bulk cost to 0 and unit of measurement to pieces
    },
    initialValues: defaultValue,
  })

  const [isBulkCost, setIsBulkCost] = useState(false)

  const addNewBatch = () => {
    const newBatch = {
      name: `Batch ${values.batches.length + 1} `,
      cost: 0,
      costPerUnit: 0,
      quantity: 0,
      unitOfMeasurement:
        values.soldBy === ProductSoldBy.Pieces ? 'pieces' : 'kg',
    }
    setFieldValue('batches', [...values.batches, newBatch])
  }
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
              value={ProductSoldBy.Pieces}
              checked={values.soldBy === ProductSoldBy.Pieces}
              onChange={(e) => {
                setFieldValue('soldBy', e.target.value)
                if (e.target.checked) {
                  setIsBulkCost(false)
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
              onChange={(e) => {
                setFieldValue('soldBy', e.target.value)
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
      {values.batches.map((batch, index) => {
        return (
          <BatchCard
            onChange={(batch) => {
              setFieldValue(`batches.${index}`, batch)
            }}
            batch={batch}
            key={index}
            soldBy={values.soldBy}
            isBulkCost={isBulkCost}
          />
        )
      })}

      <button
        onClick={addNewBatch}
        className="flex-start btn btn-outline btn-primary btn-md w-full flex-shrink-0 flex-row flex-nowrap  "
      >
        <PlusIcon className="w-5 flex-shrink-0 " />

        <div className="flex flex-row items-center gap-2">
          <p className="">New Batch</p>
        </div>
      </button>

      <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre>
    </div>
  )
}

export default StockDetail
