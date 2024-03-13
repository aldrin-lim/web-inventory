import { useEffect } from 'react'
import { themeChange } from 'theme-change'

import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import useUser from 'hooks/useUser'
import { Analytics } from 'util/analytics'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

function App() {
  useUser()
  const navigate = useNavigate()

  const { user } = useUser()

  useEffect(() => {
    themeChange(false)
  }, [])

  useEffect(() => {
    if (import.meta.env.NODE_ENV === 'production') {
      console.log('production')
      if (user?.email) {
        Analytics.identify(user.email)
      }
    }
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
