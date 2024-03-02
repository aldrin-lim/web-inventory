import { z } from 'zod'
import { ChevronLeftIcon, PhotoIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { MaterialType, RecipeSchema } from 'types/product.types'
import ProductImages from '../../components/ProductImages'
import { isWithinExpiration } from 'util/data'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'

type RecipeDetailsProps = {
  recipe: z.infer<typeof RecipeSchema>
  onBack: () => void
}

const RecipeDetails = (props: RecipeDetailsProps) => {
  const { recipe, onBack } = props

  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const ingredients = recipe.materials.filter(
    (material) => material.type === MaterialType.Ingredient,
  )

  const others = recipe.materials.filter(
    (material) => material.type === MaterialType.Other,
  )

  return (
    <div className={['screen pb-9'].join(' ')}>
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => {
              onBack()
            }}
          />,
          <ToolbarTitle key="title" title="Recipe Details" />,
          <div key={3} />,
        ]}
      />

      <div className="flex flex-col gap-2">
        <div className="mb-4">
          <ProductImages readOnly size="sm" images={recipe.images ?? []} />
        </div>
        <p>{recipe.name}</p>
        {/* <p>Cost: ₱ {recipe.cost}</p>
        <p>Price: ₱ {recipe.price}</p>
        <p>
          Profit: {recipe.profitPercentage}% | ₱{' '}
          <span>{recipe.profitAmount}</span>
        </p> */}

        {/* Igredients */}

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-row justify-between bg-gray-200 p-2">
            <p className="uppercase">Ingredients/Materials</p>
            <p className="uppercase">COST</p>
          </div>
          <ul className="menu w-full border-b p-0 [&_li>*]:rounded-md [&_li>*]:border-b">
            {ingredients.map((material) => {
              const { product } = material
              return (
                <li key={product.id} className="w-full">
                  <a className="flex">
                    <div className="flex w-full flex-row justify-between gap-4">
                      <div className="flex flex-row items-center gap-2">
                        {product?.images.length === 0 && (
                          <div className="rounded-md bg-base-300 p-2">
                            <PhotoIcon className="w-5  " />
                          </div>
                        )}
                        {product?.images.length > 0 && (
                          <img
                            src={product.images[0]}
                            className="bg h-9 w-9 rounded-md"
                          />
                        )}
                        <div className="flex flex-col ">
                          <h1
                            className={[
                              'text-base',
                              isWithinExpiration(
                                product.activeBatch?.expirationDate,
                              )
                                ? 'text-orange-400'
                                : '',
                            ].join(' ')}
                          >
                            <MiddleTruncateText
                              text={`${product.name}`}
                              maxLength={getTruncateSize(currentBreakpoint)}
                            />
                          </h1>
                          <p className="text-xs">
                            {material.quantity} {material.unitOfMeasurement}
                          </p>
                        </div>
                      </div>
                      {product.isBulkCost && (
                        <div className="text-right">
                          <p className="text-base font-medium">
                            ₱ {product.activeBatch?.costPerUnit}{' '}
                          </p>
                          <p className="text-xs">
                            / {product.activeBatch?.unitOfMeasurement}
                          </p>
                        </div>
                      )}

                      {!product.isBulkCost && (
                        <div className="text-right">
                          <p className="text-base font-medium">
                            ₱{' '}
                            {Intl.NumberFormat().format(
                              product.activeBatch?.cost ?? 0,
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Others */}

        <div className="mt-5 flex flex-col gap-2">
          <div className="flex w-full flex-row justify-between bg-gray-200 p-2">
            <p className="uppercase">Others</p>
            <p className="uppercase">COST</p>
          </div>
          <ul className="menu w-full border-b p-0 [&_li>*]:rounded-md [&_li>*]:border-b">
            {others.map((material) => {
              const { product } = material
              return (
                <li key={product.id} className="w-full">
                  <a className="flex">
                    <div className="flex w-full flex-row justify-between gap-4">
                      <div className="flex flex-row items-center gap-2">
                        {product?.images.length === 0 && (
                          <div className="rounded-md bg-base-300 p-2">
                            <PhotoIcon className="w-5  " />
                          </div>
                        )}
                        {product?.images.length > 0 && (
                          <img
                            src={product.images[0]}
                            className="bg h-9 w-9 rounded-md"
                          />
                        )}
                        <div className="flex flex-col ">
                          <h1
                            className={[
                              'text-base',
                              isWithinExpiration(
                                product.activeBatch?.expirationDate,
                              )
                                ? 'text-orange-400'
                                : '',
                            ].join(' ')}
                          >
                            <MiddleTruncateText
                              text={`${product.name}`}
                              maxLength={getTruncateSize(currentBreakpoint)}
                            />
                          </h1>
                          <p className="text-xs">
                            {material.quantity} {material.unitOfMeasurement}
                          </p>
                        </div>
                      </div>
                      {product.isBulkCost && (
                        <div className="text-right">
                          <p className="text-base font-medium">
                            ₱ {product.activeBatch?.costPerUnit}{' '}
                          </p>
                          <p className="text-xs">
                            / {product.activeBatch?.unitOfMeasurement}
                          </p>
                        </div>
                      )}

                      {!product.isBulkCost && (
                        <div className="text-right">
                          <p className="text-base font-medium">
                            ₱{' '}
                            {Intl.NumberFormat().format(
                              product.activeBatch?.cost ?? 0,
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

const getTruncateSize = (size: ScreenSize) => {
  switch (size) {
    case 'xs':
      return 10
    case 'sm':
      return 20
    case 'md':
      return 200
    case 'lg':
      return 200
    default:
      return 500
  }
}

export default RecipeDetails
