import { Routes, Route } from 'react-router-dom'
import Layout from 'components/Layout'
import Home from 'screens/Home'
import { AppPath } from './AppRoutes.types'
import Orders from 'screens/Orders'
import ProductMenu from 'screens/Product/ProductMenu'
import ProtectedRoute from './ProtectedRoutes'
import Profile from 'screens/Profile'
import Store from 'screens/Store'
import AddProduct from 'screens/Product/AddProduct'
import ProductOverview from 'screens/Product/ProductOverview'
import Error from 'screens/Error'
import ViewProduct from 'screens/Product/ViewProduct'
import Settings from 'screens/Settings'
import RecipeOverview from 'screens/Recipe/RecipeOverview'
import AddRecipe from 'screens/Recipe/AddRecipe'
import Staff from 'screens/Staff'
import ViewRecipe from 'screens/Recipe/ViewRecipe'
import { PropsWithChildren } from 'react'
import Inventory from 'screens/Inventory'

const Header = ({ children }: PropsWithChildren) => {
  return (
    <div className="sticky left-0 right-0 top-0  h-[50px] w-full border-b-2 border-black">
      {children}
    </div>
  )
}

const TestComponent = () => {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute h-[2000px] w-1/3 bg-red-300 ">
        <Header>Header 1</Header>
        <p className="text-2xl">First screen</p>
      </div>
      <div className="absolute right-0 h-[2000px] w-1/3 bg-blue-300 ">
        <Header>Header 2</Header>

        <p className="text-2xl">Second screen</p>
      </div>
      {/* <div className="absolute right-0 h-[2000px] w-1/3 bg-red-300 ">
        <div className="fixed left-0 right-0 top-0 mb-[50px] h-[50px] w-full border-b-2">
          Header
        </div>
        <p className="text-2xl">First screen</p>
      </div> */}
    </div>
  )
}

const AppRoutes = () => (
  <Routes>
    <Route path="/test" element={<TestComponent />} />
    <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
      <Route index element={<ProductMenu />} />
      <Route path={AppPath.Home} element={<Home />} />
      <Route path={AppPath.Orders} element={<Orders />} />
      <Route path={AppPath.Products} element={<ProductMenu />} />
      <Route
        path={AppPath.ProductOverview}
        element={<ProtectedRoute element={<ProductOverview />} />}
      />
      <Route
        path={AppPath.RecipeOverview}
        element={<ProtectedRoute element={<RecipeOverview />} />}
      />
      <Route
        path={AppPath.Settings}
        element={<ProtectedRoute element={<Settings />} />}
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
      path={AppPath.Inventory}
      element={<ProtectedRoute element={<Inventory />} />}
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
    />
  </Routes>
)

export default AppRoutes
