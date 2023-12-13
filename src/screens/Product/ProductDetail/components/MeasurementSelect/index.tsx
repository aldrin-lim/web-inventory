import AutocompleteSelect, {
  AutoCompleteProps,
  OptionsValue,
} from 'components/AutocompleteSelect'

import './styles.css'
import { measurementOptions } from 'util/measurement'

type MeasurementSelectProps = {
  onChange?: AutoCompleteProps['onChange']
  value: OptionsValue
  options?: AutoCompleteProps['options']
}

const MeasurementSelect = (props: MeasurementSelectProps) => {
  const { value, onChange, options = measurementOptions } = props
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
