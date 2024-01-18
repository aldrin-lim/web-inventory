import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllProducts from 'hooks/useAllProducts'
import useUser from 'hooks/useUser'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import EmptyProducts from 'screens/Product/ProductOverview/components/EmptyProduct'
import ProductCard from 'screens/Product/ProductOverview/components/ProductCard'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import GetStarted from 'screens/Product/ProductOverview/components/GetStarted'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'
import Skeleton from './components/Skeleton'

import './styles.css'
import { getActiveBatch } from '../ProductDetail'

const getProductCardNumber = (size: ScreenSize) => {
  switch (size) {
    case 'xs':
    case 'sm':
      return 4
    case 'md':
    case 'lg':
      return 8
    default:
      return 10
  }
}

const ProductOverview = () => {
  const navigate = useNavigate()

  const { user, isLoading: isUserLoading, error: userError } = useUser()

  const bussinessId = user?.businesses[0]?.id
  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const productCardNumber = getProductCardNumber(currentBreakpoint)

  const {
    products,
    isLoading: isProductsLoading,
    error: productError,
  } = useAllProducts(bussinessId, {
    limit: productCardNumber,
    outOfStock: false,
  })

  const {
    products: outOfStockProducts,
    isLoading: isoutOfSotckProductsLoading,
    error: outOfStouckProductError,
  } = useAllProducts(bussinessId, {
    limit: productCardNumber,
    outOfStock: true,
  })

  const error = productError || outOfStouckProductError || userError

  const isLoading =
    isUserLoading || isProductsLoading || isoutOfSotckProductsLoading

  if (isLoading) {
    return <Skeleton />
  }

  if (!isLoading && error) {
    return <Navigate to={AppPath.Error} />
  }

  if (
    !isLoading &&
    products.length === 0 &&
    outOfStockProducts.length === 0 &&
    localStorage.getItem('productAdded') === null
  ) {
    return <GetStarted />
  }

  if (
    !isLoading &&
    products.length === 0 &&
    outOfStockProducts.length === 0 &&
    localStorage.getItem('productAdded') === 'true'
  ) {
    return <EmptyProducts />
  }

  const hasOutOfStocks = outOfStockProducts.length > 0

  const verticalScrollStyle = 'flex-wrap justify-center'
  const horizontalScrollSyle = 'overflow-x-auto'

  if (error) {
    return (
      <div className="ProductOverview main-screen ">
        <Toolbar
          items={[
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(AppPath.Products)}
              disabled={isLoading}
            />,

            <ToolbarTitle key="title" title="Products" />,
            <ToolbarButton
              key={2}
              label="Add"
              onClick={() => navigate(AppPath.AddProduct)}
              disabled={isLoading}
            />,
          ]}
        />
        <div className="my-auto flex h-[400px] w-full items-center justify-center p-6 text-center">
          <p className="text-center text-xs text-gray-400">
            We&apos;re having a bit of trouble fetching your data. Hang tight,
            we&apos;re on it
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="ProductOverview main-screen section">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(AppPath.Products)}
            disabled={isLoading}
          />,

          <ToolbarTitle key="title" title="Products" />,
          <ToolbarButton
            key={2}
            label="Add"
            onClick={() => navigate(AppPath.AddProduct)}
            disabled={isLoading}
          />,
        ]}
      />
      <div className="group flex flex-col gap-4">
        {/* IN STOCKS */}
        {products.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex w-full flex-row items-center justify-between">
              <h2 className="font-bold">Available</h2>
              <button className="btn btn-link h-0 min-h-[20px] px-0 text-cyan-400 no-underline disabled:bg-transparent disabled:text-gray-400">
                View all
              </button>
            </div>
            <div
              className={`flex w-full flex-row gap-x-2 gap-y-4 ${
                hasOutOfStocks ? horizontalScrollSyle : verticalScrollStyle
              }`}
            >
              {products.map((product) => (
                <ProductCard
                  id={product.id as string}
                  image={product?.images?.[0] || ''}
                  name={product.name}
                  key={product.name}
                  quantity={getActiveBatch(product.batches)?.quantity}
                  unitOfMeasurment={
                    getActiveBatch(product.batches).unitOfMeasurement
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* OUT OF STOCKS */}
        {outOfStockProducts.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex w-full flex-row items-center justify-between">
              <h2 className="font-bold">Out of Stocks</h2>
              <button className="btn btn-link h-0 min-h-[20px] px-0 text-cyan-400 no-underline disabled:bg-transparent disabled:text-gray-400">
                View all
              </button>
            </div>
            <div
              className={`flex w-full flex-row gap-x-2 gap-y-4 ${
                hasOutOfStocks ? horizontalScrollSyle : verticalScrollStyle
              }`}
            >
              {outOfStockProducts.map((product) => (
                <ProductCard
                  outOfStock
                  id={product.id as string}
                  image={product?.images?.[0] || ''}
                  name={product.name}
                  key={product.name}
                  quantity={product.quantity}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductOverview
