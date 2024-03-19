import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import moment from 'moment'
import { httpClient } from 'util/http'

interface ChartData {
  sales: Array<{ x: string; y: number }>
  expenses: Array<{ x: string; y: number }>
}
interface GetSalesReportResult {
  weeklyTotals: {
    data: ChartData
    totalSales: number
    topSellingItems: Array<{ name: string; quantity: number }>
    itemsSold: number
  }
  monthlyTotals: {
    data: ChartData
    totalSales: number
    topSellingItems: Array<{ name: string; quantity: number }>
    itemsSold: number
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
        .get<unknown, AxiosResponse<NonNullable<GetSalesReportResult>>>(url)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    refetchOnWindowFocus: true,
  })

  return {
    report: data,
    error,
    isLoading,
  }
}

export default useGetDashboardReport
