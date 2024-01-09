import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { useProductDetail } from '../contexts/ProductDetailContext'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PrimaryAction from './components/ProductDetailPrimaryAction'
import ProductImages from './components/ProductImages'

enum ActiveScreen {
  None = 'none',
  DiscountList = 'list',
}

export const ProductDetail = () => {
  const {
    state: { productDetails, mode },
  } = useProductDetail()

  const navigate = useNavigate()

  const [activeScreen] = useState(ActiveScreen.None)

  return (
    <div
      className={`OrderSelection main-screen ${
        activeScreen === ActiveScreen.None ? 'h-full' : 'h-screen'
      }`}
    >
      <div className="sub-screen">
        <Toolbar
          items={[
            <ToolbarButton
              key={2}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(AppPath.ProductOverview)}
            />,
            <ToolbarTitle
              key="title"
              title={mode === 'add' ? 'Add Product' : 'View Product'}
            />,
            <PrimaryAction
              mode={mode}
              key="primaryAction"
              isLoading={false}
              onCreate={function (): void {
                throw new Error('Function not implemented.')
              }}
              onDelete={function (): void {
                throw new Error('Function not implemented.')
              }}
              onSave={function (): void {
                throw new Error('Function not implemented.')
              }}
              onClone={function (): void {
                throw new Error('Function not implemented.')
              }}
            />,
          ]}
        />
        <div className="flex flex-col items-start gap-2">
          {/* Product Name */}
          <label className="form-control w-full ">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Product Name</span>
            </div>
            <input
              type="text"
              placeholder="(e.g., Milk Tea, Coffee, etc.)"
              className="input input-bordered w-full"
              tabIndex={1}
            />
            {/* <div className="label py-0">
              <span className="label-text-alt text-xs text-red-400">asd</span>
            </div> */}
          </label>

          {/* Recipe CTA */}
          <button className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left">
            Create product using a recipe
          </button>

          {/* Set Description CTA */}
          <button className="flex-start btn btn-ghost w-full flex-shrink-0 flex-row flex-nowrap justify-between px-0">
            <p className="text-overflow-ellipsis overflow-hidden truncate whitespace-nowrap break-words text-left">
              <span className="text-gray-400">Add Description</span>
            </p>
            <ChevronRightIcon className="w-5 flex-shrink-0 text-secondary" />
          </button>

          {/* Price Input */}
          <label className="form-control ">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Price</span>
            </div>
            <input
              type="text"
              tabIndex={2}
              className="input input-bordered w-full"
            />
            <div className="label py-0">
              <span className="label-text-alt text-xs text-red-400">
                &nbsp;
              </span>
            </div>
          </label>

          {/* Cost and Profit */}
          <div className="flex w-full flex-row gap-2">
            {/* Cost */}
            <label className="form-control ">
              <div className="form-control-label  ">
                <span className="label-text-alt text-gray-400">Cost</span>
              </div>
              <input
                tabIndex={3}
                type="text"
                className="input input-bordered w-full"
              />
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  &nbsp;
                </span>
              </div>
            </label>

            {/* Profit */}
            <div className="form-control input input-bordered relative flex flex-row items-center">
              <div className="form-control-label  ">
                <span className="label-text-alt text-gray-400">Profit</span>
              </div>
              <input
                type="text"
                defaultValue="50"
                className="input w-[30px] border-none bg-transparent px-0 focus:outline-none"
                maxLength={2}
              />
              <p className="-ml-2">%</p>
              <input
                type="text"
                placeholder="Profit"
                className="input w-full border-none bg-transparent px-0  pl-4 focus:outline-none"
              />
            </div>
          </div>

          {/* Images */}
          <ProductImages
            onImagesChange={() => {}}
            images={productDetails?.images || []}
          />

          {/* Track Stock */}
          <div className="form-control flex w-full flex-row justify-between py-2">
            <span>Track Stock</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>

          {/* Manage Variant */}
          <button className="flex-start btn btn-outline btn-primary btn-md w-full flex-shrink-0 flex-row flex-nowrap justify-between ">
            <div className="flex flex-row items-center gap-2">
              <HomeIcon className="w-5 flex-shrink-0 " />
              <p className="">Manage Variant</p>
            </div>
            <ChevronRightIcon className="w-5 flex-shrink-0 " />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
