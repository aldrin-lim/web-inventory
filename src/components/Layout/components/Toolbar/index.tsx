import React from 'react'
import './styles.css'
type ToolbarProps = {
  // items: Array<React.ReactNode>
  start?: React.ReactNode
  middle?: React.ReactNode
  end?: React.ReactNode
}

const Toolbar: React.FC<ToolbarProps> = ({ start, middle, end }) => {
  return (
    <div className="ToolbarContainer sticky left-0 top-0 z-10 w-full border-b bg-base-100 shadow-sm">
      <div className="Toolbar grid w-full grid-cols-12 items-end bg-base-100 [&>*:nth-child(1)]:justify-start [&>*:nth-child(3)]:justify-end">
        <div className="col-span-3">{start}</div>
        <div className="col-span-6">{middle}</div>
        <div className="ToolbarItemEnd col-span-3">{end} </div>
      </div>
    </div>
  )
}

export default Toolbar
