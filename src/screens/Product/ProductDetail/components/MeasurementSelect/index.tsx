import AutocompleteSelect, {
  AutoCompleteProps,
  OptionsValue,
} from 'components/AutocompleteSelect'
import { measurementUnits } from 'util/measurement'

import './styles.css'

const measurementOptions = measurementUnits.map((item) => ({
  label: item.description,
  value: item.abbreviation,
}))

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
