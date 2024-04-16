import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllProducts from 'hooks/useAllProducts'
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { AdjustmentsHorizontalIcon, Bars3Icon } from '@heroicons/react/24/solid'

import { useEffect, useState } from 'react'
import { Product } from 'types/product.types'
import { Analytics } from 'util/analytics'
import GetStarted from '../ProductOverview/components/GetStarted'
import EditProduct from './EditProduct'
import NewProduct from './NewProduct'
import useBoundStore from 'stores/useBoundStore'
import { formatToPeso } from 'util/currency'
import { unitAbbrevationsToLabel } from 'util/measurement'
import { isExpired, isWithinExpiration } from 'util/data'
import { toNumber } from 'util/number'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'
import { InformationCircleIcon, PhotoIcon } from '@heroicons/react/24/outline'

enum ScreenPath {
  New = `new`,
  List = `list`,
  Edit = `:id`,
}

type ProductFilter =
  | 'Available'
  | 'Out Of Stock'
  | 'Low Stock'
  | 'Near Expiration'
  | 'Expired'
  | 'Ingredients'

const ProductOverview = () => {
  const navigate = useNavigate()
  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const resolvedPath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvedPath.pathname

  const { products, isLoading, error } = useAllProducts()
  const [filters, setFilters] = useState<ProductFilter[]>([])
  const [searchFilter, setSearchFilter] = useState<string>('')
  const filteredProducts = products
    .filter((product) => {
      if (filters.length === 0) {
        return true
      }

      const filter: boolean[] = []

      // Conditionally push filter results based on the presence of filter criteria
      if (filters.includes('Available')) {
        filter.push(
          product.outOfStock === false || product.allowBackOrder === true,
        )
      }
      if (filters.includes('Out Of Stock')) {
        filter.push(
          product.outOfStock === true && product.allowBackOrder === false,
        )
      }
      if (filters.includes('Low Stock')) {
        filter.push(toNumber(product.stockWarning) >= product.totalQuantity)
      }
      if (filters.includes('Near Expiration')) {
        filter.push(
          isWithinExpiration(product.activeBatch?.expirationDate ?? null),
        )
      }
      if (filters.includes('Expired')) {
        filter.push(isExpired(product.activeBatch?.expirationDate ?? null))
      }
      if (filters.includes('Ingredients')) {
        filter.push(product.forSale === false)
      }

      // Return true if all conditions in the filter are true (logical AND of all conditions)
      return filter.every((f) => f)
    })
    .filter((product) => {
      return product.name.toLowerCase().includes(searchFilter.toLowerCase())
    })

  const reset = useBoundStore((state) => state.resetProductForm)

  useEffect(() => {
    Analytics.trackPageView('All Products')
  }, [])

  useEffect(() => {
    if (isParentScreen) {
      reset()
    }
  }, [isParentScreen, reset])

  const viewProduct = (product: Product) => {
    navigate(product.id)
  }

  const allFilters = [
    'Available',
    'Out Of Stock',
    'Low Stock',
    'Near Expiration',
    'Expired',
    'Food',
    'Beverage',
    'Ingredients',
  ] as ProductFilter[]

  const renderCheckbox = (label: ProductFilter) => {
    return (
      <label className="label cursor-pointer justify-start gap-4">
        <input
          type="checkbox"
          className="checkbox-primary checkbox"
          onClick={() => {
            if (filters.includes(label)) {
              setFilters(filters.filter((filter) => filter !== label))
            } else {
              setFilters([...filters, label])
            }
          }}
        />
        <span className="label-text">{label}</span>
      </label>
    )
  }

  const addProduct = () => {
    navigate(ScreenPath.New)
  }

  if (error) {
    return <Navigate to={AppPath.Error} replace />
  }

  if (isLoading) {
    return <Skeleton />
  }

  if (products.length === 0) {
    return (
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
          middle={<ToolbarTitle title="Inventory" />}
          end={<ToolbarButton label="New" onClick={addProduct} />}
        />
        <GetStarted />
      </div>
    )
  }

  return (
    <>
      <div className={[isParentScreen ? 'screen' : 'hidden'].join(' ')}>
        <Toolbar
          start={
            <label
              htmlFor="my-drawer"
              className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
            >
              <Bars3Icon className="w-6" />
            </label>
          }
          middle={<ToolbarTitle title="Inventory" />}
          end={<ToolbarButton label="New" onClick={addProduct} />}
        />
        <div className="sticky top-[48px] z-[1] flex flex-row items-center gap-2 bg-base-100  pb-0">
          <div className={`dropdown dropdown-bottom `}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-sm text-secondary"
            >
              <AdjustmentsHorizontalIcon className="w-8" />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content  w-52 gap-4 rounded-box border bg-base-100 p-2 shadow"
            >
              <div className="form-control">
                {allFilters.map((filter) => renderCheckbox(filter))}
              </div>
              <button
                onClick={() => {
                  const activeElement = document.activeElement as HTMLElement
                  console.log(activeElement)
                  activeElement.blur()
                }}
                className="btn btn-sm"
              >
                Close
              </button>
            </ul>
          </div>
          <label className="form-control w-full">
            <input
              className="input input-bordered w-full focus:outline-none"
              placeholder="Search"
              onChange={(e) => {
                setSearchFilter(e.target.value)
              }}
            />
          </label>
        </div>
        <div className="Filter flex flex-col gap-2">
          <div className="flex flex-row justify-between bg-base-content/10 p-2 py-1">
            <p className="inline-block text-sm font-bold">Item</p>
            <p className="inline-block text-sm font-bold">Cost</p>
          </div>
          <ul className="menu w-full border-b p-0 [&_li>*]:rounded-md [&_li>*]:border-b">
            {filteredProducts.length === 0 && (
              <div className="flex h-32 items-center justify-center">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
            {filteredProducts.map((product) => (
              <li
                // onClick={() => onProductSelect?.(product)}
                onClick={() => viewProduct(product)}
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
      </div>
      <Routes>
        <Route path={`${ScreenPath.New}/*`} element={<NewProduct />} />
        <Route path={`:id/*`} element={<EditProduct />} />
      </Routes>
    </>
  )
}

const Skeleton = () => {
  return (
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
        middle={<ToolbarTitle title="Inventory" />}
      />
      <div className="mt-4 flex flex-col gap-4">
        <div className="skeleton h-[40px] rounded-md" />

        <div className="skeleton h-[28px] rounded-md" />

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
          <div className=" px-4 py-2">
            <div className="skeleton h-[40px] rounded-md" />
          </div>
          <div className=" px-4 py-2">
            <div className="skeleton h-[40px] rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

const renderStockInfo = (product: Product) => {
  const activeBatch = product.activeBatch
  const measurement = unitAbbrevationsToLabel(
    activeBatch?.unitOfMeasurement ?? '',
  )
  if (!activeBatch) {
    return <p className={`text-xs text-red-400`}>No Batches Found</p>
  }

  if (product.allowBackOrder && product.outOfStock) {
    if (product.outOfStock) {
      return (
        <p className={`text-xs`}>
          {product.batches.reduce((acc, batch) => acc + batch.quantity, 0)}{' '}
          {measurement}
        </p>
      )
    }
  }

  if (product.outOfStock) {
    return (
      <span className={`text-xs text-red-400`}>
        Out of stock
        {isExpired(activeBatch.expirationDate) && ` • Expired`}
      </span>
    )
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

export default ProductOverview
