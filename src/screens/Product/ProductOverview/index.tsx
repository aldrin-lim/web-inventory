import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllProducts from 'hooks/useAllProducts'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

import './styles.css'
import ProductList from './components/ProductList'
import { ComponentProps } from 'react'
import GetStarted from './components/GetStarted'

const ProductOverview = () => {
  const navigate = useNavigate()

  const { products, isLoading } = useAllProducts()

  const outOfStocks = products.filter((product) => product.outOfStock === true)

  const inStocks = products.filter((product) => product.outOfStock === false)

  const hasOutOfStockProducts = outOfStocks.length > 0

  const orientation: ComponentProps<typeof ProductList>['orientation'] =
    hasOutOfStockProducts ? 'horizontal' : 'vertical'

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
        <ProductList products={inStocks} orientation={orientation} />

        <ProductList products={outOfStocks} orientation={orientation} />
      </div>
    )
  }
  return (
    <div className="screen pb-[100px]">
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
