import { ProductDetailProvider } from 'screens/Product/contexts/ProductDetailContext'
import ProductDetail from 'screens/Product/ProductDetail'

const AddProduct = () => {
  return (
    <ProductDetailProvider mode="add">
      <ProductDetail />
    </ProductDetailProvider>
  )
}

export default AddProduct
