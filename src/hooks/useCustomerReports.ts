import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import moment from 'moment'
import { httpClient } from 'util/http'

interface TransacationData {
  x: string
  y: number
}

type TopCustomersWeekly = Array<{
  name: string
  transactions: number // number of total transactions in week
  totalAmount: number // total amount spent in week
}>

interface CustomerReport {
  weekly: {
    transactions: TransacationData[]
    topCustomers: TopCustomersWeekly
  }
  monthly: {
    transactions: TransacationData[]
    topCustomers: TopCustomersWeekly
  }
}

const useCustomerReports = (date?: Date) => {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['customer-report', date ?? 'today'],
    queryFn: async () => {
      const url = `/reports/customer?${
        date ? `date=${moment(date).format('YYYY-MM-DD')}` : ''
      }`

      const result = await httpClient
        .get<unknown, AxiosResponse<NonNullable<CustomerReport>>>(url)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    refetchOnWindowFocus: false,
  })

  return {
    report: data,
    error,
    isLoading,
    isFetching,
  }
}

export default useCustomerReports
