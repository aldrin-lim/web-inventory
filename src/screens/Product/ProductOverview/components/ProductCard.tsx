import MiddleTruncatedText from 'components/MiddleTruncatedText'
import ImageLoader from 'components/ImageLoader'
import { Product } from 'types/product.types'
import Big from 'big.js'
import { formatToPeso } from 'util/currency'
import { unitAbbrevationsToLabel } from 'util/measurement'

type ProductCardProps = {
  product: Product
  onClick?: (product: Product) => void
}

const ProductCard = (props: ProductCardProps) => {
  const { product, onClick } = props
  const { name, outOfStock, totalQuantity } = product

  const { unitOfMeasurement } = product.activeBatch

  const image = product.images?.[0] || ''

  return (
    <div className="relative  justify-self-center">
      <div className="absolute top-2 z-[9] flex w-full items-center justify-between px-2">
        {product.isBulkCost === false && (
          <div className="bg-primary/50 p-1 text-sm text-white">
            {formatToPeso(new Big(product.price).toNumber())}
          </div>
        )}
        {product.isBulkCost === true && (
          <div className="bg-primary/50 p-1 text-sm text-white">
            {formatToPeso(new Big(product.price).toNumber())} /
            {unitAbbrevationsToLabel(unitOfMeasurement)}
          </div>
        )}
      </div>
      <div
        className={`ProductCard card card-compact relative w-[155px] cursor-pointer border border-gray-300  bg-base-100 `}
        onClick={() => onClick?.(product)}
      >
        <figure className="top-1 h-[155px] w-[153px] overflow-hidden  bg-gray-300">
          {/* Show image or PhotoIcon based on image load status */}
          <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
        </figure>
        <div className="card-body flex flex-col gap-0 !py-2 text-left">
          <h2 className="card-title text-sm">
            <MiddleTruncatedText text={name} maxLength={18} />
          </h2>

          {product.trackStock && (
            <div className="flex flex-row gap-1  text-xs">
              <span
                className={`overflow-hidden truncate text-ellipsis ${
                  outOfStock ? 'text-red-400' : ''
                }`}
              >
                {outOfStock ? (
                  'Out of stock'
                ) : (
                  <>
                    {totalQuantity} {unitOfMeasurement} available
                  </>
                )}
              </span>
            </div>
          )}
          {product.recipe && (
            <div className="flex flex-row gap-1  text-xs">
              <span
                className={`overflow-hidden truncate text-ellipsis ${
                  outOfStock ? 'text-red-400' : ''
                }`}
              >
                {outOfStock ? (
                  'Out of stock'
                ) : (
                  <>
                    {totalQuantity} {unitOfMeasurement} available
                  </>
                )}
              </span>
            </div>
          )}
          {/* TODO: Fix this via css */}
          {!product?.recipe && !product.trackStock && (
            <div className="flex flex-row gap-1  text-xs">
              <span
                className={`overflow-hidden truncate text-ellipsis ${
                  outOfStock ? 'text-red-400' : ''
                }`}
              >
                &nbsp;
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
