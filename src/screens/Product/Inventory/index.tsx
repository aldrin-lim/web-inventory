import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'
import InventoryScreen from 'screens/Inventory'
import useAllProducts from 'hooks/useAllProducts'
import { AppPath } from 'routes/AppRoutes.types'
import { useEffect } from 'react'
import { Analytics } from 'util/analytics'
import EditProduct from '../screens/EditProduct'
import { Product } from 'types/product.types'
import SlidingTransition from 'components/SlidingTransition'

const Inventory = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const resolvedPath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvedPath.pathname

  useEffect(() => {
    Analytics.trackPageView('Inventory')
  }, [])

  const { products, isLoading: isProductsLoading } = useAllProducts()

  const viewProduct = (product: Product) => {
    navigate(product.id)
  }

  return (
    <>
      <div className={isParentScreen ? 'flex' : 'hidden'}>
        <InventoryScreen
          isLoading={isProductsLoading}
          products={products}
          onBack={() => navigate('../')}
          onProductSelect={(product) => {
            viewProduct(product)
          }}
        />
      </div>
      <Routes>
        <Route
          path={`:id/*`}
          element={
            <SlidingTransition isVisible>
              <EditProduct />
            </SlidingTransition>
          }
        />
      </Routes>
    </>
  )
}

export default Inventory
