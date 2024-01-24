import { Product } from 'types/product.types'
import ProductCard from '../ProductCard'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const verticalScrollStyle =
  'grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
const horizontalScrollSyle = 'flex flex-row gap-4'

type Orientation = 'vertical' | 'horizontal'

type ProductListProps = {
  orientation?: Orientation
  products: Product[]
}

const ORIENTATION: Record<Orientation, string> = {
  horizontal: horizontalScrollSyle,
  vertical: verticalScrollStyle,
}

const ProductList = (props: ProductListProps) => {
  const { products, orientation = 'horizontal' } = props
  const navigate = useNavigate()

  if (products.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="font-bold">Available</h2>
        <button
          onClick={() => navigate(AppPath.Inventory)}
          className="btn btn-link h-0 min-h-[20px] px-0 text-cyan-400 no-underline disabled:bg-transparent disabled:text-gray-400"
        >
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className={ORIENTATION[orientation]}>
          {products.map((product) => (
            <ProductCard
              id={product.id as string}
              image={product?.images?.[0] || ''}
              name={product.name}
              key={product.name}
              quantity={product.activeBatch.quantity}
              unitOfMeasurment={product.activeBatch.unitOfMeasurement}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductList
