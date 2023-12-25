import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Staff } from 'types/staff.types'

interface StaffTableProps {
  staffs: Staff[]
}

// Specify the columns you want to display
const displayedColumns = [
  'firstName',
  'lastName',
  'username',
  'position',
  'shiftStart',
  'shiftEnd',
] as Array<keyof Staff>

const formatColumnName = (columnName: string): string => {
  return columnName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}

const StaffTable = (props: StaffTableProps) => {
  const { staffs } = props
  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="hidden min-w-full md:table">
        <thead>
          <tr>
            {displayedColumns.map((column, idx) => (
              <th
                key={idx}
                className="border-b-2 border-gray-300 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500"
              >
                {formatColumnName(column)}
              </th>
            ))}
            <th className="border-b-2 border-gray-300 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500" />
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff, idx) => (
            <tr key={idx}>
              {displayedColumns.map((column, colIdx) => (
                <td key={colIdx} className="border-b border-gray-200 px-6 py-4">
                  {staff[column]}
                </td>
              ))}
              <td className="border-b border-gray-200 px-6 py-4">
                <div className="relative -top-1 mt-3 flex flex-row gap-2">
                  <button
                    className="btn btn-sm bg-success text-white"
                    color="green"
                  >
                    View Details
                  </button>
                  <button className="btn btn-circle btn-ghost btn-sm  right-2 top-2 bg-purple-300">
                    <PencilIcon className="w-4 text-white" />
                  </button>
                  <button className="btn btn-circle btn-ghost btn-sm  right-2 top-2 bg-purple-300">
                    <TrashIcon className="w-4 text-white" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Table */}
      <div className="flex flex-col gap-4 md:hidden">
        {staffs.map((staff, idx) => (
          <div
            key={idx}
            className=" block rounded-md border border-gray-200 px-4 py-2  "
          >
            {displayedColumns.map((column, colIdx) => (
              <div key={colIdx} className="">
                <div className="flex flex-row py-1">
                  <p className="min-w-[100px]">
                    <strong className="text-gray-600">
                      {formatColumnName(column)}:
                    </strong>{' '}
                  </p>
                  <p>{staff[column]}</p>
                </div>
              </div>
            ))}
            <div className="mt-3 flex flex-row gap-4">
              <button
                className="btn btn-sm bg-success text-white"
                color="green"
              >
                View Details
              </button>
              <button className="btn btn-circle btn-ghost btn-sm  right-2 top-2 bg-purple-300">
                <PencilIcon className="w-4 text-white" />
              </button>
              <button className="btn btn-circle btn-ghost btn-sm  right-2 top-2 bg-purple-300">
                <TrashIcon className="w-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StaffTable
