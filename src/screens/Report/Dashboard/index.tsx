import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { ResponsiveLine } from '@nivo/line'
import millify from 'millify'
import useGetDashboardReport from 'hooks/useGetDashboardReport'
import LoadingCover from 'components/LoadingCover'
import { useState } from 'react'
import { formatToPeso } from 'util/currency'
import moment from 'moment'

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const [dateSelected, setDateSelected] = useState(new Date())

  const { isLoading, report } = useGetDashboardReport(dateSelected)

  const [view, setView] = useState('weekly')

  console.log(report)

  if (isLoading) {
    return <LoadingCover />
  }

  const chartData = {
    data: [
      {
        id: 'Sales',
        color: 'red',
        data:
          view === 'weekly'
            ? report
              ? report.dailyData.sales.map((item) => ({
                  x: item.x,
                  y: item.y,
                }))
              : []
            : report
              ? report.monthlyData.sales.map((item) => ({
                  x: item.x,
                  y: item.y,
                }))
              : [],
      },
      {
        id: 'Expenses',
        color: 'hsl(36, 70%, 50%)',
        data:
          view === 'weekly'
            ? report
              ? report.dailyData.expenses.map((item) => ({
                  x: item.x,
                  y: item.y,
                }))
              : []
            : report
              ? report.monthlyData.expenses.map((item) => ({
                  x: item.x,
                  y: item.y,
                }))
              : [],
      },
    ],
  }

  return (
    <div
      className={['screen pb-9', !isParentScreen ? 'hidden-screen' : ''].join(
        ' ',
      )}
    >
      <Toolbar
        items={[
          <ToolbarButton
            key={'negative'}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(-1)}
          />,
          <ToolbarTitle key="title" title="Dashboard" />,
          null,
        ]}
      />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-row items-center gap-4">
          <h1 className="">Sales Summary:</h1>
          <input
            className="input input-bordered w-full"
            type="date"
            // Date today
            defaultValue={moment(dateSelected).format('YYYY-MM-DD')}
            onChange={
              (e) => setDateSelected(new Date(e.target.value))
              // setDateSelected(new Date(e.target.value))
            }
          />
        </div>
        <div className="flex w-full flex-row gap-4">
          <div className="flex w-1/2 flex-col gap-1 rounded-lg border border-neutral-300 p-4">
            <h1 className="text-lg">Total Sales</h1>
            <p className="text-lg text-primary">
              {formatToPeso(report?.totalSales ?? 0)}
            </p>
          </div>
          <div className="flex w-1/2 flex-col gap-1 rounded-lg border border-neutral-300 p-4">
            <h1 className="text-lg">Items Sales</h1>
            <p className="text-lg text-[#3A9E92]">
              {report?.itemsSold?.length ?? 0}
            </p>
          </div>
        </div>
        <div className="w-full">
          {/* View select */}
          <select
            className="select select-bordered w-full"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="h-[290px] w-full rounded-lg border border-neutral-300">
          <ResponsiveLine
            colors={['#856AD4', '#F1A30B']}
            data={chartData.data}
            margin={{ top: 30, right: 20, bottom: 30, left: 55 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false,
            }}
            curve="linear"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: -40,
              legendPosition: 'middle',
              format: (value) =>
                `₱${millify(value, {
                  precision: 3,
                  lowercase: true,
                })}`,
              tickValues: 6,
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'top-left',
                direction: 'row',
                justify: false,
                translateX: -7,
                translateY: -26,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 95,
                itemHeight: 24,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>

        {report && report.topSellingItems && (
          <div className="flex flex-col gap-4">
            Top 10 Best Seller
            <div className="rounded-lg border border-neutral-300">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topSellingItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard