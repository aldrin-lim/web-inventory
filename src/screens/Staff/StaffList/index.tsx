import { ArrowSmallLeftIcon, PlusIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import StaffTable from './components/StaffTable'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

type StaffListProps = {
  onAddStaff: () => void
}

const StaffList = (props: StaffListProps) => {
  const navigate = useNavigate()
  const staffs = [
    {
      id: '2ac72ac8-5cc1-49f6-aa27-8edd3113a0ee',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      position: 'Manager',
      shiftStart: '09:00:00',
      shiftEnd: '17:00:00',
    },
    {
      id: '2ac72ac8-5cc1-49f6-aa27-8edd3113a0ee',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      position: 'Manager',
      shiftStart: '09:00:00',
      shiftEnd: '17:00:00',
    },
    // ... more rows
  ]

  const { onAddStaff } = props

  return (
    <div className="section flex h-full min-h-screen w-full flex-col gap-4">
      <Toolbar
        start={
          <label
            className="btn btn-square btn-ghost drawer-button -ml-4"
            onClick={() => navigate(AppPath.Settings)}
          >
            <ArrowSmallLeftIcon className="w-6 text-blue-400" />
          </label>
        }
        middle={<ToolbarTitle title="Staff" />}
      />
      <div className="flex flex-row items-center justify-between ">
        <h1 className="font-bold">Staff List</h1>
        {staffs.length > 0 && (
          <button
            className="btn btn-ghost btn-sm text-blue-400"
            onClick={onAddStaff}
          >
            <PlusIcon className="w-5 " />
            Add
          </button>
        )}
      </div>
      <div>
        <StaffTable staffs={staffs} />
      </div>

      {staffs.length === 0 && (
        <div className="mt-10 flex h-full w-full flex-col gap-6 text-center">
          <h1 className="text-xl font-bold">Nothing here yet</h1>
          <p>
            Your list seems to be empty at the moment. Start adding staff(s) to
            see them appear here
          </p>
          <button
            className="btn btn-success mx-auto w-[200px] text-white"
            color="green"
            onClick={onAddStaff}
          >
            Add Staff
          </button>
        </div>
      )}
    </div>
  )
}

export default StaffList
