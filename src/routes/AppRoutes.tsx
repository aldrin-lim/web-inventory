import { Routes, Route } from 'react-router-dom'
import Layout from 'components/Layout'
import Home from 'screens/Home'
import { AppPath } from './AppRoutes.types'
import Orders from 'screens/Orders'
import Products from 'screens/Products'
import AddProduct from 'screens/AddProduct'
import ProtectedRoute from './ProtectedRoutes'
import Profile from 'screens/Profile'
import Store from 'screens/Store'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
      <Route index element={<Products />} />
      <Route path={AppPath.Home} element={<Home />} />
      <Route path={AppPath.Orders} element={<Orders />} />
      <Route path={AppPath.Products}>
        <Route index element={<Products />} />
        <Route path={AppPath.AddProduct} element={<AddProduct />} />
      </Route>
      <Route path={AppPath.Profile} element={<Profile />} />
      <Route path={AppPath.Store} element={<Store />} />
    </Route>
  </Routes>
)

export default AppRoutes
