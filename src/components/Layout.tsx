import ArrowLeftOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftOnRectangleIcon'
import {
  ArchiveBoxIcon,
  BookOpenIcon,
  BuildingStorefrontIcon,
  PresentationChartBarIcon,
  QueueListIcon,
  RectangleGroupIcon,
  TagIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { useAuth0 } from '@auth0/auth0-react'
import logo from '../../public/logo.svg'

const Layout = () => {
  const navigate = useNavigate()
  const { logout } = useAuth0()

  return (
    <div className="drawer ">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ">
        <Outlet />
      </div>
      <div className="drawer-side z-30">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        {/* Menu */}
        <div className="menu flex h-full min-h-full w-56 flex-col bg-base-200 p-4 pl-0 text-base-content">
          <div className=" -mr-4 -mt-4  border-b shadow-sm">
            <div
              key="title"
              className="mx-auto flex flex-row justify-between gap-3 px-3 py-1 text-center"
            >
              <div className="flex flex-row items-center justify-center gap-3">
                <img key="logo " className="w-6 self-center" src={logo} />
                <h1 className="text-xl text-primary">Qrafter</h1>
              </div>
              <div>
                <label className="btn btn-ghost -mr-4 " htmlFor="my-drawer">
                  <XMarkIcon className="h-6 w-6" />
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4 px-2">
            <ul>
              <li>
                <label
                  htmlFor="my-drawer"
                  className="btn btn-ghost w-full justify-start px-1 "
                  onClick={() => navigate(AppPath.Products)}
                >
                  <TagIcon className="h-6 w-6" />
                  Products
                </label>
              </li>
              <li>
                <label
                  htmlFor="my-drawer"
                  className="btn btn-ghost w-full justify-start px-1"
                  onClick={() => navigate(AppPath.Recipe)}
                >
                  <BookOpenIcon className="h-6 w-6" />
                  Recipes
                </label>
              </li>
              <li>
                <label
                  htmlFor="my-drawer"
                  className="btn btn-ghost w-full justify-start px-1"
                  onClick={() => navigate(AppPath.Inventory)}
                >
                  <ArchiveBoxIcon className="h-6 w-6" />
                  Inventory
                </label>
              </li>
              <li>
                <label
                  htmlFor="my-drawer"
                  className="btn btn-ghost w-full justify-start px-1"
                  onClick={() => navigate(AppPath.Dashboard)}
                >
                  <PresentationChartBarIcon className="h-6 w-6" />
                  Report
                </label>
              </li>
              <li>
                <label
                  htmlFor="my-drawer"
                  className="btn btn-ghost w-full justify-start px-1"
                  onClick={() => navigate(AppPath.Expenses)}
                >
                  <QueueListIcon className="h-6 w-6" />
                  Expenses
                </label>
              </li>
              <li>
                <label
                  htmlFor="my-drawer"
                  onClick={() => navigate(AppPath.Store)}
                  className="btn btn-ghost w-full justify-start px-1 "
                >
                  <BuildingStorefrontIcon className="h-6 w-6" />
                  Store Settings
                </label>
              </li>
              <li>
                <label
                  htmlFor="my-drawer"
                  onClick={() => navigate(AppPath.Profile)}
                  className="btn btn-ghost w-full justify-start px-1 "
                >
                  <UserIcon className="h-6 w-6" />
                  User Profile
                </label>
              </li>
              <li>
                <label
                  htmlFor="my-drawer"
                  className="btn btn-ghost w-full justify-start px-1"
                  onClick={() => {
                    window.open('https://pos.qrafter.io', '_blank')
                  }}
                >
                  <RectangleGroupIcon className="h-6 w-6" />
                  Go to POS
                </label>
              </li>
              <li>
                <label
                  htmlFor="my-drawer"
                  className="btn btn-ghost w-full justify-start px-1 "
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
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
