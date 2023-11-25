import React, { useEffect, useState } from 'react'

type PriceInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  value?: number
  onChange: (value: number) => void
}

const PriceInput: React.FC<PriceInputProps> = (props) => {
  const { value = 0, onChange } = props
  const [inputValue, setInputValue] = useState<string>(value.toString())

  useEffect(() => {
    // Update inputValue when value prop changes
    setInputValue(value === 0 ? '' : value.toString())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, '') // Remove non-numeric characters
    setInputValue(newValue)

    const numericValue = parseFloat(newValue)
    if (!isNaN(numericValue)) {
      onChange(numericValue)
    } else {
      onChange(0) // Handle the case when the input is cleared
    }
  }

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      value={inputValue}
      onChange={handleChange}
    />
  )
}

export default PriceInput
