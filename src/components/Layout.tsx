import useUser from 'hooks/useUser'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  useUser()
  return (
    <>
      <Outlet />
    </>
  )
}

export default Layout
