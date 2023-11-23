import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useGetProduct from 'hooks/useGetProduct'
import { useParams } from 'react-router-dom'
import { AddProductComponent } from 'screens/AddProduct'
import { ProductDetailProvider } from 'screens/Product/contexts/ProductDetailContext'

const Skeleton = () => (
  <div className="section relative flex flex-col gap-4 pt-0">
    <Toolbar
      items={[
        <ToolbarButton key="cancel" label="Cancel" disabled />,
        <ToolbarTitle key="title" title="View Product" />,
        <ToolbarButton key="save" label="Save" disabled />,
      ]}
    />

    <div className="skeleton h-[47px] w-full rounded-md" />
    <div className="skeleton h-[24px] w-full rounded-md" />
    <div className="skeleton h-[96px] w-full rounded-md" />
    <div className="skeleton h-[154px] w-full rounded-md" />
    <div className="skeleton h-[47px] w-full rounded-md" />
  </div>
)

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>()

  const { product, isLoading } = useGetProduct(id)

  if (isLoading) {
    return <Skeleton />
  }

  return (
    <ProductDetailProvider productDetails={product}>
      <AddProductComponent mode="edit" />
    </ProductDetailProvider>
  )
}

export default ViewProduct
