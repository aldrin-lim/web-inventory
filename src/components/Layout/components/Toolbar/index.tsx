import React from 'react'

type ToolbarProps = {
  items: Array<React.ReactNode>
}

const Toolbar: React.FC<ToolbarProps> = ({ items }) => {
  return (
    <div className="relative flex w-full flex-row items-end justify-between">
      {items}
    </div>
  )
}

export default Toolbar
