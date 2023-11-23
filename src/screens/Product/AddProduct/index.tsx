import { ProductDetailProvider } from 'screens/Product/contexts/ProductDetailContext'
import ProductDetail from 'screens/Product/ProductDetail'

const AddProduct = () => {
  return (
    <ProductDetailProvider>
      <ProductDetail mode="add" />
    </ProductDetailProvider>
  )
}

export default AddProduct
