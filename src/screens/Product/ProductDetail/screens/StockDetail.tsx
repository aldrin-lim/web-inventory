import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useFormik } from 'formik'
import BatchCard from '../components/BatchCard'
import { ProductBatchSchema, ProductSoldBy } from 'types/product.types'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { v4 } from 'uuid'
import { type StockDetail, StockDetailSchema } from '../ProductDetail.types'
import { getActiveBatch } from 'util/products'
import { useState } from 'react'
import { padWithZeros } from 'util/number'

type StockDetailProps = {
  onBack: () => void
  onComplete: (value: StockDetail) => void
  value: StockDetail
  activeBatch?: z.infer<typeof ProductBatchSchema>
  disabled?: boolean
}

// LEGEND
// Active Batch - Batch that has more than 0 quantity and isnt expired

// NOTES:

// If there is an active batch prop it means that its editable

// TODO:
// For CREATE PRODUCT, no batch with zero quantity is allowed

// TODO:
// For UPDATE PRODUCT, if batch is active and quantity is zero, find the next active batch.
// If there is no active batch, dont allow update

const getValidationSchema = (isBulkCost: boolean) => {
  if (isBulkCost) {
    return ProductBatchSchema.extend({
      cost: z
        .number({ required_error: 'Cost is required' })
        .positive('Cost must be greater than 0'),
    }).array()
  }

  return ProductBatchSchema.array()
}

const StockDetail = (props: StockDetailProps) => {
  const { onBack, onComplete, disabled = false } = props

  const [isBulkCost, setIsBulkCost] = useState(props.value.isBulkCost)

  const { getFieldProps, values, setFieldValue, submitForm, errors } =
    useFormik<StockDetail>({
      onSubmit: (value) => {
        onBack()
        onComplete(value)
      },
      validationSchema: toFormikValidationSchema(
        StockDetailSchema.pick({
          batches: true,
          isBulkCost: true,
          soldBy: true,
        }).extend({
          batches: getValidationSchema(isBulkCost),
        }),
      ),
      initialValues: props.value,
      enableReinitialize: true,
      validateOnChange: false,
      validateOnBlur: false,
    })

  const addNewBatch = () => {
    // get measurement from exiting batch
    const newBatch = {
      id: v4(),
      name: `Batch #${padWithZeros(values.batches.length + 1)} `,
      cost: values.isBulkCost ? 0 : Number(values.cost),
      costPerUnit: 0,
      quantity: 1,
      unitOfMeasurement:
        values.soldBy === ProductSoldBy.Pieces
          ? 'pieces'
          : values.batches[0].unitOfMeasurement ?? 'g',
      expirationDate: null,
    } as z.infer<typeof ProductBatchSchema>
    setFieldValue('batches', [...values.batches, newBatch])
  }

  const activeBatchId = getActiveBatch(values.batches)?.id

  return (
    <div className="screen pb-6">
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
              submitForm()
            }}
            label="Done"
          />,
        ]}
      />

      <div className="flex flex-col gap-4 ">
        {/* Back order tracking */}
        <div className="form-control flex w-full flex-row justify-between py-2">
          <span>Allow selling when out of stock</span>
          <input
            {...getFieldProps('allowBackOrder')}
            checked={values.allowBackOrder}
            type="checkbox"
            className="toggle toggle-primary"
          />
        </div>

        {/* Sell by */}

        {/* RESET the batches every time this changes */}
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
                disabled={disabled}
                checked={values.soldBy === ProductSoldBy.Pieces}
                onChange={(e) => {
                  setFieldValue('soldBy', e.target.value)
                  if (e.target.checked) {
                    setFieldValue(
                      'batches',
                      values.batches.map((batch) => {
                        return {
                          ...batch,
                          unitOfMeasurement: 'pieces',
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
                {...getFieldProps('soldBy')}
                type="radio"
                className="radio-primary radio"
                name="soldBy"
                value={ProductSoldBy.Weight}
                disabled={disabled}
                checked={values.soldBy === ProductSoldBy.Weight}
                onChange={(e) => {
                  setFieldValue('soldBy', e.target.value)
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
        </div>

        {/* Bulk Cost */}
        <div className="flex w-full flex-row items-center justify-between">
          <p className="flex-grow">Stock:</p>

          <div className="form-control ml-auto flex w-auto flex-row gap-2 ">
            <span>Bulk Cost</span>
            <div className="flex flex-row gap-2">
              <input
                {...getFieldProps('isBulkCost')}
                checked={values.isBulkCost}
                onChange={(e) => {
                  setFieldValue('isBulkCost', e.target.checked)
                  setIsBulkCost(e.target.checked)
                  if (e.target.checked) {
                    setFieldValue(
                      'batches',
                      values.batches.map((batch) => {
                        return {
                          ...batch,
                          cost: 0,
                          costPerUnit: 0,
                        }
                      }),
                    )
                  }
                }}
                type="checkbox"
                className="toggle toggle-primary"
              />
              <InformationCircleIcon className="w-5 text-neutral" />
            </div>
          </div>
        </div>

        {/* Batches */}
        {/* TODO: Populate this from batches */}
        {errors.batches && typeof errors.batches === 'string' && (
          <p className="text-xs text-error">{errors.batches}</p>
        )}
        {values.batches.map((batch, index) => {
          return (
            <BatchCard
              active={batch.id === activeBatchId}
              disabled={disabled}
              onRemove={() => {
                const newBatches = [...values.batches]
                newBatches.splice(index, 1)
                setFieldValue('batches', newBatches)
              }}
              onChange={async (updatedBatch) => {
                // await setFieldValue(`batches.${index}`, updatedBatch)

                // Make all of measurment the same from the latest changes on batch
                await setFieldValue(
                  'batches',
                  values.batches.map((batch) => {
                    if (batch.id !== updatedBatch.id) {
                      return batch
                    }
                    return {
                      ...batch,
                      unitOfMeasurement: updatedBatch.unitOfMeasurement,
                    }
                  }),
                )
              }}
              error={errors.batches && (errors.batches[index] as never)}
              batch={batch}
              key={index}
              soldBy={values.soldBy}
              isBulkCost={values.isBulkCost}
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
      </div>

      {/* <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre> */}
      {/* <pre className="text-xs">{JSON.stringify(errors, null, 2)}</pre> */}
    </div>
  )
}

export default StockDetail
