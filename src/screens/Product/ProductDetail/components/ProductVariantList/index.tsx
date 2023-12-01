import { ProductVariant } from 'types/product.types'

type ProductVariantListProps = {
  variants?: Array<ProductVariant>
}

const ProductVariantList = (props: ProductVariantListProps) => {
  const { variants = [] } = props
  return (
    <div>
      ProductVariantList
      <div></div>
    </div>
  )
}

export default ProductVariantList
