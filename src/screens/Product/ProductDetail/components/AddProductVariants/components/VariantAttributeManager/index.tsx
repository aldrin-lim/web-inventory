import { useCallback, useEffect, useState } from 'react'
import { ProductVariantAttribute } from 'types/product.types'
import VariantAttributeItem from '../VariantAttributeItem'

type VariantAttributeManagerProps = {
  onChange?: (variantAttribute: Array<ProductVariantAttribute>) => void
  values: Array<ProductVariantAttribute>
}

const VariantAttributeManager = (props: VariantAttributeManagerProps) => {
  const { onChange, values = [] } = props
  const [variantAttributes, setVariantAttributes] =
    useState<Array<ProductVariantAttribute>>(values)

  const addVariantAttribute = () => {
    setVariantAttributes((prev) => {
      const newValues = prev.concat({
        option: '',
        values: [],
      })
      if (onChange) {
        onChange(newValues)
      }
      return newValues
    })
  }

  const removeVariantAttribute = (index: number) => {
    setVariantAttributes((prev) => {
      const newValues = prev.filter((_, i) => i !== index)
      if (onChange) {
        onChange(newValues)
      }
      return newValues
    })
  }

  const onVariantAttributeOptionChange = useCallback(
    (index: number, newValue: ProductVariantAttribute['option']) => {
      setVariantAttributes((prevValues) => {
        const newValues = prevValues.map((value, i) => {
          if (index !== i) {
            return value
          }
          return {
            ...value,
            option: newValue,
          }
        })
        if (onChange) {
          onChange(newValues)
        }
        return newValues
      })
    },
    [setVariantAttributes, onChange],
  )

  const onVariantAttributeOptionValuesChange = useCallback(
    (index: number, newValue: ProductVariantAttribute['values']) => {
      setVariantAttributes((prevValues) => {
        const newValues = prevValues.map((value, i) => {
          if (index !== i) {
            return value
          }
          return {
            ...value,
            values: newValue,
          }
        })
        if (onChange) {
          onChange(newValues)
        }
        return newValues
      })
    },
    [setVariantAttributes, onChange],
  )

  useEffect(() => {
    setVariantAttributes(values)
  }, [values])

  useEffect(() => {
    if (variantAttributes.length === 0) {
      setVariantAttributes([
        {
          option: '',
          values: [],
        },
      ])
    }
  }, [variantAttributes])

  return (
    <div className="flex flex-col gap-4">
      {variantAttributes.map((variantAttribute, index) => (
        <VariantAttributeItem
          key={index}
          onRemove={() => removeVariantAttribute(index)}
          option={variantAttribute.option}
          optionValues={variantAttribute.values}
          onOptionChange={(option) =>
            onVariantAttributeOptionChange(index, option)
          }
          onOptionValuesChange={(optionValues) =>
            onVariantAttributeOptionValuesChange(index, optionValues)
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
