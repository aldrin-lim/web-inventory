import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import useGetMonthlyExpenses from 'apiHooks/useGetMonthlyExpenses'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { ExpensesCategories } from 'types/expense.types'
import { formatToPeso } from 'util/currency'
import expenseIcon from './assets/expense-icon.svg'
import { TagIcon } from '@heroicons/react/24/solid'

type SummedExpensesMap = {
  [key in ExpensesCategories]: number
}

type FormattedExpensesMap = {
  [key in ExpensesCategories]: string
}

type ExpensesItem = Array<{
  category: ExpensesCategories
  amount: string
}>

// enum ExpensesCategories {
//   RentAndUtilities = 'Rent And Utilities',
//   PayrollAndBenefits = 'Payroll and benefits',
//   MarketingAndAdvertising = 'Marketing and advertising',
//   OfficeSuppliesAndEquipment = 'Office supplies and equipment',
//   ProfessionalFees = 'Professional fees',
//   Insurance = 'Insurance',
//   InterestOfLoansDebts = 'Interest of loans/debts',
//   Others = 'Others',
// }

const Expense = () => {
  const navigate = useNavigate()

  const { monthlyExpenses, isLoading } = useGetMonthlyExpenses()

  // iterate enum
  const categories = Object.keys(ExpensesCategories).map(
    (key) => ExpensesCategories[key as keyof typeof ExpensesCategories],
  )

  const formattedExpenses = useMemo(() => {
    // Initialize an object with all categories set to zero
    const initialSum = Object.keys(ExpensesCategories).reduce((acc, key) => {
      acc[ExpensesCategories[key as keyof typeof ExpensesCategories]] = 0
      return acc
    }, {} as SummedExpensesMap)

    if (!isLoading && monthlyExpenses) {
      monthlyExpenses.forEach((expense) => {
        if (!expense.deletedAt) {
          // Assuming you want to skip deleted expenses
          initialSum[expense.category] += expense.amount
        }
      })
    }

    // Now format each sum to peso format
    const formattedSum = Object.entries(initialSum).reduce(
      (acc, [key, value]) => {
        acc[key as ExpensesCategories] = formatToPeso(value)
        return acc
      },
      {} as FormattedExpensesMap,
    )

    return formattedSum
  }, [monthlyExpenses, isLoading])

  return (
    <div className="screen">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(AppPath.Root)}
          />,
          <ToolbarTitle key={2} title="" />,
        ]}
      />
      <div className="flex flex-col items-center gap-4">
        <div className=" flex flex-col items-center gap-2">
          <img src={expenseIcon} />
          <h1 className="inline w-auto text-2xl font-bold">Expenses</h1>
        </div>
        <div className="flex w-full  flex-col p-0">
          {Object.entries(formattedExpenses).map(
            ([category, formattedAmount], index) => (
              <div
                className="flex w-full flex-col items-center border-t border-t-base-300"
                key={index}
              >
                <button className="btn btn-ghost my-1 flex w-full flex-row justify-between rounded-none   text-base font-normal">
                  <div className="flex flex-row gap-2">
                    <TagIcon className="w-4" />
                    <p className="max-w-[160px] text-left">{category}</p>
                  </div>
                  <div className="flex flex-row gap-1">
                    {formattedAmount}
                    <ChevronRightIcon className="w-4" />
                  </div>
                </button>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

export default Expense
