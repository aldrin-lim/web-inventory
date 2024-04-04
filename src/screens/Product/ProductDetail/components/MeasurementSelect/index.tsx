import AutocompleteSelect, {
  AutoCompleteProps,
  OptionsValue,
} from 'components/AutocompleteSelect'

import './styles.css'
import { getAllMeasurementUnits, measurementOptions } from 'util/measurement'
import { Measure } from 'convert-units'
import { useMemo } from 'react'
import { PIECES } from 'constants copy/measurement'

type MeasurementSelectProps = {
  onChange?: AutoCompleteProps['onChange']
  value: OptionsValue
  measurements?: Measure[]
  disabled?: boolean
  className?: string
}

export const getMeasurementOptionsValue = (measurement: string) => {
  if (
    ['piece', 'pc', 'pcs', 'piece(s)', 'pieces', 'pc(s)'].includes(measurement)
  ) {
    return {
      label: 'pc(s)',
      value: PIECES,
    }
  }

  return {
    label:
      measurementOptions.find((option) => option.value === measurement)
        ?.label || '',
    value: measurement ?? '',
  }
}

const MeasurementSelect = (props: MeasurementSelectProps) => {
  const { value, onChange, measurements, disabled, className } = props
  // let options = getAllMeasurementUnits(measurements)

  // Format of options base from convert-units
  // {
  //   label: `${unitInfo.singular} (${unitInfo.abbr})`,
  //   value: unitInfo.abbr,
  // }

  const options = useMemo(() => {
    let options = getAllMeasurementUnits(measurements)

    options = options.sort((a, b) => {
      if (a.value === 'g') return -1
      if (b.value === 'g') return 1
      if (a.value === 'kg') return -1
      if (b.value === 'kg') return 1
      if (a.value === 'ml') return -1
      if (b.value === 'ml') return 1
      if (a.value === 'l') return -1
      if (b.value === 'l') return 1
      if (a.value === 'mg') return -1
      if (b.value === 'mg') return 1
      if (a.value === 'lb') return -1
      if (b.value === 'lb') return 1
      if (a.value === 'oz') return -1
      if (b.value === 'oz') return 1
      if (a.value === 'tsp') return -1
      if (b.value === 'tsp') return 1
      if (b.value === 'gal') return 1
      return 0
    })
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

    // If measurment includes pieces
    if (measurements?.includes('pieces')) {
      return options.concat({
        label: 'Piece (pcs)',
        value: PIECES,
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
      className={`measurement-selection text-base ${className}`}
    />
  )
}

export default MeasurementSelect
