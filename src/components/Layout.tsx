import useUser from 'hooks/useUser'
import { Navigate, Outlet } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const Layout = () => {
  const { error } = useUser()

  if (error) {
    return <Navigate to={AppPath.Error} replace />
  }

  return (
    <>
      <Outlet />
    </>
  )
}

export default Layout
