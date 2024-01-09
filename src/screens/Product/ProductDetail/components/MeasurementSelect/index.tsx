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
}

const MeasurementSelect = (props: MeasurementSelectProps) => {
  const { value, onChange, measurements } = props
  const options = getAllMeasurementUnits(measurements)
  return (
    <AutocompleteSelect
      value={value}
      onChange={onChange}
      options={options}
      className="measurement-selection"
    />
  )
}

export default MeasurementSelect
