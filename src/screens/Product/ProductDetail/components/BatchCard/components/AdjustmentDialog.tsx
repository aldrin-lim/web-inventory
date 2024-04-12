import { DatePicker } from '@mui/x-date-pickers'
import { useFormik } from 'formik'
import useAdjustBatch from 'hooks/useAdjustBatch'
import { toNumber } from 'lodash'
import moment from 'moment'
import { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { ProductFormValues } from 'screens/Product/hooks/useProductFormValue'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

type AdjustmentDialogProps = {
  onClose?: () => void
  onSave?: () => void
  batch: ProductFormValues['batches'][number]
  productId: string
}

const AdjustmentDialog = (props: AdjustmentDialogProps) => {
  const { onClose, batch } = props
  const { isLoading, adjustBatch } = useAdjustBatch()

  const [reason, setReason] = useState('')

  const { values, errors, setFieldValue, getFieldProps, submitForm } =
    useFormik({
      initialValues: {
        cost: batch.cost ?? 0,
        quantity: batch.quantity ?? 0,
        reason: '',
        expirationDate: batch.expirationDate,
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
          expirationDate: z.date({ coerce: true }).optional(),
        }),
      ),
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: async () => {
        await adjustBatch({
          batchId: batch.id ?? '',
          productId: props.productId,
          newBatch: {
            cost: toNumber(values.cost),
            quantity: toNumber(values.quantity),
            expirationDate: values.expirationDate,
          },
          reason: values.reason,
        })
        onClose?.()
      },
    })

  return (
    <dialog open={true} className="modal bg-black/30">
      <div className="modal-box px-4">
        <h3 className="text-lg font-bold">Adjust Batch</h3>
        <div className="mt-4 flex flex-col gap-3">
          <h3 className="text-lg ">{batch.name}</h3>
          <label className="form-control w-full ">
            <div className="  ">
              <span className="">Quantity</span>
            </div>
            <CurrencyInput
              disabled={isLoading}
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
              allowNegativeValue={true}
            />
            {errors.quantity && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.quantity}
                </span>
              </div>
            )}
          </label>
          <label className="form-control">
            <div className="">
              <span className=" ">Expiration(Optional)</span>
            </div>
            <div className={`ExpirationDatePicker flex flex-row gap-1`}>
              <DatePicker
                disabled={isLoading}
                disablePast
                sx={{
                  width: '100%',
                  ':disabled': { backgroundColor: '#000' },
                }}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    color: 'info',
                    className: '',
                    placeholder: isLoading === true ? 'N/A' : 'Expiration Date',
                  },
                  actionBar: {
                    actions: ['clear', 'accept', 'cancel'],
                  },
                }}
                value={
                  values.expirationDate
                    ? moment(values.expirationDate, 'YYYY-MM-DD')
                    : null
                }
                onAccept={(date) => {
                  setFieldValue('expirationDate', date ? date.toDate() : null)
                }}
                className={`border-none outline-none`}
              />
            </div>
            {errors.expirationDate && (
              <div className="form-field-error label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.expirationDate}
                </span>
              </div>
            )}
          </label>
          <label className="form-control w-full ">
            <div className="  ">
              <span className="">Reason</span>
            </div>
            <select
              disabled={isLoading}
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
            {errors.reason && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.reason}
                </span>
              </div>
            )}
          </label>

          {reason === 'others' && (
            <textarea
              disabled={isLoading}
              tabIndex={4}
              className="textarea textarea-bordered w-full text-base"
              placeholder="Enter reason"
              onChange={(e) => {
                setFieldValue('reason', `others: ${e.target.value}`)
              }}
            />
          )}
        </div>
        <div className="font-sm modal-action">
          <button disabled={isLoading} onClick={onClose} className="btn">
            Cancel
          </button>
          <button
            disabled={isLoading}
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
