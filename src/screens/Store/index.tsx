import { useEffect } from 'react'
import StoreDetail from './StoreDetail'
import { Analytics } from 'util/analytics'

const Store = () => {
  useEffect(() => {
    Analytics.trackPageView('Store Detail')
  }, [])
  return (
    <div className="w-full">
      <StoreDetail />
    </div>
  )
}

export default Store
