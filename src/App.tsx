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
import LoadingCover from 'components/LoadingCover'

function App() {
  const { error } = useUser()
  const navigate = useNavigate()

  const { user, isLoading } = useUser()

  useEffect(() => {
    if (error) {
      navigate(AppPath.Error)
    }
  }, [error])

  useEffect(() => {
    themeChange(false)
  }, [])

  useEffect(() => {
    // if (import.meta.env.NODE_ENV === 'production') {
    console.log('env', import.meta.env.MODE)
    if (import.meta.env.MODE === 'production' && user?.email) {
      Analytics.identify(user.email)
    }
    // }
  }, [user])

  useEffect(() => {
    navigate(AppPath.Root)
  }, [])

  if (isLoading) {
    return <LoadingCover />
  }

  return (
    <>
      <ToastContainer
        className={'!left-4 !top-2 !mx-auto !h-40 !w-[90%] !rounded-md text-xs'}
        toastClassName={'!rounded-md'}
        closeButton={false}
        closeOnClick
      />
      <div className="h-full max-h-max w-full">
        <AppRoutes />
      </div>
    </>
  )
}

export default App
