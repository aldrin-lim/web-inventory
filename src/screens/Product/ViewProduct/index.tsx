import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useGetProduct from 'hooks/useGetProduct'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import ProductDetail from 'screens/Product/ProductDetail'
import { Analytics } from 'util/analytics'

const Skeleton = () => {
  const navigate = useNavigate()

  return (
    <div className="screen">
      <Toolbar
        start={
          <ToolbarButton
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(AppPath.ProductOverview)}
          />
        }
        middle={<ToolbarTitle key="title" title="View Product" />}
        end={<ToolbarButton key="save" label="Save" disabled />}
      />

      <div className="flex flex-col gap-4">
        <div className="skeleton h-[47px] w-full rounded-md" />
        <div className="skeleton h-[24px] w-full rounded-md" />
        <div className="skeleton h-[96px] w-full rounded-md" />
        <div className="skeleton h-[154px] w-full rounded-md" />
        <div className="skeleton h-[47px] w-full rounded-md" />
      </div>
    </div>
  )
}

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    Analytics.trackPageView('Edit Product')
  }, [])

  const { product, isLoading } = useGetProduct(id)

  if (isLoading) {
    return <Skeleton />
  }

  return <ProductDetail product={product} />
}

export default ViewProduct
