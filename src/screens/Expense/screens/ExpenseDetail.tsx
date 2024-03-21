import {
  ChevronLeftIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { Expense, ExpensesCategories } from 'types/expense.types'
import EmptyExpensesDetail from '../components/EmptyExpensesDetail'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import moment from 'moment'
import { formatToPeso } from 'util/currency'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import ToolbarDropdown from 'components/Layout/components/Toolbar/components/ToolbarDropdown'
import ExpenseItem from '../components/ExpenseItem'
import AddExpenseDialog, {
  PartialExpense,
} from '../components/AddExpenseDialog'
import { v4 } from 'uuid'
import Big from 'big.js'
import useExpenses from '../hook/useExpenses'
import useBulkUpdateExpenses from 'apiHooks/useBulkUpdateExpenses'

type ExpenseDetailProps = {
  expenses: Expense[]
  category: ExpensesCategories
  onBack: () => void
}

export const ExpenseValidationSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  category: z.nativeEnum(ExpensesCategories, {
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive(),
  isRecurring: z
    .boolean({
      invalid_type_error: 'isRecurring must be a boolean',
    })
    .optional(),
})

const ExpenseDetailValidationSchema = z.object({
  expenses: z.array(ExpenseValidationSchema),
})

const ExpenseDetail = (props: ExpenseDetailProps) => {
  const { category, onBack } = props

  const [originalExpenses, setOriginalExpenses] = useState<Expense[]>([])

  useEffect(() => {
    setOriginalExpenses(props.expenses)
  }, [props.expenses])

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false)
  const { bulkUpdateExpenses, isUpdating } = useBulkUpdateExpenses()

  // Formik
  const { values, setFieldValue, getFieldProps } = useFormik({
    initialValues: {
      expenses: originalExpenses.filter(
        (expense) => expense.category === category,
      ),
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(ExpenseDetailValidationSchema),
    validateOnBlur: true,
    onSubmit: () => {},
  })

  const { operations } = useExpenses({
    originalExpenses: originalExpenses,
    currentExpenses: values.expenses,
  })

  const totalExpenses = useMemo(() => {
    return values.expenses.reduce((acc, expense) => {
      return new Big(acc).plus(expense.amount).toNumber()
    }, 0)
  }, [values.expenses])
  const isEmpty = values.expenses.length === 0

  const onAddExpense = useCallback(
    (newExpense: PartialExpense) => {
      setFieldValue('expenses', [
        ...values.expenses,
        {
          id: v4(),
          category,
          ...newExpense,
        },
      ])
    },
    [category, setFieldValue, values.expenses],
  )

  const onRemoveExpense = useCallback(
    (id: string) => {
      setFieldValue(
        'expenses',
        values.expenses.filter((expense) => expense.id !== id),
      )
    },
    [setFieldValue, values.expenses],
  )

  const onSave = useCallback(() => {
    bulkUpdateExpenses({ operations })
  }, [bulkUpdateExpenses, operations])

  const checkUnsavedChanges = () => {
    const hasUnsavedChanges = operations.length > 0
    if (hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true)
      return
    }
    onBack()
  }

  return (
    <>
      {isUpdating && (
        <div className="fixed z-50 flex h-screen w-screen flex-col items-center justify-center bg-white opacity-70">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}
      {showUnsavedChangesDialog && (
        <dialog
          open={true}
          id="unsaved-changes-dialog"
          className="modal bg-black/30"
        >
          <div className="modal-box px-4">
            <h3 className="text-lg font-bold">Unsaved Changes</h3>
            <p className="py-4">
              There are unsaved changes. Do you want to leave without saving?
            </p>
            <div className="font-sm modal-action">
              <button
                onClick={() => setShowUnsavedChangesDialog(false)}
                className="btn"
              >
                Keep editing
              </button>
              <button
                onClick={onBack}
                type="button"
                className="btn btn-primary"
              >
                Leave without saving
              </button>
            </div>
          </div>
        </dialog>
      )}
      {openAddDialog && (
        <AddExpenseDialog
          category={category}
          onClose={() => setOpenAddDialog(false)}
          onAdd={onAddExpense}
        />
      )}
      <div className="screen">
        <Toolbar
          start={
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={checkUnsavedChanges}
            />
          }
          middle={
            <div
              key={2}
              className="flex flex-col gap-0 self-center py-3 text-center"
            >
              <h1 className="font-bold">{category}</h1>
            </div>
          }
          end={
            <ToolbarDropdown
              items={[
                {
                  label: 'Save',
                  icon: <PencilSquareIcon className="w-4 text-secondary" />,
                  onClick: onSave,
                },
              ]}
            />
          }
        />
        <div className="flex flex-grow flex-col  gap-4">
          {isEmpty && (
            <div className="mt-[30%]">
              <EmptyExpensesDetail onAdd={() => setOpenAddDialog(true)} />
            </div>
          )}

          {/* Total expenses */}
          {!isEmpty && (
            <div className="relative flex flex-col items-center rounded-[4px] border border-solid border-[#dddddd] px-0 py-[8px]">
              <p className="text-base">Total Expenses</p>
              <h1 className="text-xl text-primary">
                {formatToPeso(totalExpenses)}
              </h1>
            </div>
          )}

          {/* Month */}
          {!isEmpty && (
            <div className="flex flex-row items-center justify-between">
              <p>{moment().format('MMMM YYYY')}</p>
              <button
                onClick={() => setOpenAddDialog(true)}
                className="btn btn-ghost btn-sm text-blue-400"
              >
                <PlusIcon className="w-5 " />
                Add Expense
              </button>
            </div>
          )}

          {/* Form item */}
          {values.expenses.map((expense, index) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              index={index}
              getFieldProps={getFieldProps}
              setFieldValue={setFieldValue}
              onRemove={onRemoveExpense}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default ExpenseDetail
