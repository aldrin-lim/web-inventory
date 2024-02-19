import AutocompleteSelect, {
  AutoCompleteProps,
  OptionsValue,
} from 'components/AutocompleteSelect'

import './styles.css'
import { getAllMeasurementUnits } from 'util/measurement'
import { Measure } from 'convert-units'
import { useMemo } from 'react'

type MeasurementSelectProps = {
  onChange?: AutoCompleteProps['onChange']
  value: OptionsValue
  measurements?: Measure[]
  disabled?: boolean
}

const MeasurementSelect = (props: MeasurementSelectProps) => {
  const { value, onChange, measurements, disabled } = props
  // let options = getAllMeasurementUnits(measurements)

  // Format of options base from convert-units
  // {
  //   label: `${unitInfo.singular} (${unitInfo.abbr})`,
  //   value: unitInfo.abbr,
  // }
  const options = useMemo(() => {
    let options = getAllMeasurementUnits(measurements)
    // if measurement is mass, Rearrange options for mass, put the most common ones first, put the least common ones last
    if (measurements?.includes('mass') && measurements.length === 1) {
      options = options.sort((a, b) => {
        if (a.value === 'g') return -1
        if (b.value === 'g') return 1
        if (a.value === 'kg') return -1
        if (b.value === 'kg') return 1
        if (a.value === 'mg') return -1
        if (b.value === 'mg') return 1
        if (a.value === 'lb') return -1
        if (b.value === 'lb') return 1
        if (a.value === 'oz') return -1
        if (b.value === 'oz') return 1
        return 0
      })
    }

    // if measurement is volume, Rearrange options for volume, put the most common ones first
    if (measurements?.includes('volume') && measurements.length === 1) {
      options = options.sort((a, b) => {
        if (a.value === 'ml') return -1
        if (b.value === 'ml') return 1
        if (a.value === 'l') return -1
        if (b.value === 'l') return 1
        if (a.value === 'tsp') return -1
        if (b.value === 'tsp') return 1
        if (b.value === 'gal') return 1
        return 0
      })
    }

    // if both mass and volume is volume, Rearrange options for volume, put the most common ones first
    if (measurements?.includes('mass') && measurements?.includes('volume')) {
      options = options.sort((a, b) => {
        if (a.value === 'g') return -1
        if (b.value === 'g') return 1
        if (a.value === 'kg') return -1
        if (b.value === 'kg') return 1
        if (a.value === 'mg') return -1
        if (b.value === 'mg') return 1
        if (a.value === 'lb') return -1
        if (b.value === 'lb') return 1
        if (a.value === 'oz') return -1
        if (b.value === 'oz') return 1
        if (a.value === 'ml') return -1
        if (b.value === 'ml') return 1
        if (a.value === 'l') return -1
        if (b.value === 'l') return 1
        if (a.value === 'tsp') return -1
        if (b.value === 'tsp') return 1
        if (b.value === 'gal') return 1
        return 0
      })
    }

    return options
  }, [measurements])

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
