import convert, { Measure, Unit } from 'convert-units'

export const pieceMesurement = {
  label: 'Piece (pc)',
  value: 'pc(s)' as Unit,
}

export function getAllMeasurementUnits(
  measures: Measure[] = ['mass', 'volume'],
) {
  const measurementOptions = []

  const units = measures
    .map((measure) => convert().possibilities(measure))
    .flat()

  for (const unit of units) {
    const unitInfo = convert().describe(unit)
    measurementOptions.push({
      label: `${unitInfo.singular} (${unitInfo.abbr})`,
      value: unitInfo.abbr,
    })
  }

  return measurementOptions.concat([pieceMesurement])
}
export const measurementOptions = getAllMeasurementUnits()
