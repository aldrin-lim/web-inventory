import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { ProductBatchSchema } from 'types/product.types'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const BatchSchema = ProductBatchSchema.partial({ id: true })
type AdjustmentDialogProps = {
  onClose?: () => void
  onSave?: () => void
  batch: z.infer<typeof BatchSchema>
}

const AdjustmentDialog = (props: AdjustmentDialogProps) => {
  const { onClose, onSave, batch } = props
  const [quantity, setQuantity] = useState(batch.quantity ?? 0)
  const [reason, setReason] = useState('')

  const { values, errors, setFieldValue, getFieldProps, submitForm } =
    useFormik({
      initialValues: {
        cost: batch.cost ?? 0,
        quantity: batch.quantity ?? 0,
        reason: '',
      },
      validationSchema: toFormikValidationSchema(
        z.object({
          cost: z.number({
            coerce: true,
            required_error: 'Cost is required',
            invalid_type_error: 'Cost must be a number',
          }),
          quantity: z.number({
            coerce: true,
            required_error: 'Quantity is required',
            invalid_type_error: 'Quantity must be a number',
          }),
          reason: z
            .string({
              required_error: 'Reason is required',
            })
            .min(1, 'Reason is required'),
        }),
      ),
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: () => {
        // console.log('submit')
      },
    })

  return (
    <dialog
      open={true}
      id="unsaved-changes-dialog"
      className="modal bg-black/30"
    >
      <div className="modal-box px-4">
        <h3 className="text-lg font-bold">Adjust Batch</h3>
        <div className="mt-4 flex flex-col gap-3">
          <h3 className="text-lg ">{batch.name}</h3>
          <label className="form-control w-full ">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Quantity</span>
            </div>
            <CurrencyInput
              onBlur={getFieldProps('quantity').onBlur}
              name={getFieldProps('quantity').name}
              decimalsLimit={4}
              value={values.quantity}
              type="text"
              tabIndex={1}
              className="input input-bordered w-full"
              placeholder="Enter total cost for bulk purchase"
              onValueChange={(value) => {
                setFieldValue('quantity', value)
              }}
              allowNegativeValue={false}
            />
            {errors.quantity && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.quantity}
                </span>
              </div>
            )}
          </label>
          <label className="form-control w-full ">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Cost</span>
            </div>
            <CurrencyInput
              onBlur={getFieldProps('cost').onBlur}
              name={getFieldProps('cost').name}
              decimalsLimit={4}
              value={values.cost}
              type="text"
              tabIndex={2}
              prefix="₱"
              className="input input-bordered w-full"
              placeholder="Enter total cost for bulk purchase"
              onValueChange={(value) => {
                setFieldValue('cost', value)
              }}
              allowNegativeValue={false}
            />
            {errors.cost && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.cost}
                </span>
              </div>
            )}
          </label>
          <select
            tabIndex={3}
            className="select select-bordered w-full max-w-xs"
            onChange={(e) => {
              setReason(e.target.value)
              if (e.target.value !== 'others') {
                setFieldValue('reason', e.target.value)
              } else {
                setFieldValue('reason', '')
              }
            }}
          >
            <option value={''} disabled selected>
              Select Reason
            </option>
            <option value={'waste'}>Waste</option>
            <option value={'restock'}>Restock</option>
            <option value={'others'}>Others</option>
          </select>
          {reason === 'others' && (
            <textarea
              tabIndex={4}
              className="textarea textarea-bordered w-full"
              placeholder="Enter reason"
              onChange={(e) => {
                setFieldValue('reason', `others: ${e.target.value}`)
              }}
            />
          )}
          {errors.reason && (
            <div className="label py-0">
              <span className="label-text-alt text-xs text-red-400">
                {errors.reason}
              </span>
            </div>
          )}
        </div>
        <div className="font-sm modal-action">
          <button onClick={onClose} className="btn">
            Cancel
          </button>
          <button
            onClick={submitForm}
            type="button"
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default AdjustmentDialog
