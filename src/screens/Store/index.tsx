import Toolbar from 'components/Layout/components/Toolbar'
import { ArrowSmallLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const Store = () => {
  const navigate = useNavigate()
  return (
    <div className="section pt-0">
      <Toolbar
        items={[
          <label
            key="12"
            className="btn btn-square btn-ghost drawer-button -ml-4"
            onClick={() => navigate(AppPath.Root)}
          >
            <ArrowSmallLeftIcon className="w-6 text-blue-400" />
          </label>,
        ]}
      />
      <h1>Store</h1>
      <div className="mt-3 flex flex-col gap-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-xs">Store name</span>
          </label>
          <input type="text" className="input input-bordered w-full" />
        </div>
        <button className="btn btn-primary btn-active mt-4 w-auto">Save</button>
      </div>
    </div>
  )
}

export default Store
