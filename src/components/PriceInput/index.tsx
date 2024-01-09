import React from 'react'
import { CurrencyInputProps } from 'react-currency-input-field'
import CurrencyInput from 'react-currency-input-field'

type PriceInputProps = CurrencyInputProps & {
  onChange: (value: number) => void
  value: number
}

const PriceInput: React.FC<PriceInputProps> = (props) => {
  return (
    <CurrencyInput
      className={`input input-bordered ${props.className} text-right`}
      value={props.value}
      onValueChange={(_, __, values) => {
        if (props.onChange && values?.float) {
          props.onChange?.(values.float)
        }
      }}
    />
  )
}

export default PriceInput
