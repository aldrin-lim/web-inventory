import React from 'react'
import CurrencyInput from 'react-currency-input-field'
import { TrashIcon } from '@heroicons/react/24/solid'
import { Expense } from 'types/expense.types'
import { FieldInputProps } from 'formik'

interface ExpenseItemProps {
  expense: Expense
  index: number
  getFieldProps: (name: string) => FieldInputProps<Expense>
  setFieldValue: (field: string, value: unknown) => void
  onRemove: (id: string) => void
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  index,
  getFieldProps,
  setFieldValue,
  onRemove,
}) => {
  return (
    <>
      <div
        key={expense.id}
        className="ExpenseFormControl relative flex flex-col items-start gap-[16px] border-b border-[#e8e8e8] px-0 pb-[16px] pt-0 [border-bottom-style:solid]"
      >
        <div className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch">
          <div className="relative mt-[-1.00px] flex-1 self-stretch whitespace-nowrap text-[16px] font-normal leading-[20.8px] tracking-[0] text-[#353535] [font-family:'Poppins-Regular',Helvetica]">
            {expense.name}
          </div>
          <div className="relative flex flex-1 grow items-center justify-end gap-[8px]">
            <div className="relative w-fit whitespace-nowrap text-[16px] font-normal leading-[20.8px] tracking-[0] text-[#353535] [font-family:'Poppins-Regular',Helvetica]">
              Recurring
            </div>
            <input
              checked={expense.isRecurring}
              onChange={(e) => {
                setFieldValue(`expenses.${index}.isRecurring`, e.target.checked)
              }}
              autoComplete="off"
              type="checkbox"
              className="toggle toggle-primary"
            />
          </div>
        </div>
        <div className="relative flex w-full flex-[0_0_auto] items-center gap-[8px] self-stretch">
          <div className="relative flex h-[40px] flex-1 grow items-center justify-around gap-[16px] rounded-[4px] border border-solid border-[#a4a4a4] py-[8px] pl-[8px] pr-0">
            <CurrencyInput
              autoComplete="off"
              decimalsLimit={2}
              prefix="₱"
              onBlur={getFieldProps(`expenses.${index}.isRecurring`).onBlur}
              name={getFieldProps(`expenses.${index}.isRecurring`).name}
              value={expense.amount}
              type="text"
              tabIndex={5}
              className={`input w-full border-none bg-transparent px-0 pl-2 text-base focus:outline-none`}
              placeholder="₱0"
              inputMode="decimal"
              onValueChange={async (value) => {
                setFieldValue(`expenses.${index}.amount`, value)
              }}
            />
          </div>
          <button
            onClick={() => expense?.id && onRemove?.(expense.id)}
            className="btn btn-ghost"
          >
            <TrashIcon className="w-6 text-error" />
          </button>
        </div>
      </div>
    </>
  )
}

export default ExpenseItem
