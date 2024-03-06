import CurrencyInput from 'react-currency-input-field'

type QuantityInputProps = {
  value?: number
  onChange?: (string?: string) => void
  className: string
  disabled?: boolean
}

const QuantityInput = (props: QuantityInputProps) => {
  const { value = 0, onChange } = props
  return (
    <div className="join flex max-w-sm border  border-gray-300">
      <button
        disabled={props.disabled}
        className="join-itm  btn"
        onClick={() => {
          if (value > 0) {
            onChange && onChange(`${+value - 1}`)
          }
        }}
      >
        -
      </button>
      <CurrencyInput
        decimalsLimit={4}
        value={value}
        onValueChange={(value) => {
          if (onChange) {
            onChange(value)
          }
        }}
        disabled={props.disabled}
        disableGroupSeparators={true}
        inputMode="decimal"
        className={`join-item text-center text-base ${props.className}`}
      />
      <button
        disabled={props.disabled}
        className="btn join-item"
        onClick={() => {
          onChange && onChange(`${+value + 1}`)
        }}
      >
        +
      </button>
    </div>
  )
}

export default QuantityInput
