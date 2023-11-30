import { useCallback, useState } from 'react'
import { ProductVariantAttribute } from 'types/product.types'
import VariantAttributeItem from '../VariantAttributeItem'

const VariantAttributeManager = () => {
  const [variantAttributes, setVariantAttributes] = useState<
    Array<ProductVariantAttribute>
  >([
    {
      option: '',
      values: [],
    },
    {
      option: 'sizes',
      values: ['medium', 'large'],
    },
  ])

  const addVariantAttribute = () => {
    setVariantAttributes((prev) =>
      prev.concat({
        option: '',
        values: [],
      }),
    )
  }

  const removeVariantAttribute = (index: number) => {
    setVariantAttributes((prev) => prev.filter((_, i) => i !== index))
  }

  const onVariantAttributeItemChange = useCallback(
    (index: number, newValue?: ProductVariantAttribute) => {
      if (newValue) {
        setVariantAttributes((prevValues) =>
          prevValues.map((value, i) => {
            return i === index ? newValue : value
          }),
        )
      }
    },
    [setVariantAttributes],
  )

  return (
    <div className="flex flex-col gap-4">
      {variantAttributes.map((variantAttribute, index) => (
        <VariantAttributeItem
          key={index}
          onRemove={() => removeVariantAttribute(index)}
          initialOption={variantAttribute.option}
          initialOptionValues={variantAttribute.values}
          onChange={(variantAttribute) =>
            onVariantAttributeItemChange(index, variantAttribute)
          }
        />
      ))}
      <button
        onClick={addVariantAttribute}
        className="btn btn-ghost btn-outline btn-primary  text-center"
      >
        Add Variant
      </button>
    </div>
  )
}

export default VariantAttributeManager
