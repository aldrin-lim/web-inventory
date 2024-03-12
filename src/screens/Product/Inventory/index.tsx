import { useLocation, useNavigate } from 'react-router-dom'
import InventoryScreen from 'screens/Inventory'
import useAllProducts from 'hooks/useAllProducts'
import { AppPath } from 'routes/AppRoutes.types'
import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'

const Inventory = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    mixpanel.track_pageview({ page: 'Inventory' })
  }, [])

  const { products, isLoading: isProductsLoading } = useAllProducts()

  return (
    <>
      <InventoryScreen
        isLoading={isProductsLoading}
        products={products}
        onBack={() => navigate(AppPath.Root)}
        onProductSelect={(product) => {
          navigate(`${AppPath.Products}/${product.id}`, {
            state: {
              from: location.pathname,
            },
          })
        }}
      />
    </>
  )
}

export default Inventory
