import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'
import StoreDetail from './StoreDetail'

const Store = () => {
  useEffect(() => {
    mixpanel.track_pageview({ page: 'Store Detail' })
  }, [])
  return (
    <div className="w-full">
      <StoreDetail />
    </div>
  )
}

export default Store
