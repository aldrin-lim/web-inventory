import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import OptionValueItem from './components/OptionValueItem'
import { ProductVariantAttribute } from 'types/product.types'

type VariantAttributeItemProps = {
  onChange: (variantAttribute?: ProductVariantAttribute) => void
}

const VariantAttributeItem = (props: VariantAttributeItemProps) => {
  const { onChange } = props
  const [option, setOption] = useState('')
  const [optionValues, setOptionValues] = useState<Array<string>>([])
  const [newOptionValue, setNewOptionValue] = useState('')
  const [optionValueError, setOptionValueError] = useState('')

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
      return prev.concat(newOptionValue)
    })
  }

  const removeOptionValue = (index: number) => {
    setOptionValueError('')
    setOptionValues((prev) => prev.filter((_, i) => i !== index))
  }

  const updateOptionValue = (index: number, newValue: string) => {
    // Check for duplicate values before updating
    if (optionValues.includes(newValue)) {
      // Handle the duplicate case (e.g., show an error message)
      return
    }

    setOptionValues((prevValues) =>
      prevValues.map((value, i) => {
        return i === index ? newValue : value
      }),
    )
  }

  useEffect(() => {
    if (option && optionValues.length > 0) {
      onChange({
        option,
        values: optionValues,
      })
    } else {
      onChange(undefined)
    }
  }, [onChange, option, optionValues])

  return (
    <div className="flex flex-col gap-4 rounded-sm bg-gray-200 p-4 pr-2 ">
      <div className="form-control ">
        <div className="flex w-full flex-row items-center justify-center gap-1">
          <input
            className="input w-full !text-base"
            placeholder="Option (Ex. Size, Color, etc.)"
            value={option}
            onChange={(e) => setOption(e.target.value)}
          />
          <button className="btn btn-ghost btn-sm">
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
  )
}

export default VariantAttributeItem
