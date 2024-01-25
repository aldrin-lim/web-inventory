import {
  ChevronRightIcon,
  TagIcon,
  BookOpenIcon,
  ArchiveBoxIcon,
  RectangleStackIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'

import { Navigate, useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

import logo from '../../../public/logo.svg'
import { useAuth0 } from '@auth0/auth0-react'
import useUser from 'hooks/useUser'
const ProductMenu = () => {
  const navigate = useNavigate()
  const { logout } = useAuth0()
  useUser()

  return (
    <div className="screen">
      <Toolbar
        items={[
          <div key="1" />,
          <div
            key="title"
            className="flex flex-row gap-3 self-center py-3 text-center"
          >
            <img key="logo " className="w-6 self-center" src={logo} />
            <h1 className="font-bold">Qrafter</h1>
          </div>,
          null,
        ]}
      />
      <div className="flex flex-col gap-4 ">
        <ul>
          <li>
            <button
              className="btn btn-ghost w-full justify-start px-1 "
              onClick={() => navigate(AppPath.ProductOverview)}
            >
              <TagIcon className="h-6 w-6" />
              All Products
              <ChevronRightIcon className="ml-auto h-6 w-6 " />
            </button>
          </li>
          <li>
            <button
              className="btn btn-ghost w-full justify-start px-1"
              onClick={() => navigate(AppPath.RecipeOverview)}
            >
              <BookOpenIcon className="h-6 w-6" />
              All Recipes
              <ChevronRightIcon className="ml-auto h-6 w-6 " />
            </button>
          </li>
          <li>
            <button className="btn btn-ghost w-full justify-start px-1 ">
              <ArchiveBoxIcon className="h-6 w-6" />
              Inventory
              <ChevronRightIcon className="ml-auto h-6 w-6 " />
            </button>
          </li>
          <li>
            <button className="btn btn-ghost w-full justify-start px-1 ">
              <RectangleStackIcon className="h-6 w-6" />
              Collection
              <ChevronRightIcon className="ml-auto h-6 w-6 " />
            </button>
          </li>
          <li>
            <button
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
            </button>
          </li>

          {/* await logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              }) */}
        </ul>
      </div>
    </div>
  )
}

export default ProductMenu
