import MiddleTruncatedText from 'components/MiddleTruncatedText'
import ImageLoader from 'components/ImageLoader'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

type ProductCardProps = {
  id: string
  name: string
  status?: string
  quantity: number
  image?: string
}

const ProductCard = (props: ProductCardProps) => {
  const { name, status, quantity, image, id } = props
  const navigate = useNavigate()

  const onClick = (id: string) => {
    navigate(`${AppPath.Products}/${id}`)
  }

  return (
    <div
      className="card card-compact w-[155px] cursor-pointer border border-gray-300 bg-base-100"
      onClick={() => onClick(id)}
    >
      <figure className="h-[155px] w-[155px] bg-gray-300">
        {/* Show image or PhotoIcon based on image load status */}
        <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
      </figure>
      <div className="card-body flex flex-col gap-0 !py-2 text-left">
        <h2 className="card-title text-sm">
          <MiddleTruncatedText text={name} maxLength={15} />
        </h2>

        <div className="flex flex-row gap-1 text-xs">
          <span>{status || 'Active'}</span> • <span>{quantity} available</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
