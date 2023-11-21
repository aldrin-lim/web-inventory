import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllProducts from 'hooks/useAllProducts'
import useUser from 'hooks/useUser'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import EmptyProducts from 'screens/ProductMenu/components/EmptyProduct'
import ProductCard from 'screens/ProductMenu/components/ProductCard'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

const ProductOverview = () => {
  const navigate = useNavigate()

  const { user, isLoading: isUserLoading } = useUser()

  const bussinessId = user?.businesses[0]?.id

  const {
    products,
    isLoading: isProductsLoading,
    error,
  } = useAllProducts(bussinessId, { limit: 4 })

  const isLoading = isUserLoading || isProductsLoading

  if (!isLoading && error) {
    return <Navigate to={AppPath.Error} />
  }

  if (!isLoading && products.length === 0) {
    return <EmptyProducts />
  }

  return (
    <div className="section flex flex-col gap-4 pt-0">
      <Toolbar
        items={[
          <ToolbarButton
            key="save"
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(AppPath.Products)}
            disabled={isLoading}
          />,

          <ToolbarTitle key="title" title="Products" />,
          <ToolbarButton
            key="save"
            label="Add"
            onClick={() => navigate(AppPath.AddProduct)}
            disabled={isLoading}
          />,
        ]}
      />
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
      {/* Scrolls horizontally */}
      <div className="flex w-full flex-col items-center justify-start gap-4 overflow-x-auto ">
        <div className="relative h-[230px] w-full">
          <div className="absolute flex flex-row gap-3 ">
            {isLoading && (
              <>
                <div className="skeleton h-[213px] w-[155px] rounded-md" />
                <div className="skeleton h-[213px] w-[155px] rounded-md" />
                <div className="skeleton h-[213px] w-[155px] rounded-md" />
              </>
            )}
            {!isLoading &&
              products
                .slice(0, 4)
                .map((product) => (
                  <ProductCard
                    image={product?.images?.[0] || ''}
                    name={product.name}
                    key={product.name}
                    quantity={product.quantity}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductOverview
