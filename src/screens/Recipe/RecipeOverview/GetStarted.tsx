import { NewspaperIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const GetStarted = () => {
  const navigate = useNavigate()
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-xl font-bold">Welcome to Qrafter</h1>
      <NewspaperIcon className="w-24 text-purple-500" />
      <h2 className="text-lg font-bold">Craft your first recipe</h2>
      <p>Craft your awesome recipe. It&apos;s super easy! </p>
      <button
        onClick={() => navigate(AppPath.AddRecipe)}
        className="btn btn-success text-white"
        color="green"
      >
        Start Crafting
      </button>
      <div>
        <button className="btn btn-link btn-primary p-0 normal-case no-underline">
          Learn more
        </button>{' '}
        about crafting products
      </div>
    </div>
  )
}

export default GetStarted
