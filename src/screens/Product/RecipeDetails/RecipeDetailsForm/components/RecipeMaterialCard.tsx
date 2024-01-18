import { TrashIcon } from '@heroicons/react/24/solid'
import ImageLoader from 'components/ImageLoader'
import convert, { Unit } from 'convert-units'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { getActiveBatch } from 'screens/Product/ProductDetail'
import MeasurementSelect from 'screens/Product/ProductDetail/components/MeasurementSelect'
import { ProductSoldBy } from 'types/product.types'
import { Material } from 'types/recipe.types'
import { measurementOptions, pieceMesurement } from 'util/measurement'
import { toNumber } from 'util/number'

type RecipeMaterialCardProps = {
  material: Material
  onRemove?: () => void
  onChange?: (material: Material) => void
  // error?: FormikErrors<Material>
}

const RecipeMaterialCard = (props: RecipeMaterialCardProps) => {
  const { material, onChange } = props
  const image = material.product.images && material.product.images[0]

  const [totalCost, setTotalCost] = useState(0)

  const name = material.product.name

  const { values, setFieldValue } = useFormik({
    initialValues: material,
    onSubmit: () => {
      //
    },
    enableReinitialize: true,
  })

  const increaseQuantity = () => {
    setFieldValue('quantity', values.quantity + 1)
  }

  const decreaseQuantity = () => {
    if (values.quantity > 0) {
      setFieldValue('quantity', values.quantity - 1)
    }
  }

  useEffect(() => {
    setTotalCost(values.quantity * values.cost)
  }, [values.quantity])

  useEffect(() => {
    if (onChange) {
      onChange(values)
    }
  }, [values.cost, values.quantity])

  useEffect(() => {
    // using convertible-units, change the cost per unit base from the values.unitOfMeasurement
    // by converting it
    // then set the cost per unit
    const activeBatch = getActiveBatch(values.product.batches)
    const cost = values.product.isBulkCost
      ? toNumber(activeBatch.costPerUnit)
      : toNumber(activeBatch.cost)

    const fromUnit = activeBatch.unitOfMeasurement
    const toUnit = values.unitOfMeasurement

    // Calculate the conversion factor from the product's unit to the material's unit
    let conversionFactor = 1

    if (values.product.soldBy === ProductSoldBy.Weight) {
      conversionFactor = convert(1)
        .from(fromUnit as Unit)
        .to(toUnit as Unit)
    }

    const newCostPerUnit = cost * conversionFactor

    setTotalCost(values.quantity * newCostPerUnit)
    setFieldValue('cost', newCostPerUnit)
  }, [values.unitOfMeasurement])

  return (
    <div className="container-card relative flex flex-row flex-wrap justify-evenly gap-2">
      {/* <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre> */}
      <div className="card card-compact w-[155px] border border-gray-300 bg-base-100">
        <button
          className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2 bg-primary"
          onClick={props.onRemove}
        >
          <TrashIcon className="w-5 text-white" />
        </button>
        <div className="absolute left-0 top-2 max-w-[60%]">
          <div className="w-full truncate bg-primary p-1 text-sm text-primary-content">
            ₱ {totalCost}
          </div>
        </div>
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
            {values.product.soldBy === ProductSoldBy.Weight && (
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
            )}
            {values.product.soldBy === ProductSoldBy.Pieces && (
              <MeasurementSelect value={pieceMesurement} disabled />
            )}

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
