import { useCallback, useEffect, useState } from 'react'
import { ProductVariantAttribute } from 'types/product.types'
import VariantAttributeItem from '../VariantAttributeItem'

type VariantAttributeManagerProps = {
  onChange?: (variantAttribute: Array<ProductVariantAttribute>) => void
}

const VariantAttributeManager = (props: VariantAttributeManagerProps) => {
  const { onChange } = props
  const [variantAttributes, setVariantAttributes] = useState<
    Array<ProductVariantAttribute>
  >([
    {
      option: '',
      values: [],
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

  const removeVariantAttribute = (variantOption: string) => {
    const index = variantAttributes.findIndex(
      (variantAttribute) => variantAttribute.option === variantOption,
    )
    setVariantAttributes((prev) => prev.filter((_, i) => i !== index))
  }

  const onVariantAttributeOptionChange = useCallback(
    (index: number, newValue?: ProductVariantAttribute['option']) => {
      if (newValue) {
        setVariantAttributes((prevValues) =>
          prevValues.map((value, i) => {
            if (index !== i) {
              return value
            }
            return {
              ...value,
              option: newValue,
            }
          }),
        )
      }
    },
    [setVariantAttributes],
  )

  const onVariantAttributeOptionValuesChange = useCallback(
    (index: number, newValue: ProductVariantAttribute['values']) => {
      setVariantAttributes((prevValues) =>
        prevValues.map((value, i) => {
          if (index !== i) {
            return value
          }
          return {
            ...value,
            values: newValue,
          }
        }),
      )
    },
    [setVariantAttributes],
  )

  useEffect(() => {
    if (onChange) {
      onChange(variantAttributes)
    }
  }, [variantAttributes, onChange])

  return (
    <div className="flex flex-col gap-4">
      {variantAttributes.map((variantAttribute, index) => (
        <>
          <VariantAttributeItem
            key={index}
            onRemove={() => removeVariantAttribute(variantAttribute.option)}
            option={variantAttribute.option}
            optionValues={variantAttribute.values}
            onOptionChange={(option) =>
              onVariantAttributeOptionChange(index, option)
            }
            onOptionValuesChange={(optionValues) =>
              onVariantAttributeOptionValuesChange(index, optionValues)
            }
          />
        </>
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
