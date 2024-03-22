import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { ResponsiveLine } from '@nivo/line'
import millify from 'millify'
import useGetDashboardReport from 'hooks/useGetDashboardReport'
import { useEffect, useState } from 'react'
import { formatToPeso } from 'util/currency'
import moment from 'moment'
import { DatePicker } from '@mui/x-date-pickers'
import { useTheme } from '@nivo/core'
import { AxisTickProps } from '@nivo/axes'
import { toNumber } from 'lodash'
import { Analytics } from 'util/analytics'

type CustomTickProps = {
  tick: AxisTickProps<string>
  dateSelected: Date
  view: string
}

const getFontWeight = (dateSelected: Date, view: string, tickValue: string) => {
  if (view === 'weekly') {
    const isSelectedDate = moment(dateSelected).format('M/D') === tickValue
    if (isSelectedDate) {
      return 'bold'
    }
    return 'normal'
  }

  if (view === 'monthly') {
    const isSelectedDate = moment(dateSelected).format('MMM') === tickValue
    if (isSelectedDate) {
      return 'bold'
    }
    return 'normal'
  }

  return 'normal'
}

const CustomTick = (props: CustomTickProps) => {
  const { tick, dateSelected, view } = props
  const theme = useTheme()

  return (
    <g transform={`translate(${tick.x},${tick.y + 22})`}>
      <rect
        x={-14}
        y={-6}
        rx={3}
        ry={3}
        width={28}
        height={24}
        fill="rgba(0, 0, 0, 0)"
      />
      <rect x={-12} y={-12} rx={2} ry={2} width={24} height={24} fill="#fff" />
      <line stroke="rgb(232, 193, 160)" strokeWidth={1.5} y1={-22} y2={-12} />
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          ...theme.axis.ticks.text,
          fill: '#333',
          fontSize: 12,
          fontWeight: getFontWeight(dateSelected, view, tick.value),
        }}
      >
        {tick.value}
      </text>
    </g>
  )
}

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  useEffect(() => {
    Analytics.trackPageView('Report Dashboard')
  }, [])

  const [dateSelected, setDateSelected] = useState(new Date())

  const { isLoading, report } = useGetDashboardReport(dateSelected)

  const [view, setView] = useState('weekly')

  const chartData = {
    data: [
      {
        id: 'Sales',
        color: 'red',
        data:
          view === 'weekly'
            ? report
              ? report.weeklyTotals.data.sales.map((item) => ({
                  x: item.x,
                  y: item.y,
                }))
              : []
            : report
              ? report.monthlyTotals.data.sales.map((item) => ({
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
              ? report.weeklyTotals.data.expenses.map((item) => ({
                  x: item.x,
                  y: item.y,
                }))
              : []
            : report
              ? report.monthlyTotals.data.expenses.map((item) => ({
                  x: item.x,
                  y: item.y,
                }))
              : [],
      },
    ],
  }

  const totalSales =
    view === 'weekly'
      ? report?.weeklyTotals.totalSales
      : report?.monthlyTotals.totalSales

  const totalItemSold =
    view === 'weekly'
      ? report?.weeklyTotals.itemsSold
      : report?.monthlyTotals.itemsSold

  const topSellingItems =
    view === 'weekly'
      ? report?.weeklyTotals.topSellingItems
      : report?.monthlyTotals.topSellingItems

  return (
    <div
      className={['screen pb-9', !isParentScreen ? 'hidden-screen' : ''].join(
        ' ',
      )}
    >
      {isLoading && (
        <div className="fixed z-50 flex h-screen w-screen flex-col items-center justify-center bg-white opacity-70">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}
      <Toolbar
        start={
          <ToolbarButton
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(-1)}
          />
        }
        middle={<ToolbarTitle title="Dashboard" />}
      />
      <div className="AppContainer bg-prim flex flex-col gap-4 p-4">
        <div className="flex flex-row items-center gap-4">
          <h1 className="">Sales Summary:</h1>
          {/* <input
            className="input input-bordered w-full"
            type="date"
            // Date today
            defaultValue={moment(dateSelected).format('YYYY-MM-DD')}
            onChange={
              (e) => setDateSelected(new Date(e.target.value))
              // setDateSelected(new Date(e.target.value))
            }
          /> */}
          {view === 'weekly' && (
            <DatePicker
              value={moment(dateSelected)}
              sx={{ width: '100%', ':disabled': { backgroundColor: '#000' } }}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  color: 'secondary',
                  className: '',
                },
                actionBar: {
                  actions: ['accept', 'cancel'],
                },
              }}
              onAccept={(date) => {
                if (date) {
                  setDateSelected(moment(date).startOf('day').toDate())
                }
              }}
              className={` border-none bg-base-100 outline-none`}
            />
          )}
          {view === 'monthly' && (
            <DatePicker
              value={moment(dateSelected)}
              sx={{ width: '100%', ':disabled': { backgroundColor: '#000' } }}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  color: 'secondary',
                  className: '',
                },
                actionBar: {
                  actions: ['accept', 'cancel'],
                },
              }}
              views={['month', 'year']}
              onAccept={(date) => {
                // set the date the start of the dat and start of the month
                if (date) {
                  setDateSelected(moment(date).startOf('month').toDate())
                }
              }}
              className={` border-none bg-base-100 outline-none`}
            />
          )}
        </div>
        <div className="flex w-full flex-row gap-4">
          <div className="flex w-1/2 flex-col gap-1 rounded-lg border border-neutral-300 p-4">
            <h1 className="text-lg">Total Sales</h1>
            <p className="text-lg text-primary">
              {formatToPeso(totalSales ?? 0)}
            </p>
          </div>
          <div className="flex w-1/2 flex-col gap-1 rounded-lg border border-neutral-300 p-4">
            <h1 className="text-lg">Items Sold</h1>
            <p className="text-lg text-[#3A9E92]">{totalItemSold ?? 0}</p>
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
            margin={{ top: 30, right: 20, bottom: 45, left: 55 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false,
            }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: 36,
              legendPosition: 'middle',
              renderTick: (tick: AxisTickProps<string>) => {
                return (
                  <CustomTick
                    tick={tick}
                    dateSelected={dateSelected}
                    view={view}
                  />
                )
              },
              legend: `${view === 'weekly' ? 'Day (M/DD)' : 'Month'}`,
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
              legend: 'Total Sales',
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            tooltip={({ point }) => {
              const label = view === 'weekly' ? 'Day' : 'Month'
              return (
                <div
                  style={{
                    background: 'white',
                    padding: '9px 12px',
                    border: '1px solid #ccc',
                  }}
                  className="flex flex-col text-base"
                >
                  <div>
                    {label}: <strong>{String(point?.data?.x)}</strong>
                  </div>
                  <div>
                    {point.serieId}:{' '}
                    <strong>
                      {formatToPeso(toNumber(point?.data?.y ?? 0))}
                    </strong>
                  </div>
                </div>
              )
            }}
            legends={[
              {
                toggleSerie: true,
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
                symbolSize: 15,
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

        {report && topSellingItems && (
          <div className="flex flex-col gap-4">
            {view === 'weekly' ? 'Weekly' : 'Monthly'} Top 10 Best Seller:
            <div className="rounded-lg border border-neutral-300">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingItems.map((item, index) => (
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
