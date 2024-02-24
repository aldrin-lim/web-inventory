import { useNavigate } from 'react-router-dom'
import InventoryScreen from 'screens/Inventory'
import useAllProducts from 'hooks/useAllProducts'
import { AppPath } from 'routes/AppRoutes.types'

const Inventory = () => {
  const navigate = useNavigate()

  const { products, isLoading: isProductsLoading } = useAllProducts()

  return (
    <>
      <InventoryScreen
        isLoading={isProductsLoading}
        products={products}
        onBack={() => navigate(AppPath.Root)}
        onProductSelect={(product) => {
          navigate(`${AppPath.ViewProduct}/${product.id}`)
        }}
      />
    </>
  )
}

export default Inventory
