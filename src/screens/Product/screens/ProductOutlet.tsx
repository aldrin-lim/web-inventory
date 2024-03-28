import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const ProductOutlet = () => {
  useEffect(() => {
    console.log('Product module loaded')
  }, [])
  return <Outlet />
}

export default ProductOutlet
