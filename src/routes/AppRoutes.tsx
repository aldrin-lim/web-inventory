import { Routes, Route } from 'react-router-dom'
import Home from 'screens/Home'
import { AppPath } from './AppRoutes.types'
import ProtectedRoute from './ProtectedRoutes'
import Profile from 'screens/Profile'
import Store from 'screens/Store'
import AddProduct from 'screens/Product/AddProduct'
import ProductOverview from 'screens/Product/ProductOverview'
import Error from 'screens/Error'
import ViewProduct from 'screens/Product/ViewProduct'
import AddRecipe from 'screens/Recipe/AddRecipe'
import Staff from 'screens/Staff'
import ViewRecipe from 'screens/Recipe/ViewRecipe'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute element={<Home />} />} />
    <Route
      path={`${AppPath.Products}/*`}
      element={<ProtectedRoute element={<ProductOverview />} />}
    />
    {/* <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
      <Route index element={<ProductMenu />} />
      <Route path={AppPath.Home} element={<Home />} />
      <Route path={AppPath.Orders} element={<Orders />} />
      <Route path={AppPath.Products} element={<ProductMenu />} />
      <Route
        path={AppPath.RecipeOverview}
        element={<ProtectedRoute element={<RecipeOverview />} />}
      />
      <Route
        path={AppPath.Settings}
        element={<ProtectedRoute element={<Settings />} />}
      />
    </Route> */}
    {/* <Route path={AppPath.Products} element={<Products />} /> */}
    {/* <Route
      path={AppPath.Profile}
      element={<ProtectedRoute element={<Profile />} />}
    />
    <Route
      path={AppPath.Store}
      element={<ProtectedRoute element={<Store />} />}
    />
    <Route
      path={AppPath.Staff}
      element={<ProtectedRoute element={<Staff />} />}
    />
    <Route
      path={AppPath.AddProduct}
      element={<ProtectedRoute element={<AddProduct />} />}
    />
    <Route
      path={AppPath.AddRecipe}
      element={<ProtectedRoute element={<AddRecipe />} />}
    />
    <Route
      path={AppPath.ViewProduct}
      element={<ProtectedRoute element={<ViewProduct />} />}
    />
    <Route
      path={AppPath.ViewRecipe}
      element={<ProtectedRoute element={<ViewRecipe />} />}
    />

    <Route
      path={AppPath.Error}
      element={<ProtectedRoute element={<Error />} />}
    /> */}
  </Routes>
)

export default AppRoutes
