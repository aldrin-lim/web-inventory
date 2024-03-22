import { useFormik } from 'formik'
import React from 'react'
import CurrencyInput from 'react-currency-input-field'
import { ExpensesCategories, ExpenseSchema } from 'types/expense.types'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

interface AddExpenseDialogProps {
  category: ExpensesCategories
  onClose?: () => void
  onAdd?: (expense: PartialExpense) => void
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  onAdd,
  onClose,
}) => {
  const { values, errors, getFieldProps, setFieldValue, submitForm } =
    useFormik({
      initialValues: {
        name: '',
        description: '',
        amount: '',
        isRecurring: false,
      } as {
        name: string
        description: string
        amount: string
        isRecurring: boolean
      },
      validationSchema: toFormikValidationSchema(ValidationSchema),
      onSubmit: async (values) => {
        await onAdd?.(values)
        onClose?.()
      },
      validateOnBlur: false,
      validateOnChange: false,
    })

  return (
    <dialog open={true} className="modal bg-black/30">
      <div className="modal-box flex flex-col gap-2 px-4">
        <h3 className="text-lg font-bold">Add Expenses</h3>
        <div className="flex flex-col items-start gap-2 ">
          {/* Expense name input */}
          <label className="form-control flex flex-col gap-2">
            <div className="">
              <span className="label-text-alt text-base">Expense Name</span>
            </div>
            <input
              {...getFieldProps('name')}
              autoComplete="off"
              type="text"
              className="input input-bordered focus:outline-none"
            />
            {errors.name && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.name}
                </span>
              </div>
            )}
          </label>
          {/* Amount input */}
          <label className="form-control">
            <div className="">
              <span className="label-text-alt text-base">Amount</span>
            </div>
            <CurrencyInput
              autoComplete="off"
              decimalsLimit={2}
              value={values.amount}
              prefix="₱"
              type="text"
              tabIndex={3}
              className="input input-bordered w-full"
              placeholder="₱0"
              inputMode="decimal"
              onValueChange={async (value) => {
                setFieldValue('amount', value)
              }}
            />
            {errors.amount && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.amount}
                </span>
              </div>
            )}
          </label>
          {/* Recurring input */}
          <div className=" flex flex-1 grow items-center justify-end gap-[8px]">
            <div className="relative w-fit whitespace-nowrap text-[16px] font-normal leading-[20.8px] tracking-[0] text-[#353535] [font-family:'Poppins-Regular',Helvetica]">
              Recurring
            </div>
            <input
              autoComplete="off"
              type="checkbox"
              className="toggle toggle-primary"
              checked={values.isRecurring}
              onChange={(e) => {
                setFieldValue('isRecurring', e.target.checked)
              }}
            />
          </div>
          {/* Description input */}
          <label className="form-control flex flex-col gap-2">
            <div className="">
              <span className="label-text-alt text-base">
                Description (Optional)
              </span>
            </div>
            <textarea
              type="textarea"
              className="textarea textarea-bordered focus:outline-none"
              autoComplete="off"
              value={values.description}
              onChange={(e) => {
                setFieldValue('description', e.target.value)
              }}
            />
            {errors.description && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.description}
                </span>
              </div>
            )}
          </label>
        </div>
        {/* Actions  */}
        <div className="font-sm modal-action">
          <button onClick={onClose} className="btn">
            Cancel
          </button>
          <button
            type="button"
            onClick={submitForm}
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </dialog>
  )
}

const ValidationSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .default('')
    .optional(),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
      coerce: true,
    })
    .positive('Amount must be greater than 0'),
  isRecurring: z
    .boolean({
      invalid_type_error: 'isRecurring must be a boolean',
    })
    .optional(),
})
const PartialExpenseSchema = ExpenseSchema.pick({
  amount: true,
  name: true,
  description: true,
  isRecurring: true,
}).extend({
  amount: z.string(),
})
export type PartialExpense = z.infer<typeof PartialExpenseSchema>

export default AddExpenseDialog
