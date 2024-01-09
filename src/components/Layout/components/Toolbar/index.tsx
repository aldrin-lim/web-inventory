import React from 'react'

type ToolbarProps = {
  items: Array<React.ReactNode>
}

const Toolbar: React.FC<ToolbarProps> = ({ items }) => {
  return (
    <div className="ToolbarContainer fixed left-0 w-screen bg-base-100 px-6">
      <div className="Toolbar grid w-full grid-cols-3 items-end bg-base-100 [&>*:nth-child(1)]:justify-start [&>*:nth-child(3)]:justify-end">
        {items}
      </div>
    </div>
  )
}

export default Toolbar
