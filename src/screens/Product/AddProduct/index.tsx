import { useEffect } from 'react'
import ProductDetail from 'screens/Product/ProductDetail'
import { Analytics } from 'util/analytics'

const AddProduct = () => {
  useEffect(() => {
    Analytics.trackPageView('Add Product')
  }, [])
  return <ProductDetail />
}

export default AddProduct
