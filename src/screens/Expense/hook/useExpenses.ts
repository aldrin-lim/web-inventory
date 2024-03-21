import { toNumber } from 'lodash'
import { useEffect, useState } from 'react'
import { Expense, ExpensesCategories } from 'types/expense.types'
import { ZodError, z } from 'zod'

// Assuming ExpenseValidationSchema is already defined for an individual expense
const ExpenseValidationSchema = z.object({
  id: z.string(),
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
      invalid_type_error: 'Recurring must be a boolean',
    })
    .optional(),
})

enum OperationType {
  Add = 'add',
  Update = 'update',
  Delete = 'delete',
}

// Define schema for an add operation
const AddOperationSchema = z.object({
  operation: z.literal(OperationType.Add),
  data: ExpenseValidationSchema.omit({ id: true }), // Assuming ID is not required when adding
})

// Define schema for an update operation
const UpdateOperationSchema = z.object({
  operation: z.literal(OperationType.Update),
  id: z.string(),
  data: ExpenseValidationSchema.partial(), // Use partial since not all fields need to be updated
})

// Define schema for a delete operation
const DeleteOperationSchema = z.object({
  operation: z.literal(OperationType.Delete),
  id: z.string(),
})

// Define the schema for the payload
export const OperationsSchema = z.object({
  operations: z.array(
    AddOperationSchema.or(UpdateOperationSchema).or(DeleteOperationSchema),
  ),
})

type UseExpensesParam = {
  originalExpenses: Expense[]
  currentExpenses: Expense[]
}

type Operation =
  | z.infer<typeof AddOperationSchema>
  | z.infer<typeof UpdateOperationSchema>
  | z.infer<typeof DeleteOperationSchema>
type Operations = Operation[]
type ValidationError = ZodError<{ operations: Operations }>

const filterExpenseFields = (expense: Expense) => ({
  id: expense.id,
  name: expense.name,
  category: expense.category,
  amount: expense.amount,
  isRecurring: expense.isRecurring ?? false, // Providing a default value if isRecurring is undefined
})

const useExpenses = (params: UseExpensesParam) => {
  const { originalExpenses, currentExpenses } = params

  const [operations, setOperations] = useState<Operations>([])
  const [errors, setErrors] = useState<ValidationError | null>(null)

  useEffect(() => {
    // Map over currentExpenses and originalExpenses to filter out unnecessary fields
    const filteredCurrentExpenses = currentExpenses.map(filterExpenseFields)
    const filteredOriginalExpenses = originalExpenses.map(filterExpenseFields)

    const addedExpenses = filteredCurrentExpenses.filter(
      (expense) =>
        !filteredOriginalExpenses.some(
          (origExpense) => origExpense.id === expense.id,
        ),
    )

    const updatedExpenses = filteredCurrentExpenses.filter((expense) =>
      filteredOriginalExpenses.some(
        (origExpense) =>
          origExpense.id === expense.id &&
          JSON.stringify(origExpense) !== JSON.stringify(expense),
      ),
    )
    const deletedExpenseIds = filteredOriginalExpenses
      .filter(
        (origExpense) =>
          !filteredCurrentExpenses.some(
            (expense) => expense.id === origExpense.id,
          ),
      )
      .map((expense) => expense.id)

    const ops = [
      ...addedExpenses.map((expense) => ({
        operation: 'add',
        data: {
          ...expense,
          amount: toNumber(expense.amount),
        },
      })),
      ...updatedExpenses.map((expense) => ({
        operation: 'update',
        id: expense.id,
        data: {
          ...expense,
          amount: toNumber(expense.amount),
        },
      })),
      ...deletedExpenseIds.map((id) => ({
        operation: 'delete',
        id,
      })),
    ] as Operations
    setOperations(ops)
    // Validate operations
    const result = OperationsSchema.safeParse({ operations: ops })
    if (!result.success) {
      // Handle validation error
      setErrors(result.error)
    } else {
      // If validation is successful, update operations state and clear any existing errors
      setErrors(null)
    }
  }, [originalExpenses, currentExpenses])

  return {
    operations,
    errors,
  }
}

export default useExpenses
