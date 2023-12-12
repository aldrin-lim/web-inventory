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
    products: outOfSotckProducts,
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
    outOfSotckProducts.length === 0 &&
    localStorage.getItem('productAdded') === null
  ) {
    return <GetStarted />
  }

  if (
    !isLoading &&
    products.length === 0 &&
    outOfSotckProducts.length === 0 &&
    localStorage.getItem('productAdded') === 'true'
  ) {
    return <EmptyProducts />
  }

  const showOutOfStock = outOfSotckProducts.length > 0

  if (error) {
    return (
      <div className="ProductOverview section ">
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
    <div className="ProductOverview section">
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
      {products.length > 0 && (
        <>
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="font-bold">Available</h2>
            <button
              className="btn btn-link h-0 min-h-[20px] px-0 text-cyan-400 no-underline disabled:bg-transparent disabled:text-gray-400"
              onClick={() => navigate(AppPath.ProductList)}
              disabled={isLoading}
            >
              View all
            </button>
          </div>
          <div className="flex w-full flex-col items-center justify-start gap-4 overflow-x-auto ">
            <div
              className={`relative w-full ${
                showOutOfStock ? 'h-[230px]' : 'h-full'
              }`}
            >
              <div
                className={`flex flex-row gap-3 ${
                  !showOutOfStock && 'flex-wrap '
                }`}
              >
                {isLoading && (
                  <>
                    <div className="skeleton h-[213px] w-[155px] rounded-md" />
                    <div className="skeleton h-[213px] w-[155px] rounded-md" />
                    <div className="skeleton h-[213px] w-[155px] rounded-md" />
                  </>
                )}
                {!isLoading &&
                  products.map((product) => (
                    <ProductCard
                      id={product.id as string}
                      image={product?.images?.[0] || ''}
                      name={product.name}
                      key={product.name}
                      quantity={product.quantity}
                    />
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      {showOutOfStock && (
        <>
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="font-bold">Out of Stock</h2>
            <button
              className="btn btn-link h-0 min-h-[20px] px-0 text-cyan-400 no-underline disabled:bg-transparent disabled:text-gray-400"
              onClick={() => navigate(AppPath.ProductList + '?outOfStock=true')}
              disabled={isLoading}
            >
              View all
            </button>
          </div>
          <div className="flex w-full flex-col items-center justify-start gap-4 overflow-x-auto ">
            <div className="relative h-[230px] w-full">
              <div className="absolute flex flex-row gap-3 ">
                {isoutOfSotckProductsLoading && (
                  <>
                    <div className="skeleton h-[213px] w-[155px] rounded-md" />
                    <div className="skeleton h-[213px] w-[155px] rounded-md" />
                    <div className="skeleton h-[213px] w-[155px] rounded-md" />
                    <div className="skeleton h-[213px] w-[155px] rounded-md" />
                  </>
                )}
                {!isoutOfSotckProductsLoading &&
                  outOfSotckProducts.map((product) => (
                    <ProductCard
                      id={product.id as string}
                      image={product?.images?.[0] || ''}
                      name={product.name}
                      key={product.name}
                      quantity={product.quantity}
                    />
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductOverview
