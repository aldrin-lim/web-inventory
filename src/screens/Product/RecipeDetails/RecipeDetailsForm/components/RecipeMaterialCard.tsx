import { TrashIcon } from '@heroicons/react/24/solid'
import ImageLoader from 'components/ImageLoader'
import { FormikErrors, useFormik } from 'formik'
import MeasurementSelect from 'screens/Product/ProductDetail/components/MeasurementSelect'
import { Material, MaterialSchema } from 'types/recipe.types'
import { measurementOptions } from 'util/measurement'

type RecipeMaterialCardProps = {
  material: Material
  onRemove?: () => void

  // error?: FormikErrors<Material>
}

const RecipeMaterialCard = (props: RecipeMaterialCardProps) => {
  const { material } = props
  const image = material.product.images && material.product.images[0]

  const name = material.product.name

  const { values, setFieldValue } = useFormik({
    initialValues: material,
    onSubmit: () => {
      //
    },
  })

  const increaseQuantity = () => {
    setFieldValue('quantity', values.quantity + 1)
  }

  const decreaseQuantity = () => {
    if (values.quantity > 0) {
      setFieldValue('quantity', values.quantity - 1)
    }
  }

  return (
    <div className="container-card relative flex flex-row flex-wrap justify-evenly gap-2">
      <div className="card card-compact w-[155px] border border-gray-300 bg-base-100">
        <button
          className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2 bg-purple-300"
          onClick={props.onRemove}
        >
          <TrashIcon className="w-5 text-white" />
        </button>
        <figure className="h-[155px] w-[153px] overflow-hidden rounded-t-2xl bg-gray-300">
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
                value={values.quantity}
                type="number"
                inputMode="numeric"
                className="input join-item w-full p-0 text-center text-black"
                onChange={(e) => {
                  setFieldValue('quantity', +e.target.value)
                }}
              />
              <button className="btn  join-item" onClick={increaseQuantity}>
                +
              </button>
            </div>
          </div>

          <div>
            <MeasurementSelect
              value={{
                label:
                  measurementOptions.find(
                    (option) => option.value === values.unitOfMeasurement,
                  )?.label || '',
                value: values.unitOfMeasurement,
              }}
              onChange={(value) => {
                setFieldValue('unitOfMeasurement', value?.value)
              }}
            />
            {/* <p className="form-control-error">
              {props.error && props.error?.unitOfMeasurement}&nbsp;
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeMaterialCard
