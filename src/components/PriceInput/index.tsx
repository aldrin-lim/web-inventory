import React, { useState, useEffect } from 'react'

type PriceInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  value?: number
  onChange: (value: number) => void
}

const PriceInput: React.FC<PriceInputProps> = (props) => {
  const { value = 0, onChange, ...rest } = props
  // Initialize the state with the formatted value if it's not zero, else with an empty string
  const [inputValue, setInputValue] = useState<string>(value.toFixed(2))

  useEffect(() => {
    // Update inputValue when value prop changes, format if it's not zero
    // setInputValue(value === 0 ? '' : value.toFixed(2))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, '') // Remove non-numeric characters

    // Allow natural editing without premature formatting
    if (!newValue.includes('.') || newValue.split('.')[1].length <= 2) {
      setInputValue(newValue)
    }

    const numericValue = parseFloat(newValue)
    if (!isNaN(numericValue)) {
      onChange(numericValue)
    } else {
      onChange(0) // Handle the case when the input is cleared
    }
  }

  return (
    <input
      {...rest}
      type="text"
      inputMode="decimal"
      value={inputValue}
      onChange={handleChange}
    />
  )
}

export default PriceInput
