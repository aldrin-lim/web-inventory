import { useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { attachToken } from './util/http'
import { useEffect } from 'react'
import { themeChange } from 'theme-change'

import './App.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  useEffect(() => {
    themeChange(false)
  }, [])

  useMemo(() => {
    if (isAuthenticated) {
      attachToken(getAccessTokenSilently)
    }
  }, [getAccessTokenSilently, isAuthenticated])

  return (
    <div className="App" data-theme="">
      <AppRoutes />
    </div>
  )
}

export default App
