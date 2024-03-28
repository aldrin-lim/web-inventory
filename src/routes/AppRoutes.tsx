import { Routes, Route, Navigate } from 'react-router-dom'
import { AppPath } from './AppRoutes.types'
import ProtectedRoute from './ProtectedRoutes'
import Error from 'screens/Error'
import RecipeOverview from 'screens/Recipe/RecipeOverview'
import AddRecipe from 'screens/Recipe/AddRecipe'
import ViewRecipe from 'screens/Recipe/ViewRecipe'
import Inventory from 'screens/Product/Inventory'
import Layout from 'components/Layout'
import Store from 'screens/Store'
import Profile from 'screens/Profile'
import SignoutScreen from 'components/SignoutScreen'
import Dashboard from 'screens/Report/Dashboard'
import Expense from 'screens/Expense'
import ProductOverview from 'screens/Product/screens/ProductOverview'

const AppRoutes = () => (
  <Routes>
    <Route path={AppPath.Root} element={<Layout />}>
      <Route index element={<ProtectedRoute element={<Dashboard />} />} />
      <Route
        path={`${AppPath.Products}/*`}
        element={<ProtectedRoute element={<ProductOverview />} />}
      />
      {/* <Route
        path={`${AppPath.ViewProduct}/*`}
        element={<ProtectedRoute element={<ViewProduct />} />}
      /> */}
      <Route
        path={`${AppPath.Recipe}/*`}
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
        path={AppPath.Dashboard}
        element={<ProtectedRoute element={<Dashboard />} />}
      />
      <Route
        path={`${AppPath.Expenses}/*`}
        element={<ProtectedRoute element={<Expense />} />}
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
    <Route path={AppPath.Signout} element={<SignoutScreen />} />
    <Route path="*" element={<Navigate to={AppPath.Root} />} />
    <Route
      path={AppPath.Error}
      element={<ProtectedRoute element={<Error />} />}
    />
  </Routes>
)

export default AppRoutes
