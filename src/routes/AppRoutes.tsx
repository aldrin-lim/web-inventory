import { Routes, Route, Navigate } from 'react-router-dom'
import Home from 'screens/Home'
import { AppPath } from './AppRoutes.types'
import ProtectedRoute from './ProtectedRoutes'
import ProductOverview from 'screens/Product/ProductOverview'
import AddProduct from 'screens/Product/AddProduct'
import ViewProduct from 'screens/Product/ViewProduct'
import Error from 'screens/Error'
import RecipeOverview from 'screens/Recipe/RecipeOverview'
import AddRecipe from 'screens/Recipe/AddRecipe'
import ViewRecipe from 'screens/Recipe/ViewRecipe'
import Inventory from 'screens/Product/Inventory'
import Layout from 'components/Layout'
import Store from 'screens/Store'
import Profile from 'screens/Profile'

const AppRoutes = () => (
  <Routes>
    <Route path={AppPath.Root} element={<Layout />}>
      <Route index element={<ProtectedRoute element={<Home />} />} />
      <Route
        path={`${AppPath.Products}`}
        element={<ProtectedRoute element={<ProductOverview />} />}
      />
      <Route
        path={`${AppPath.ProductOverview}/*`}
        element={<ProtectedRoute element={<ProductOverview />} />}
      />
      <Route
        path={`${AppPath.AddProduct}/*`}
        element={<ProtectedRoute element={<AddProduct />} />}
      />
      <Route
        path={`${AppPath.ViewProduct}/*`}
        element={<ProtectedRoute element={<ViewProduct />} />}
      />
      <Route
        path={`${AppPath.RecipeOverview}/*`}
        element={<ProtectedRoute element={<RecipeOverview />} />}
      />
      <Route
        path={`${AppPath.AddRecipe}/*`}
        element={<ProtectedRoute element={<AddRecipe />} />}
      />
      <Route
        path={`${AppPath.ViewRecipe}/*`}
        element={<ProtectedRoute element={<ViewRecipe />} />}
      />
      <Route
        path={`${AppPath.Inventory}/*`}
        element={<ProtectedRoute element={<Inventory />} />}
      />
      <Route
        path={AppPath.Store}
        element={<ProtectedRoute element={<Store />} />}
      />
      <Route
        path={AppPath.Profile}
        element={<ProtectedRoute element={<Profile />} />}
      />
    </Route>
    <Route path="*" element={<Navigate to={AppPath.Root} />} />
    <Route
      path={AppPath.Error}
      element={<ProtectedRoute element={<Error />} />}
    />
  </Routes>
)

export default AppRoutes
