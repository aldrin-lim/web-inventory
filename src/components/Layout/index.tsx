import { AppPath } from 'routes/AppRoutes.types'
import Navbar from './components/Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Toolbar from './components/Toolbar'
import {
  Bars3Icon,
  BuildingStorefrontIcon,
  UserIcon,
} from '@heroicons/react/24/solid'

import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth0 } from '@auth0/auth0-react'
import { useRef } from 'react'

const Layout = () => {
  const location = useLocation()
  const { logout } = useAuth0()
  const routeNavigate = useNavigate()

  const drawerToggle = useRef<HTMLInputElement>(null)

  const navigate = (path: string) => {
    if (drawerToggle.current) {
      drawerToggle.current.click()
    }
    routeNavigate(path)
  }

  const showNavbar = (
    [
      AppPath.Root,
      AppPath.Home,
      AppPath.Orders,
      AppPath.Products,
    ] as Array<string>
  ).includes(location.pathname)

  return (
    <div className="relative mx-auto box-content flex flex-col px-4 pb-24">
      {showNavbar && (
        <Toolbar
          items={[
            <div key={1} />,
            <div key={2} />,
            <label
              key="12"
              htmlFor="my-drawer"
              className="btn btn-ghost drawer-button -mr-4"
            >
              <Bars3Icon className="h-6 w-6" />
            </label>,
          ]}
        />
      )}
      <main>
        <div className="drawer drawer-end z-50">
          <input
            ref={drawerToggle}
            id="my-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-content">
            <Outlet />
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu relative min-h-full w-[55%] bg-base-200 p-4 text-gray-700">
              <ul>
                <li>
                  <a
                    className="flex flex-row items-center"
                    onClick={() => navigate(AppPath.Profile)}
                  >
                    <UserIcon className="w-4 text-gray-500" />{' '}
                    <p className="text-base">User</p>
                  </a>
                </li>
                <li>
                  <a onClick={() => navigate(AppPath.Store)}>
                    <BuildingStorefrontIcon className="w-4 text-gray-500" />{' '}
                    <p className="text-base">Store</p>
                  </a>
                </li>
              </ul>
              <div className="absolute bottom-2 w-full">
                <a
                  className="flex flex-row items-center gap-2 p-4"
                  onClick={async () => await logout()}
                >
                  <ArrowLeftOnRectangleIcon className="w-4 text-gray-500" />{' '}
                  <p className="text-base">Sign out</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showNavbar && <Navbar />}
    </div>
  )
}

export default Layout
