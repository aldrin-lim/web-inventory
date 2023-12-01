import { ChevronRightIcon } from '@heroicons/react/24/solid'
import ImageLoader from 'components/ImageLoader'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'
import { ProductVariant } from 'types/product.types'

type ProductVariantListProps = {
  variants?: Array<ProductVariant>
  onItemClick: (index: number) => void
}

const getTruncateSize = (size: ScreenSize) => {
  switch (size) {
    case 'xs':
      return 10 - 5
    case 'sm':
      return 25 - 5
    case 'md':
      return 200 - 5
    case 'lg':
      return 200 - 5
    default:
      return 500 - 5
  }
}

const ProductVariantList = (props: ProductVariantListProps) => {
  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const { variants = [] } = props
  return (
    <div>
      {variants.map((product, index) => {
        const thumbnail = product.images && product.images[0]
        // const variant = `${pro}`
        const variant = product.variantOptions
          .map((variant) => variant.value)
          .join('/')
        return (
          <div className="" key={product.name}>
            <button
              // onClick={() => onClick(product.id as string)}
              onClick={() => props.onItemClick(index)}
              className="rounded-row btn btn-ghost no-animation flex w-full flex-row justify-start rounded-none border-b-gray-200 bg-gray-100"
            >
              <figure className="h-[24px] w-[24px]">
                <ImageLoader
                  src={thumbnail}
                  iconClassName="w-6 text-gray-400"
                />
              </figure>
              <div className="flex flex-row gap-2 text-left">
                <div>
                  <p>
                    <MiddleTruncateText
                      text={variant}
                      maxLength={getTruncateSize(currentBreakpoint)}
                    />
                  </p>
                  <p className="ml-auto text-xs font-normal">
                    {product.quantity || 0} available
                  </p>
                </div>
              </div>
              <div className="ml-auto">
                <div className="flex flex-row gap-3">
                  <p>₱ {product.price}</p>
                  <ChevronRightIcon className=" w-5" />
                </div>
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ProductVariantList
