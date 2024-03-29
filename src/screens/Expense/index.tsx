import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import useGetMonthlyExpenses from 'apiHooks/useGetMonthlyExpenses'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { ExpensesCategories } from 'types/expense.types'
import { formatToPeso } from 'util/currency'
import expenseIcon from './assets/expense-icon.svg'
import { TagIcon } from '@heroicons/react/24/solid'
import SlidingTransition from 'components/SlidingTransition'
import { AnimatePresence } from 'framer-motion'
import ExpenseDetail from './screens/ExpenseDetail'

type SummedExpensesMap = {
  [key in ExpensesCategories]: number
}

type FormattedExpensesMap = {
  [key in ExpensesCategories]: string
}

const Expense = () => {
  const navigate = useNavigate()

  const { monthlyExpenses, isLoading } = useGetMonthlyExpenses()

  const [activeCategory, setActiveCategory] =
    useState<ExpensesCategories | null>(null)

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

  const hideCategoryDetails = () => [setActiveCategory(null)]

  const showCategoryDetails = (category: string) => {
    setActiveCategory(category as ExpensesCategories)
  }

  return (
    <>
      <div className={activeCategory === null ? 'screen' : 'hidden-screen'}>
        <Toolbar
          start={
            <label
              htmlFor="my-drawer"
              className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
            >
              <Bars3Icon className="w-6" />
            </label>
          }
        />
        <div className="flex flex-col items-center gap-4">
          <div className=" flex flex-col items-center gap-2">
            <img src={expenseIcon} />
            <h1 className="inline w-auto text-2xl font-bold">Expenses</h1>
          </div>
          <div className="flex w-full  flex-col p-0">
            {isLoading === true && <Skeleton />}
            {isLoading === false &&
              Object.entries(formattedExpenses).map(
                ([category, formattedAmount], index) => (
                  <div
                    className="flex w-full flex-col items-center border-t border-t-base-300"
                    key={index}
                  >
                    <button
                      onClick={() => showCategoryDetails(category)}
                      className="btn btn-ghost my-1 flex w-full flex-row justify-between rounded-none text-base font-normal"
                    >
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
      <AnimatePresence>
        <SlidingTransition isVisible={activeCategory !== null}>
          {activeCategory && monthlyExpenses && (
            <ExpenseDetail
              expenses={monthlyExpenses.filter(
                (expense) => expense.category === activeCategory,
              )}
              category={activeCategory}
              onBack={hideCategoryDetails}
            />
          )}
        </SlidingTransition>
      </AnimatePresence>
    </>
  )
}

const Skeleton = () => (
  <>
    <div className="border-t border-t-base-300">
      <div className="skeleton my-3 h-[24px] w-full rounded-md" />
    </div>

    <div className="border-t border-t-base-300">
      <div className="skeleton my-3 h-[24px] w-full rounded-md" />
    </div>

    <div className="border-t border-t-base-300">
      <div className="skeleton my-3 h-[24px] w-full rounded-md" />
    </div>

    <div className="border-t border-t-base-300">
      <div className="skeleton my-3 h-[24px] w-full rounded-md" />
    </div>

    <div className="border-t border-t-base-300">
      <div className="skeleton my-3 h-[24px] w-full rounded-md" />
    </div>

    <div className="border-t border-t-base-300">
      <div className="skeleton my-3 h-[24px] w-full rounded-md" />
    </div>
  </>
)

export default Expense
