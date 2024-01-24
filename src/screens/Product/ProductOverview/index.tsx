import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllProducts from 'hooks/useAllProducts'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

import './styles.css'
import ProductList from './components/ProductList'
import { ComponentProps } from 'react'
import GetStarted from './components/GetStarted'
import { Product } from 'types/product.types'
import Inventory from 'screens/Inventory'
import SlidingTransition from 'components/SlidingTransition'

const ProductOverview = () => {
  const navigate = useNavigate()

  const location = useLocation()

  const { products, isLoading } = useAllProducts()

  const outOfStocks = products.filter((product) => product.outOfStock === true)

  const inStocks = products.filter((product) => product.outOfStock === false)

  const hasOutOfStockProducts = outOfStocks.length > 0

  const orientation: ComponentProps<typeof ProductList>['orientation'] =
    hasOutOfStockProducts ? 'horizontal' : 'vertical'

  const viewProduct = (product: Product) => {
    navigate(`${AppPath.Products}/${product.id}`)
  }

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton />
    }

    if (products.length === 0) {
      return <GetStarted />
    }

    return (
      <div className="flex flex-col gap-4">
        {/* IN STOCKS */}
        <ProductList
          onViewAll={() => navigate('list')}
          onProductSelect={viewProduct}
          products={inStocks}
          orientation={orientation}
        />

        <ProductList
          onViewAll={() => navigate('list')}
          onProductSelect={viewProduct}
          products={outOfStocks}
          orientation={orientation}
        />
      </div>
    )
  }

  return (
    <>
      <div
        className={[
          'screen pb-[100px]',
          location.pathname === '/products/overview'
            ? 'h-screen overflow-hidden'
            : '',
        ].join(' ')}
      >
        <Toolbar
          items={[
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(AppPath.Products)}
            />,

            <ToolbarTitle key="title" title="Products" />,
            <ToolbarButton
              key={2}
              label="Add"
              onClick={() => navigate(AppPath.AddProduct)}
            />,
          ]}
        />
        {renderContent()}
      </div>
      <SlidingTransition
        direction="right"
        isVisible={location.pathname === '/products/overview/list'}
        zIndex={11}
      >
        <Inventory
          products={products}
          onBack={() => navigate(-1)}
          onProductSelect={viewProduct}
        />
      </SlidingTransition>
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
