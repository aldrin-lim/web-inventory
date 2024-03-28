export enum AppPath {
  Home = '/home',
  Orders = '/orders',
  Settings = '/settings',
  Root = '/',
  AddProduct = '/products/add-product',
  AddRecipe = '/recipes/add-recipe',
  // ProductOverview = '/products/overview',
  Inventory = '/products/inventory',
  // ViewProduct = '/products/:id',
  ViewRecipe = '/recipes/:id',
  Recipe = '/recipes',
  RecipeOverview = '/recipes/overview',
  Profile = '/profile',
  Store = '/store',
  Staff = '/staff',
  Error = '/error',
  Signout = '/signout',
  Reports = '/reports',
  Dashboard = '/reports/dashboard',
  Expenses = '/expenses',

  Products = '/products',
  ProductOverview = '/products/overview',
  ProductList = '/products/list',

  // Add Product
  ProductAdd = '/products/add',
  ProductAddSelectRecipe = '/products/add/select-recipe',
  ProductAddSetRecipe = '/products/add/set-description',

  // Edit Product
  ProductEdit = '/products/:id',
  ProductEditSelectRecipe = '/products/:id/select-recipe',
  ProductEditSetRecipe = '/products/:id/set-description',
}
