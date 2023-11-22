import { FunnelIcon } from '@heroicons/react/24/outline'

type ProductListFilterProps = {
  enabled?: boolean
  onEnableFilter?: (status: boolean) => void
  outOfStock?: boolean
  onOutOfStockChange: (status: boolean) => void
}

const ProductListFilter = (props: ProductListFilterProps) => {
  const { enabled, onEnableFilter, outOfStock, onOutOfStockChange } = props

  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-ghost m-1">
        <FunnelIcon className="w-6" />
      </summary>
      <div className="menu dropdown-content z-[1] flex w-52 flex-col gap-4 rounded-box border border-gray-200 bg-base-100 p-2 px-4 shadow">
        <div className="form-control flex w-full flex-row justify-between ">
          <span>Show Filters</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            onChange={() => {
              if (onEnableFilter) {
                onEnableFilter(!enabled)
              }
            }}
            checked={enabled}
          />
        </div>
        <div className="form-control flex w-full flex-row justify-between ">
          <span>Out of stock</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={outOfStock}
            onChange={() => {
              if (onOutOfStockChange) {
                onOutOfStockChange(!outOfStock)
              }
            }}
            disabled={!enabled}
          />
        </div>
      </div>
    </details>
  )
}

export default ProductListFilter
