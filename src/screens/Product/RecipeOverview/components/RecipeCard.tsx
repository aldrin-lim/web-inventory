import { TrashIcon } from '@heroicons/react/24/solid'
import ImageLoader from 'components/ImageLoader'
import { FormikErrors } from 'formik'
import MeasurementSelect from 'screens/Product/ProductDetail/components/MeasurementSelect'
import {
  RecipeDetailActionType,
  useRecipeDetail,
} from 'screens/Product/contexts/RecipeDetailContext'
import { Material } from 'types/recipe.types'
import { measurementOptions } from 'util/measurement'

type RecipeMaterialCardProps = {
  material: Material
  error?: FormikErrors<Material>
}

const RecipeCard = (props: RecipeMaterialCardProps) => {
  const { material } = props
  const {
    product: { id, name },
    quantity,
  } = material
  const { dispatch } = useRecipeDetail()
  const image = material.product.images && material.product.images[0]

  const updateMaterial = (field: keyof Material, value: unknown) => {
    dispatch({
      type: RecipeDetailActionType.UpdateMaterial,
      payload: {
        field,
        value,
        productId: id,
      },
    })
  }

  const increaseQuantity = () => {
    updateMaterial('quantity', quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 0) {
      updateMaterial('quantity', quantity - 1)
    }
  }

  const removeMaterial = () => {
    dispatch({
      type: RecipeDetailActionType.RemoveMaterial,
      payload: {
        productId: id,
      },
    })
  }

  return (
    <div className="container-card relative flex flex-row flex-wrap justify-evenly gap-2">
      <div className="card card-compact w-[155px] cursor-pointer border border-gray-300 bg-base-100">
        <figure className="h-[155px] w-[155px] bg-gray-300">
          <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
        </figure>
        <div className="card-body flex flex-col  !px-1 !py-2 text-left">
          <h2 className="card-title text-sm">{name}</h2>

          <div className="flex flex-row gap-1 text-xs">
            <div className="join flex border border-gray-300">
              <button className="join-itm btn" onClick={decreaseQuantity}>
                -
              </button>
              <input
                value={quantity}
                type="number"
                inputMode="numeric"
                className="input join-item w-full p-0 text-center text-black"
                onChange={(e) => {
                  updateMaterial('quantity', +e.target.value)
                }}
              />
              <button className="btn  join-item" onClick={increaseQuantity}>
                +
              </button>
            </div>
          </div>

          <div>
            <MeasurementSelect
              onChange={(option) => {
                updateMaterial('measurement', option?.value)
              }}
              value={{
                label:
                  measurementOptions.find(
                    (option) => option.value === material.measurement,
                  )?.label || '',
                value: material.measurement,
              }}
            />
            <p className="form-control-error">
              {props.error && props.error?.measurement}&nbsp;
            </p>
          </div>
        </div>
      </div>
      <button
        className="btn btn-circle btn-ghost btn-xs absolute right-2 top-2 bg-purple-300"
        onClick={removeMaterial}
      >
        <TrashIcon className="w-4 text-white" />
      </button>
    </div>
  )
}

export default RecipeCard
