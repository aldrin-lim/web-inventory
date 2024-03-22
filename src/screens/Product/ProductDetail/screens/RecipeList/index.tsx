import { ChevronLeftIcon, PhotoIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllRecipes from 'hooks/useAllRecipes'
import { useMemo, useState } from 'react'
import GetStarted from 'screens/Recipe/RecipeOverview/GetStarted'
import { RecipeSchema } from 'types/product.types'
import { z } from 'zod'

type RecipeListProps = {
  onRecipeSelect?: (recipe: z.infer<typeof RecipeSchema>) => void
  onBack: () => void
}

const RecipeList = (props: RecipeListProps) => {
  const { onRecipeSelect, onBack } = props

  const { recipes, isLoading } = useAllRecipes()

  const [nameFilter, setNameFilter] = useState('')

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(nameFilter.toLowerCase()),
    )
  }, [nameFilter, recipes])

  return (
    <div className="screen gap-0 pb-[100px]">
      <Toolbar
        start={
          <ToolbarButton
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => {
              onBack()
            }}
          />
        }
        middle={<ToolbarTitle title="Recipes" />}
      />

      {isLoading ? <Skeleton /> : null}
      {!isLoading && recipes.length === 0 && <GetStarted />}
      {!isLoading && recipes.length > 0 && (
        <div className="relative flex flex-col gap-0">
          <div className="shadow-xs sticky top-[49px] z-[10] space-y-4 border-b border-b-slate-100 bg-base-100 py-4 ">
            <input
              className="input input-bordered w-full "
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search Product by Name"
            />
          </div>

          <div className="flex w-full flex-row justify-between bg-gray-200 p-2">
            <p className="uppercase">RECIPE</p>
            <p className="uppercase">COST</p>
          </div>
          <ul className="menu w-full border-b p-0 [&_li>*]:rounded-md [&_li>*]:border-b">
            {filteredRecipes.map((recipe) => (
              <li
                onClick={() => onRecipeSelect?.(recipe)}
                key={recipe.id}
                className="w-full"
              >
                <a className="flex">
                  <div className="flex w-full flex-row justify-between gap-4">
                    <div className="flex flex-row items-center gap-2">
                      {recipe?.images.length === 0 && (
                        <div className="rounded-md bg-base-300 p-2">
                          <PhotoIcon className="w-5  " />
                        </div>
                      )}
                      {recipe?.images.length > 0 && (
                        <img
                          src={recipe.images[0]}
                          className="bg h-9 w-9 rounded-md"
                        />
                      )}
                      <div className="flex flex-col ">
                        <h1 className={'text-base'}>{recipe.name}</h1>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton h-[48px] rounded-md" />

      <div className="skeleton h-[40px] rounded-md" />

      <div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default RecipeList
