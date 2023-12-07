import { useCallback, useEffect, useState } from 'react'
import { ProductVariantAttribute } from 'types/product.types'
import VariantAttributeItem from '../VariantAttributeItem'
import { PlusIcon } from '@heroicons/react/24/solid'

type VariantAttributeManagerProps = {
  onChange?: (variantAttribute: Array<ProductVariantAttribute>) => void
  values: Array<ProductVariantAttribute>
  onEdit: () => void
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

  const sanitizedVariantAttributes = variantAttributes.filter(
    (variantAttribute) => {
      const hasOption = variantAttribute.option.length > 0
      const hasOptionValues = variantAttribute.values.length > 0
      return hasOption && hasOptionValues
    },
  )

  return (
    <>
      <div className="flex flex-row items-center justify-between ">
        <h1 className="font-bold">Options</h1>
        <button
          onClick={addVariantAttribute}
          className="btn btn-ghost btn-sm text-blue-400"
        >
          <PlusIcon className="w-5 " />
          Add
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {variantAttributes.map((variantAttribute, index) => (
          <VariantAttributeItem
            key={index}
            onRemove={() => removeVariantAttribute(index)}
            option={variantAttribute.option}
            optionValues={variantAttribute.values}
            onOptionChange={(option) =>
              onVariantAttributeOptionChange(index, option || '')
            }
            onOptionValuesChange={(optionValues) =>
              onVariantAttributeOptionValuesChange(index, optionValues)
            }
          />
        ))}
        {sanitizedVariantAttributes.length > 0 && (
          <button
            onClick={props.onEdit}
            className="btn btn-ghost btn-outline btn-primary  text-center"
          >
            Set Variant Info (e.g, Price, Qty, etc.)
          </button>
        )}
      </div>
    </>
  )
}

export default VariantAttributeManager
