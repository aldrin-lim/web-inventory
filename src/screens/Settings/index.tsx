import { useAuth0 } from '@auth0/auth0-react'
import {
  UserIcon,
  BuildingStorefrontIcon,
  ChevronRightIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const Settings = () => {
  const navigate = useNavigate()
  const { logout } = useAuth0()
  return (
    <div className="section flex h-full flex-grow flex-col gap-4">
      <Toolbar middle={<ToolbarTitle title="Settings" />} />
      <ul className="flex h-full flex-col">
        <li>
          <button
            className="btn btn-ghost w-full justify-start px-1 "
            onClick={() => navigate(AppPath.Profile)}
          >
            <UserIcon className="h-6 w-6" />
            User Profile
            <ChevronRightIcon className="ml-auto h-6 w-6 " />
          </button>
        </li>
        <li className="flex-grow">
          <button
            className="btn btn-ghost w-full justify-start px-1"
            onClick={() => navigate(AppPath.Store)}
          >
            <BuildingStorefrontIcon className="h-6 w-6" />
            Store
            <ChevronRightIcon className="ml-auto h-6 w-6 " />
          </button>
        </li>
        <li className="flex-grow">
          <button
            className="btn btn-ghost w-full justify-start px-1"
            onClick={() => navigate(AppPath.Staff)}
          >
            <UserGroupIcon className="h-6 w-6" />
            Staff
            <ChevronRightIcon className="ml-auto h-6 w-6 " />
          </button>
        </li>
        <li>
          <button
            className="btn btn-ghost mb-20 mt-auto w-full justify-start px-1"
            onClick={async () => {
              await logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }}
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Settings
