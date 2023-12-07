import PriceInput from 'components/PriceInput'
import { ProductVariant } from 'types/product.types'

type VariantOptionItemProps = {
  variant: ProductVariant
  onVariantChange?: (key: keyof ProductVariant, value: unknown) => void
}

const VariantOptionItem = ({
  variant,
  onVariantChange,
}: VariantOptionItemProps) => {
  const variantName = variant.variantOptions
    .map((variant) => variant.value)
    .join('/')
  return (
    <div className="flex flex-row items-center gap-2 border border-gray-300 bg-gray-100 p-2">
      <p className="min-w-[120px] max-w-[120px] text-sm ">{variantName}</p>
      <div className="forms w-full overflow-x-auto ">
        <div className="flex flex-row gap-2">
          <div className="form-control w-full">
            <label className="label p-0">
              <span className="label-text text-xs">Price</span>
            </label>
            <PriceInput
              className="input input-bordered w-[80px]"
              placeholder="Price"
              value={variant.price}
              onChange={(newValue) => {
                onVariantChange && onVariantChange('price', newValue)
              }}
            />
          </div>

          <div className="form-control w-full">
            <label className="label p-0">
              <span className="label-text text-xs">Cost</span>
            </label>
            <PriceInput
              className="input input-bordered w-[80px]"
              placeholder="Cost"
              value={variant.cost}
              onChange={(newValue) => {
                onVariantChange && onVariantChange('cost', newValue)
              }}
            />
          </div>

          <div className="form-control w-full">
            <label className="label p-0">
              <span className="label-text text-xs">Qty</span>
            </label>
            <PriceInput
              className="input input-bordered w-[80px]"
              placeholder="Qty"
              value={variant.quantity}
              onChange={(newValue) => {
                onVariantChange && onVariantChange('quantity', newValue)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariantOptionItem