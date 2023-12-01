import { ProductDetailProvider } from 'screens/Product/contexts/ProductDetailContext'
import ProductDetail from 'screens/Product/ProductDetail'

const AddProduct = () => {
  return (
    <div>
      <ProductDetailProvider mode="add">
        <ProductDetail />
      </ProductDetailProvider>
    </div>
  )
}

export default AddProduct
