import { TagIcon, ChevronLeftIcon } from '@heroicons/react/24/solid'
import { AppPath } from 'routes/AppRoutes.types'
import { Link, useNavigate } from 'react-router-dom'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

const EmptyProducts = () => {
  const navigate = useNavigate()
  return (
    <div className="section flex w-full flex-col items-center justify-center gap-4 text-center">
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
      <h1 className="text-xl font-bold">Welcom to Discarte, Juan</h1>
      <TagIcon className="w-24 text-purple-500" />
      <h2 className="text-lg font-bold">Add your first product</h2>
      <p>
        Add physical and digital products to your inventory. It&apos;s super
        easy! 😊
      </p>
      <Link
        to={AppPath.AddProduct}
        className="btn btn-success text-white"
        color="green"
      >
        Add Product
      </Link>
      <div>
        <button className="btn btn-link btn-primary p-0 normal-case no-underline">
          Learn more
        </button>{' '}
        about adding products
      </div>
    </div>
  )
}

export default EmptyProducts
