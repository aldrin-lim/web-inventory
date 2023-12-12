import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { AppPath } from 'routes/AppRoutes.types'
import { useNavigate } from 'react-router-dom'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

const EmptyProducts = () => {
  const navigate = useNavigate()
  const onAddProduct = () => {
    localStorage.setItem('productAdded', 'true')
    navigate(AppPath.AddProduct)
  }
  return (
    <div className="section flex h-full w-full flex-col items-center justify-center gap-4 text-center">
      <div className="w-full">
        <Toolbar
          items={[
            <ToolbarButton
              key="cancel"
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(AppPath.Products)}
            />,
            <ToolbarTitle key={1} title="Products" />,
            <div key={2} />,
          ]}
        />
      </div>
      <div className="mt-10 flex h-full w-full flex-col gap-6">
        <h1 className="text-xl font-bold">Empty Inventory</h1>
        <p>
          Easily add your items to populate your inventory and manage them
          seamlessly
        </p>
        <button
          onClick={onAddProduct}
          className="btn btn-success mx-auto w-[200px] text-white"
          color="green"
        >
          Add Product
        </button>
      </div>
    </div>
  )
}

export default EmptyProducts
