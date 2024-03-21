import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

type PrimaryActionProps = {
  disabled?: boolean
  isLoading?: boolean
  items?: Array<{ label: string; onClick?: () => void; icon?: React.ReactNode }>
}

const ToolbarDropdown = (props: PrimaryActionProps) => {
  const [open, setOpen] = useState(false)
  const { disabled = false, isLoading = false, items = [] } = props
  return (
    <div className="flex w-full items-end">
      <div
        tabIndex={0}
        className={[
          'dropdown dropdown-end ml-auto inline-flex w-auto',
          open ? 'dropdown-open' : '',
        ].join(' ')}
        onBlur={() => {
          setTimeout(() => {
            setOpen(false)
          }, 200)
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={() => {
            if (items.length > 0) setOpen(!open)
          }}
          disabled={disabled || isLoading}
        >
          <label className="btn btn-link -mr-4 px-0 normal-case text-blue-400 no-underline ">
            <EllipsisVerticalIcon className="w-6 text-blue-400" />
          </label>
        </button>
        {open && (
          <div className="dop menu dropdown-content top-10 flex w-[170px] flex-col overflow-hidden rounded-md border border-base-300 bg-base-100 p-0 shadow">
            {items.map((item, index) => (
              <button
                disabled={disabled || isLoading}
                key={index}
                onClick={item.onClick}
                className="btn btn-ghost flex w-full flex-row items-center justify-start rounded-none text-base font-normal"
              >
                {item.icon}
                <p className="max-w-[160px] text-left">{item.label}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ToolbarDropdown
