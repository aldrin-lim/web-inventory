import { Routes, Route } from 'react-router-dom'
import Layout from 'components/Layout'
import Home from 'screens/Home'
import { AppPath } from './AppRoutes.types'
import Orders from 'screens/Orders'
import ProductMenu from 'screens/ProductMenu'
import ProtectedRoute from './ProtectedRoutes'
import Profile from 'screens/Profile'
import Store from 'screens/Store'
import AddProduct from 'screens/AddProduct'
import ProductOverview from 'screens/ProductOverview'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
      <Route index element={<ProductMenu />} />
      <Route path={AppPath.Home} element={<Home />} />
      <Route path={AppPath.Orders} element={<Orders />} />
      <Route path={AppPath.Products} element={<ProductMenu />} />
      <Route
        path={AppPath.ProductOverview}
        element={<ProtectedRoute element={<ProductOverview />} />}
      />
    </Route>
    {/* <Route path={AppPath.Products} element={<Products />} /> */}
    <Route
      path={AppPath.Profile}
      element={<ProtectedRoute element={<Profile />} />}
    />
    <Route
      path={AppPath.Store}
      element={<ProtectedRoute element={<Store />} />}
    />
    <Route
      path={AppPath.AddProduct}
      element={<ProtectedRoute element={<AddProduct />} />}
    />
  </Routes>
)

export default AppRoutes
