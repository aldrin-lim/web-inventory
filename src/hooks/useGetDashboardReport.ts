import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import moment from 'moment'
import { httpClient } from 'util/http'

interface GetSalesReportResult {
  totalSales: number
  topSellingItems: Array<{ name: string; quantity: number }>
  itemsSold: Array<{ name: string; quantity: number; totalAmount: number }>
  startDate: string
  dailyData: {
    sales: Array<{ x: string; y: number }>
    expenses: Array<{ x: string; y: number }>
  }
  monthlyData: {
    sales: Array<{ x: string; y: number }>
    expenses: Array<{ x: string; y: number }>
  }
}

const useGetDashboardReport = (date?: Date) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-report', date ?? 'today'],
    queryFn: async () => {
      const url = `/reports/dashboard?${
        date ? `date=${moment(date).format('YYYY-MM-DD')}` : ''
      }`

      const result = await httpClient
        .get<unknown, AxiosResponse<GetSalesReportResult>>(url)
        .then((res) => res.data)
      return result || []
    },
    retry: 0,
    refetchOnWindowFocus: false,
  })

  return {
    report: data,
    error,
    isLoading,
  }
}

export default useGetDashboardReport
