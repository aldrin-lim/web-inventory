import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Expense } from 'types/expense.types'
import { httpClient } from 'util/http'

const useGetMonthlyExpenses = (date?: Date) => {
  const { data, isFetching, error } = useQuery({
    queryKey: ['expenses', date],
    queryFn: async () => {
      const url = `/expenses`

      const result = await httpClient
        .get<unknown, AxiosResponse<NonNullable<Expense[]>>>(url)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    refetchOnWindowFocus: true,
  })

  return {
    monthlyExpenses: data,
    error,
    isLoading: isFetching,
  }
}

export default useGetMonthlyExpenses
