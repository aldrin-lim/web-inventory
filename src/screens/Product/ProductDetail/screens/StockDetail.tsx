import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useFormik } from 'formik'
import BatchCard from '../components/BatchCard'
import { ProductBatchSchema, ProductSoldBy } from 'types/product.types'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { v4 } from 'uuid'
import { type StockDetail, StockDetailSchema } from '../ProductDetail.types'
import { getActiveBatch } from 'util/products'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { padWithZeros } from 'util/number'
import { measurementOptions } from 'util/measurement'
import MeasurementSelect from '../components/MeasurementSelect'

type StockDetailProps = {
  onBack: () => void
  onComplete: (value: StockDetail) => void
  value: StockDetail
  activeBatch?: z.infer<typeof ProductBatchSchema>
  disabled?: boolean
  mode?: 'add' | 'edit'
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
        .number({ required_error: 'Cost is required', coerce: true })
        .positive('Cost must be greater than 0'),
    }).array()
  }

  return ProductBatchSchema.array()
}

const StockDetail = (props: StockDetailProps) => {
  const { onBack, onComplete, disabled = false, mode } = props

  const [showMore, setShowMore] = useState(false)

  const [isBulkCost, setIsBulkCost] = useState(props.value.isBulkCost)

  const { getFieldProps, values, setFieldValue, errors } =
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

  const addNewBatch = async () => {
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
          : values.batches[0]?.unitOfMeasurement ?? 'g',
      expirationDate: null,
    } as z.infer<typeof ProductBatchSchema>

    await setFieldValue('batches', [...values.batches, newBatch])
    if (!showMore) {
      setShowMore(true)
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
    const lastBatchElement = document.querySelector(
      '.BatchesContainer > div:last-child',
    )
    if (lastBatchElement) {
      scrollTo(0, 99999)
    }
  }

  const activeBatchId = getActiveBatch(values.batches)?.id

  useEffect(() => {
    onComplete(values)
  }, [values])

  const activeBatch = useMemo(() => {
    return getActiveBatch(values.batches)
  }, [values.batches])

  const batches = useMemo(() => {
    if (mode === 'edit') {
      return [values.activeBatch]
    }
    return values.batches
  }, [mode, values.activeBatch, values.batches])

  const otherBatches = useMemo(() => {
    if (mode === 'edit') {
      return values.batches.filter((batch) => batch.id !== activeBatch?.id)
    }
    return values.batches
  }, [mode, values.batches, activeBatch])

  const onToggleShowMore = () => {
    setShowMore(!showMore)
  }

  const removeBatch = useCallback(
    async (batchId: string) => {
      const newBatches = [...values.batches]
      const updatedBatches = newBatches.filter((batch) => batch.id !== batchId)
      await setFieldValue('batches', updatedBatches)
    },
    [setFieldValue, values.batches],
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Back order tracking */}
      <div className="form-control flex w-full flex-row gap-2 py-2">
        <input
          {...getFieldProps('allowBackOrder')}
          checked={values.allowBackOrder}
          type="checkbox"
          className="toggle toggle-primary"
        />
        <span>Allow selling when out of stock</span>
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
        {values.soldBy === 'weight' && (
          <label className="form-control w-full ">
            <div className="">
              <span className="label-text-alt ">Unit of Measurement</span>
            </div>
            <MeasurementSelect
              disabled={disabled}
              value={{
                label:
                  measurementOptions.find(
                    (option) =>
                      option.value === values.batches[0]?.unitOfMeasurement,
                  )?.label || '',
                value: values.batches[0]?.unitOfMeasurement,
              }}
              onChange={(value) => {
                setFieldValue(
                  'batches',
                  values.batches.map((batch) => {
                    return {
                      ...batch,
                      unitOfMeasurement: value?.value,
                    }
                  }),
                )
              }}
            />
          </label>
        )}
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
              disabled={disabled}
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
      <div className="BatchesContainer flex flex-col gap-4">
        {mode === 'add' &&
          values.batches.map((batch, index) => {
            return (
              <BatchCard
                active={batch.id === activeBatchId}
                disabled={disabled}
                onRemove={values.batches.length > 1 ? removeBatch : undefined}
                onChange={async (updatedBatch) => {
                  await setFieldValue(
                    'batches',
                    values.batches.map((batch) => {
                      if (batch.id === updatedBatch.id) {
                        return updatedBatch
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
                forSale={values.forSale}
              />
            )
          })}
      </div>

      {mode === 'edit' && !activeBatch && (
        <div className="mt-4 text-center text-gray-400">
          No batch available for use. Please add a batch to continue.
        </div>
      )}

      {mode === 'edit' &&
        activeBatch &&
        [activeBatch].map((batch, index) => {
          return (
            <BatchCard
              active={true}
              disabled={disabled}
              onRemove={removeBatch}
              onChange={async (updatedBatch) => {
                await setFieldValue(
                  'batches',
                  values.batches.map((batch) => {
                    if (batch.id === updatedBatch.id) {
                      return updatedBatch
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
              forSale={values.forSale}
            />
          )
        })}

      {mode === 'edit' && otherBatches.length > 0 && (
        <div
          className={`collapse collapse-arrow rounded-sm bg-base-100 ${
            showMore ? 'collapse-open' : 'collapse-close'
          }`}
        >
          <div
            onClick={onToggleShowMore}
            className="collapse-title mx-auto w-[160px] px-0 text-center"
          >
            Show {showMore ? 'Less' : 'More'}
          </div>
          <div className="BatchesContainer collapse-content space-y-4 p-0">
            {otherBatches.map((batch, index) => {
              return (
                <BatchCard
                  disabled={disabled}
                  onRemove={removeBatch}
                  onChange={async (updatedBatch) => {
                    await setFieldValue(
                      'batches',
                      values.batches.map((batch) => {
                        if (batch.id === updatedBatch.id) {
                          return updatedBatch
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
                  forSale={values.forSale}
                />
              )
            })}
          </div>
        </div>
      )}

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
  )
}

export default StockDetail
