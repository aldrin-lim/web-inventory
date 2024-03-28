import { ChevronLeftIcon, PhotoIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllRecipes from 'hooks/useAllRecipes'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GetStarted from 'screens/Recipe/RecipeOverview/GetStarted'
import useProductFormValue from '../../hooks/useProductFormValue'
import { GetAllRecipeResponseSchema } from 'api/recipe/getAllRecipes'
import { padWithZeros } from 'util/number'
import { v4 } from 'uuid'
import { PIECES } from 'constants copy/measurement'
import { formatToPeso } from 'util/currency'

type Recipe = GetAllRecipeResponseSchema[number]

const RecipeList = () => {
  const navigate = useNavigate()
  const { recipes, isLoading } = useAllRecipes()

  const [nameFilter, setNameFilter] = useState('')

  const setFormFieldValue = useProductFormValue(
    (state) => state.setFormFieldValue,
  )
  const reset = useProductFormValue((state) => state.reset)

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(nameFilter.toLowerCase()),
    )
  }, [nameFilter, recipes])

  const selectRecipe = (recipe: Recipe) => {
    reset()
    setFormFieldValue('recipe', recipe)
    setFormFieldValue('name', recipe.name)
    setFormFieldValue('batches', [
      {
        id: v4(),
        name: `Batch #${padWithZeros(1)}`,
        cost: recipe.cost,
        costPerUnit: 0,
        quantity: 1,
        unitOfMeasurement: PIECES,
        isDeducted: false,
        expirationDate: null,
      },
    ])
    navigate('../')
  }

  return (
    <div className="screen gap-0 pb-[100px]">
      <Toolbar
        start={
          <ToolbarButton
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => {
              navigate('../')
            }}
          />
        }
        middle={<ToolbarTitle title="Select Recipe" />}
      />

      {isLoading ? <Skeleton /> : null}
      {!isLoading && recipes.length === 0 && <GetStarted />}
      {!isLoading && recipes.length > 0 && (
        <div className="relative flex flex-col gap-0">
          <div className="shadow-xs sticky top-[49px] z-[10] space-y-4 border-b border-b-slate-100 bg-base-100 py-4 ">
            <input
              className="input input-bordered w-full "
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search Recipe by Name"
            />
          </div>

          <div className="flex w-full flex-row justify-between bg-gray-200 p-2">
            <p className="uppercase">RECIPE</p>
            <p className="uppercase">COST</p>
          </div>
          <ul className="menu w-full border-b p-0 [&_li>*]:rounded-md [&_li>*]:border-b">
            {filteredRecipes.map((recipe) => (
              <li
                onClick={() => selectRecipe(recipe)}
                key={recipe.id}
                className="w-full"
              >
                <a className="flex">
                  <div className="flex w-full flex-row justify-between gap-4">
                    <div className="flex w-full flex-row items-center gap-2">
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
                      <div className="flex w-full flex-grow flex-row justify-between">
                        <h1 className={'text-base'}>{recipe.name}</h1>
                        <h2 className="flex-grow text-right text-base">
                          {formatToPeso(recipe.cost)}
                        </h2>
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
