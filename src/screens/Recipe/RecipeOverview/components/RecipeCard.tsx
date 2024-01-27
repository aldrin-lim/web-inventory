import ImageLoader from 'components/ImageLoader'
import MiddleTruncatedText from 'components/MiddleTruncatedText'
import { Recipe } from 'types/recipe.types'

type RecipeMaterialCardProps = {
  recipe: Recipe
  onClick?: () => void
}

const RecipeCard = (props: RecipeMaterialCardProps) => {
  const { recipe, onClick } = props
  const { name, cost, quantity } = recipe
  const image = recipe.images && recipe.images[0]

  return (
    <div
      onClick={onClick}
      className="card card-compact w-[155px] cursor-pointer justify-self-center border border-gray-300 bg-base-100"
    >
      <figure className="h-[155px] w-[155px] bg-gray-300">
        <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
      </figure>
      <div className="card-body flex flex-col gap-0 !py-2 text-left">
        <h2 className="card-title text-sm">
          <MiddleTruncatedText text={name} maxLength={18} />
        </h2>

        <div className="flex flex-row gap-1  text-xs">
          <span className="overflow-hidden truncate text-ellipsis">
            {quantity} available
          </span>
        </div>
      </div>
      <div className="absolute right-2 top-2 rounded-sm bg-purple-300 p-1 text-white">
        {cost.toFixed(2)}
      </div>
    </div>
  )
}

export default RecipeCard
