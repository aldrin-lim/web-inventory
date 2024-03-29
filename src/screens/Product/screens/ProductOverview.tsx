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
import { Bars3Icon } from '@heroicons/react/24/solid'

import { ComponentProps, useEffect } from 'react'
import { Product } from 'types/product.types'
import { Analytics } from 'util/analytics'
import GetStarted from '../ProductOverview/components/GetStarted'
import ProductList from '../ProductOverview/components/ProductList'
import Inventory from '../Inventory'
import EditProduct from './EditProduct'
import NewProduct from './NewProduct'
import useBoundStore from 'stores/useBoundStore'

enum ScreenPath {
  New = `new`,
  List = `list`,
  Edit = `:id`,
}

const ProductOverview = () => {
  const navigate = useNavigate()

  useEffect(() => {
    Analytics.trackPageView('All Products')
  }, [])

  const { products, isLoading, error } = useAllProducts()

  const resolvedPath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvedPath.pathname

  const outOfStocks = products.filter((product) => product.outOfStock === true)
  const inStocks = products.filter((product) => product.outOfStock === false)

  const hasOutOfStockProducts = outOfStocks.length > 0

  const orientation: ComponentProps<typeof ProductList>['orientation'] =
    hasOutOfStockProducts ? 'horizontal' : 'vertical'

  const reset = useBoundStore((state) => state.resetProductForm)
  useEffect(() => {
    if (isParentScreen) {
      reset()
    }
  }, [isParentScreen, reset])

  const viewProduct = (product: Product) => {
    navigate(product.id)
  }

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton />
    }

    if (products.length === 0) {
      return <GetStarted />
    }

    return (
      <div className="ProductOverview absolute top-14 flex w-full flex-col gap-4">
        {/* IN STOCKS */}
        <ProductList
          onViewAll={() => navigate(ScreenPath.List)}
          onProductSelect={viewProduct}
          products={inStocks}
          orientation={orientation}
        />

        <ProductList
          title="Out of Stock"
          onViewAll={() => navigate(ScreenPath.List)}
          onProductSelect={viewProduct}
          products={outOfStocks}
          orientation={orientation}
        />
      </div>
    )
  }

  if (error) {
    return <Navigate to={AppPath.Error} replace />
  }

  const addProduct = () => {
    navigate(ScreenPath.New)
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
          middle={<ToolbarTitle title="Products" />}
          end={<ToolbarButton label="Add" onClick={addProduct} />}
        />
        {renderContent()}
      </div>
      <Routes>
        <Route path={`${ScreenPath.New}/*`} element={<NewProduct />} />
        <Route path={`${ScreenPath.List}/*`} element={<Inventory />} />
        <Route path={`:id/*`} element={<EditProduct />} />
      </Routes>
    </>
  )
}

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton h-[24px] w-full rounded-md"></div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center lg:block" />
        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center lg:block" />
      </div>
    </div>
  )
}

export default ProductOverview
