import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'
import ProductDetail from 'screens/Product/ProductDetail'

const AddProduct = () => {
  useEffect(() => {
    mixpanel.track_pageview({ page: 'Add Product' })
  }, [])
  return <ProductDetail />
}

export default AddProduct
