import AutocompleteSelect, {
  AutoCompleteProps,
  OptionsValue,
} from 'components/AutocompleteSelect'

import './styles.css'
import { measurementOptions } from 'util/measurement'

type MeasurementSelectProps = {
  onChange?: AutoCompleteProps['onChange']
  value: OptionsValue
}

const MeasurementSelect = (props: MeasurementSelectProps) => {
  return (
    <AutocompleteSelect
      value={props.value}
      onChange={props.onChange}
      options={measurementOptions}
      className="measurement-selection"
    />
  )
}

export default MeasurementSelect
