import { z } from 'zod'
import { BusinessSchema } from './business.type'

export enum ExpensesCategories {
  RentAndUtilities = 'Rent And Utilities',
  PayrollAndBenefits = 'Payroll and benefits',
  MarketingAndAdvertising = 'Marketing and advertising',
  OfficeSuppliesAndEquipment = 'Office supplies and equipment',
  ProfessionalFees = 'Professional fees',
  Insurance = 'Insurance',
  InterestOfLoansDebts = 'Interest of loans/debts',
  Others = 'Others',
}

export const ExpenseSchema = z.object({
  id: z.string().uuid().optional(), // Optional because it's auto-generated
  name: z.string(),
  category: z.nativeEnum(ExpensesCategories),
  amount: z.number().positive(),
  isRecurring: z.boolean(),
  business: z.lazy(() => BusinessSchema), // Validate the Business entity as part of the Expense
  deletedAt: z.date().optional(), // Optional because it can be null
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Expense = z.infer<typeof ExpenseSchema>
