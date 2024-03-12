import { useEffect } from 'react'
import { themeChange } from 'theme-change'
import mixpanel, { Dict } from 'mixpanel-browser'

import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import useUser from 'hooks/useUser'
import { Analytics } from 'util/analytics'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import useSessionTracking from 'hooks/useSessionTracking'

function App() {
  useUser()
  useSessionTracking()
  const navigate = useNavigate()

  const { user } = useUser()

  useEffect(() => {
    themeChange(false)
    mixpanel.track('App Loaded')
  }, [])

  useEffect(() => {
    user?.email && Analytics.identify(user.email)
  }, [user])

  useEffect(() => {
    navigate(AppPath.Root)
  }, [])

  return (
    <div className="App mx-auto flex w-full">
      <ToastContainer
        className={'!left-4 !top-2 !mx-auto !w-[90%] !rounded-md text-xs'}
        toastClassName={'!rounded-md'}
        closeButton={false}
        closeOnClick
      />
      <AppRoutes />
    </div>
  )
}

export default App
