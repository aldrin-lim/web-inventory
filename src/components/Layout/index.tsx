import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <main className="flex w-full flex-col ">
      <Outlet />
      <Navbar />
    </main>
  )
}

export default Layout
