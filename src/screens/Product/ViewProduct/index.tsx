import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useGetProduct from 'hooks/useGetProduct'
import { useNavigate, useParams } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import ProductDetail from 'screens/Product/ProductDetail'
import { ProductDetailProvider } from 'screens/Product/contexts/ProductDetailContext'

const Skeleton = () => {
  const navigate = useNavigate()

  return (
    <div className="screen">
      <Toolbar
        items={[
          <ToolbarButton
            key="cancel"
            label="Cancel"
            onClick={() => navigate(AppPath.ProductOverview)}
          />,
          <ToolbarTitle key="title" title="View Product" />,
          <ToolbarButton key="save" label="Save" disabled />,
        ]}
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

  const { product, isLoading } = useGetProduct(id)

  if (isLoading) {
    return <Skeleton />
  }

  return (
    <ProductDetailProvider productDetails={product} mode="edit">
      <ProductDetail product={product} />
    </ProductDetailProvider>
  )
}

export default ViewProduct
