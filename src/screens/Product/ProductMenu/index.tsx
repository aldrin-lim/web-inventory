import {
  ChevronRightIcon,
  TagIcon,
  BookOpenIcon,
  ArchiveBoxIcon,
  RectangleStackIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

import './styles.css'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
const ProductMenu = () => {
  const navigate = useNavigate()
  return (
    <div className="ProductMenu section flex flex-col gap-4">
      <Toolbar
        items={[
          <div key={1} />,
          <ToolbarTitle key="title" title="Products" />,
          <ToolbarButton
            key="save"
            icon={<PlusIcon className="w-6" />}
            onClick={() => navigate(AppPath.AddProduct)}
          />,
        ]}
      />
      <div className="join border py-0">
        <button
          className="btn btn-ghost join-item !bg-transparent px-2 pr-1 !text-black"
          disabled
        >
          <MagnifyingGlassIcon className="w-5" />
        </button>
        <input
          type="text"
          placeholder="Search"
          className="input join-item w-full "
        />
      </div>
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
          <button className="btn btn-ghost w-full justify-start px-1 ">
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
      </ul>
    </div>
  )
}

export default ProductMenu
