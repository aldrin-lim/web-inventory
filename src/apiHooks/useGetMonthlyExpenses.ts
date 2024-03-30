import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Expense } from 'types/expense.types'
import { httpClient } from 'util/http'

const useGetMonthlyExpenses = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const url = `/expenses`

      const result = await httpClient
        .get<unknown, AxiosResponse<NonNullable<Expense[]>>>(url)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    refetchOnWindowFocus: false,
  })

  return {
    monthlyExpenses: data,
    error,
    isLoading,
  }
}

export default useGetMonthlyExpenses
