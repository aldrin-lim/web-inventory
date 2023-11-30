import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import OptionValueItem from './components/OptionValueItem'
import { ProductVariantAttribute } from 'types/product.types'

type VariantAttributeItemProps = {
  onRemove: () => void
  option: ProductVariantAttribute['option']
  optionValues: ProductVariantAttribute['values']
  onOptionChange: (option?: ProductVariantAttribute['option']) => void
  onOptionValuesChange: (
    optionValues: ProductVariantAttribute['values'],
  ) => void
}

const VariantAttributeItem = (props: VariantAttributeItemProps) => {
  const { onOptionChange, onRemove } = props
  const [option, setOption] = useState<ProductVariantAttribute['option']>()
  const [optionValues, setOptionValues] = useState<
    ProductVariantAttribute['values']
  >([])
  const [newOptionValue, setNewOptionValue] = useState('')
  const [optionValueError, setOptionValueError] = useState('')

  const newOptionValueRef = useRef<HTMLInputElement>(null)

  const addOptionValue = () => {
    if (newOptionValue === '') {
      return
    }

    setOptionValues((prev) => {
      if (prev.includes(newOptionValue)) {
        setOptionValueError(`Duplicate value`)
        return prev
      }
      setNewOptionValue('')
      const newValue = prev.concat(newOptionValue)
      props.onOptionValuesChange(newValue)
      return newValue
    })
    newOptionValueRef.current?.focus()
  }

  const removeOptionValue = (index: number) => {
    setOptionValueError('')
    setOptionValues((prev) => {
      const newValue = prev.filter((_, i) => i !== index)
      props.onOptionValuesChange(newValue)
      return newValue
    })
  }

  const updateOptionValue = (index: number, newValue: string) => {
    // Check for duplicate values before updating
    if (optionValues.includes(newValue)) {
      // Handle the duplicate case (e.g., show an error message)
      return
    }

    setOptionValues((prevValues) => {
      const updatedValues = prevValues.map((value, i) => {
        return i === index ? newValue : value
      })
      props.onOptionValuesChange(updatedValues)
      return updatedValues
    })
  }

  useEffect(() => {
    setOption(props.option)
    setOptionValues(props.optionValues)
  }, [props.option, props.optionValues])

  return (
    <div className="flex flex-col gap-4 rounded-sm bg-gray-200 p-4 pr-2 ">
      <div className="form-control ">
        <div className="flex w-full flex-row items-center justify-center gap-1">
          <input
            className="input w-full !text-base"
            placeholder="Option (Ex. Size, Color, etc.)"
            value={option}
            onChange={(e) => {
              setOption(e.target.value)
              onOptionChange(e.target.value)
            }}
          />
          <button onClick={onRemove} className="btn btn-ghost btn-sm">
            <TrashIcon className="w-6 text-red-400" />
          </button>
        </div>
      </div>
      <div className="form-control ">
        <div className="flex w-full flex-row items-center justify-center gap-1">
          <input
            className="input w-full !text-base"
            placeholder="Option Value (Ex. sm, red, etc.)"
            value={newOptionValue}
            ref={newOptionValueRef}
            onChange={(e) => {
              setNewOptionValue(e.target.value)
            }}
          />
          <button onClick={addOptionValue} className="btn btn-ghost btn-sm">
            <PlusIcon className="w-6" />
          </button>
        </div>
        <p className="mt-1 text-xs text-red-400">{optionValueError}</p>
      </div>
      <div className="flex flex-col-reverse gap-4">
        {optionValues.map((value, index) => (
          <OptionValueItem
            key={value}
            value={value}
            allValues={optionValues}
            onUpdate={(newValue) => updateOptionValue(index, newValue)}
            onRemove={() => removeOptionValue(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default VariantAttributeItem
