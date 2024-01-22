import AutocompleteSelect, {
  AutoCompleteProps,
  OptionsValue,
} from 'components/AutocompleteSelect'

import './styles.css'
import { getAllMeasurementUnits } from 'util/measurement'
import { Measure } from 'convert-units'

type MeasurementSelectProps = {
  onChange?: AutoCompleteProps['onChange']
  value: OptionsValue
  measurements?: Measure[]
  disabled?: boolean
}

const MeasurementSelect = (props: MeasurementSelectProps) => {
  const { value, onChange, measurements, disabled } = props
  const options = getAllMeasurementUnits(measurements)
  return (
    <AutocompleteSelect
      disabled={disabled}
      value={value}
      onChange={onChange}
      options={options}
      className="measurement-selection text-base"
    />
  )
}

export default MeasurementSelect
