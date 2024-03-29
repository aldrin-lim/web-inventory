import { Route, Routes, useNavigate } from 'react-router-dom'
import EditProduct from '../screens/EditProduct'
import { Product } from 'types/product.types'
import SlidingTransition from 'components/SlidingTransition'

import { Bars3Icon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, PhotoIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'
import { useMemo, useState } from 'react'
import { isExpired, isWithinExpiration } from 'util/data'
import { toNumber } from 'lodash'
import { unitAbbrevationsToLabel } from 'util/measurement'
import { formatToPeso } from 'util/currency'
import GetStarted from '../ProductOverview/components/GetStarted'
import useAllProducts from 'hooks/useAllProducts'

const Inventory = () => {
  const navigate = useNavigate()
  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const { products, isLoading } = useAllProducts()

  const [nameFilter, setNameFilter] = useState('')
  const [filter, setFilter] = useState('all')
  const [subFilter, setSubFilter] = useState('all')

  const filteredProducts = useMemo(() => {
    const subFilterFn = (product: Product) => {
      if (subFilter === 'ingredients') {
        return !product.forSale
      }
      if (subFilter === 'products') {
        return product.forSale
      }
      return product
    }

    if (filter === 'lowStock') {
      return products
        .filter(
          (product) =>
            toNumber(product.stockWarning) >= product.totalQuantity &&
            !product.outOfStock,
        )
        .filter(subFilterFn)
    }

    if (filter === 'outOfStock') {
      return products
        .filter((product) => product.outOfStock)
        .filter(subFilterFn)
    }

    return products
      .filter((product) =>
        product.name.toLowerCase().includes(nameFilter.toLowerCase()),
      )
      .filter(subFilterFn)
  }, [filter, products, subFilter, nameFilter])

  const numberOfNearExpirationProducts = products.filter((product) =>
    isWithinExpiration(product.activeBatch?.expirationDate ?? null),
  ).length

  return (
    <>
      <div className="screen">
        <Toolbar
          start={
            <label
              htmlFor="my-drawer"
              className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
            >
              <Bars3Icon className="w-6" />
            </label>
          }
          middle={<ToolbarTitle key="title" title="Inventory" />}
        />

        <div className="px-4 pb-9">
          {isLoading ? <Skeleton /> : null}
          {!isLoading && products.length === 0 && (
            <div className="py-4">
              <GetStarted />
            </div>
          )}
          {!isLoading && products.length > 0 && (
            <div className="relative flex flex-col gap-0">
              <div className="shadow-xs sticky top-[49px] z-[10] space-y-4 border-b border-b-slate-100 bg-base-100 py-4 ">
                {numberOfNearExpirationProducts > 0 && (
                  <div
                    role="alert"
                    className="1 alert alert-warning flex flex-row gap-2 rounded-md p-2 text-primary-content"
                  >
                    <InformationCircleIcon className="w-4" />
                    <span className="text-xs">
                      <strong>{numberOfNearExpirationProducts}</strong> item(s)
                      are about to expire
                    </span>
                  </div>
                )}
                <input
                  className="input input-bordered w-full "
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Search Product by Name"
                />

                <div className="flex flex-col gap-1">
                  {/* Filter */}
                  <p className="text-sm">Stock:</p>
                  <ul className="menu  menu-horizontal menu-xs !m-0 my-2 bg-base-100 p-0 pl-3">
                    <li>
                      <a
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                      >
                        All
                      </a>
                    </li>
                    <li>
                      <a
                        className={filter === 'lowStock' ? 'active' : ''}
                        onClick={() => setFilter('lowStock')}
                      >
                        Low Stock
                      </a>
                    </li>
                    <li>
                      <a
                        className={filter === 'outOfStock' ? 'active' : ''}
                        onClick={() => setFilter('outOfStock')}
                      >
                        Out of Stock
                      </a>
                    </li>
                  </ul>

                  {/* {Sub Filter} */}
                  <p className="text-sm">Type:</p>
                  <ul className="menu menu-horizontal menu-xs !m-0 my-2 bg-base-100 p-0 pl-3">
                    <li>
                      <a
                        className={subFilter === 'all' ? 'active' : ''}
                        onClick={() => setSubFilter('all')}
                      >
                        All
                      </a>
                    </li>
                    <li>
                      <a
                        className={subFilter === 'products' ? 'active' : ''}
                        onClick={() => setSubFilter('products')}
                      >
                        Products
                      </a>
                    </li>
                    <li>
                      <a
                        className={subFilter === 'ingredients' ? 'active' : ''}
                        onClick={() => setSubFilter('ingredients')}
                      >
                        Ingredients
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="flex w-full flex-row justify-between bg-gray-200 p-2">
                  <p className="uppercase">NAME</p>
                  <p className="uppercase">COST</p>
                </div>
              </div>

              <ul className="menu w-full border-b p-0 [&_li>*]:rounded-md [&_li>*]:border-b">
                {filteredProducts.length === 0 && (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-gray-500">No products found</p>
                  </div>
                )}
                {filteredProducts.map((product) => (
                  <li
                    onClick={() => onProductSelect?.(product)}
                    key={product.id}
                    className="w-full"
                  >
                    <a className="flex">
                      <div className="flex w-full flex-row justify-between gap-4">
                        <div className="flex flex-row items-center gap-2">
                          {product?.images.length === 0 && (
                            <div className="rounded-md bg-base-300 p-2">
                              <PhotoIcon className="w-5  " />
                            </div>
                          )}
                          {product?.images.length > 0 && (
                            <div className="">
                              {isWithinExpiration(
                                product.activeBatch?.expirationDate,
                              ) && (
                                <div className="absolute bg-warning/80">
                                  <InformationCircleIcon className="w-4 text-white" />
                                </div>
                              )}

                              <img
                                src={product.images[0]}
                                className="bg h-9 w-9 rounded-md"
                              />
                            </div>
                          )}
                          <div className="flex flex-col ">
                            <h1
                              className={[
                                'text-base',
                                isWithinExpiration(
                                  product.activeBatch?.expirationDate,
                                )
                                  ? 'text-orange-400'
                                  : '',
                              ].join(' ')}
                            >
                              <MiddleTruncateText
                                text={`${product.name}`}
                                maxLength={getTruncateSize(currentBreakpoint)}
                              />
                            </h1>
                            {renderStockInfo(product)}
                          </div>
                        </div>
                        {product.isBulkCost && (
                          <div className="text-right">
                            <p className="text-base font-medium">
                              ₱ {product.activeBatch?.costPerUnit}/{' '}
                              {unitAbbrevationsToLabel(
                                product.activeBatch?.unitOfMeasurement ?? '',
                              )}
                            </p>
                            <p className="text-xs">
                              Bulk Cost:{' '}
                              {formatToPeso(product.activeBatch?.cost ?? 0)}
                            </p>
                          </div>
                        )}

                        {!product.isBulkCost && (
                          <div className="text-right">
                            <p className="text-base font-medium">
                              {formatToPeso(
                                product.recipe
                                  ? product.recipe.cost
                                  : product.activeBatch?.cost ?? 0,
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Routes>
        <Route
          path={`:id/*`}
          element={
            <SlidingTransition isVisible>
              <EditProduct />
            </SlidingTransition>
          }
        />
      </Routes>
    </>
  )
}

const Skeleton = () => {
  return (
    <div className="mt-4 flex flex-col gap-4 px-4">
      <div className="skeleton h-[48px] rounded-md" />

      <div className="skeleton h-[40px] rounded-md" />

      <div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
      </div>
    </div>
  )
}

const getTruncateSize = (size: ScreenSize) => {
  switch (size) {
    case 'xs':
      return 10
    case 'sm':
      return 20
    case 'md':
      return 200
    case 'lg':
      return 200
    default:
      return 500
  }
}

const renderStockInfo = (product: Product) => {
  const activeBatch = product.activeBatch
  const measurement = unitAbbrevationsToLabel(
    activeBatch?.unitOfMeasurement ?? '',
  )
  if (!activeBatch) {
    return <p className={`text-xs text-red-400`}>No Batches Found</p>
  }

  if (product.outOfStock) {
    return <p className={`text-xs text-red-400`}>Out of stock</p>
  }

  if (isExpired(activeBatch.expirationDate)) {
    return <p className={`text-xs text-orange-400`}>Expired</p>
  }
  if (toNumber(product.stockWarning) >= product.totalQuantity) {
    return (
      <p className={`text-xs text-orange-400`}>
        Low ({product.totalQuantity} {measurement} available)
      </p>
    )
  }

  return (
    <p className={`text-xs`}>
      {product.totalQuantity} {measurement} available
    </p>
  )
}

export default Inventory
