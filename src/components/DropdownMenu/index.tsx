import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import DropdownButtonItem from './components/DropdownButtonItem'

export type DropdownProps = {
  dropdownClassName?: string
  items: Array<{
    icon?: React.ReactNode
    text: string
    onClick?: () => void
    disabled?: boolean
  }>
  disabled?: boolean
  buttonClassName?: string
}

const DropdownButton = (props: DropdownProps) => {
  const {
    items,
    buttonClassName,
    disabled = false,
    dropdownClassName = '',
  } = props
  const [open, setOpen] = useState(false)

  return (
    <div
      tabIndex={0}
      className={[
        'dropdown dropdown-end inline-flex w-auto',
        open ? 'dropdown-open' : '',
        dropdownClassName,
      ].join(' ')}
      onBlur={() => {
        setTimeout(() => {
          setOpen(false)
        }, 50)
      }}
    >
      <label
        onClick={() => setOpen((prev) => !prev)}
        className={`btn ${buttonClassName}`}
      >
        <EllipsisVerticalIcon className="w-8 " />
      </label>
      {open && (
        <div className="dop menu dropdown-content top-10 z-10 flex w-36 flex-col overflow-hidden rounded-md border bg-white p-0 shadow">
          {items.map((item, index) => {
            if (item.disabled) {
              return null
            }
            return (
              <DropdownButtonItem key={index} {...item} disabled={disabled} />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DropdownButton
