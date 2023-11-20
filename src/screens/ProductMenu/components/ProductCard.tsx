import { useState } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'
import MiddleTruncatedText from 'components/MiddleTruncatedText'

type ProductCardProps = {
  name: string
  status?: string
  quantity: number
  image?: string
}

const ProductCard = (props: ProductCardProps) => {
  const { name, status, quantity, image } = props

  // State to track if the image has failed to load
  const [isImageBroken, setIsImageBroken] = useState(false)

  // Function to call when the image fails to load
  const handleImageError = () => {
    setIsImageBroken(true)
  }

  return (
    <div className="card card-compact w-[155px] border border-gray-300 bg-base-100">
      <figure className="h-[155px] w-[155px] bg-gray-300">
        {/* Show image or PhotoIcon based on image load status */}
        {image && !isImageBroken ? (
          <img src={image} alt="Product picture" onError={handleImageError} />
        ) : (
          <PhotoIcon className="w-24 text-gray-400" />
        )}
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
