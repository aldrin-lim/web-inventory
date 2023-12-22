import { useState } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

type TimePickerProps = {
  onChange: (time: string) => void
}

const TimePicker = (props: TimePickerProps) => {
  const [selectedTime, setSelectedTime] = useState(new Date())

  const handleChange = (date: Date) => {
    setSelectedTime(date)
    // Convert the date to a 24-hour format time string and pass it to the onChange prop
    props.onChange(moment(date).format('HH:mm:ss'))
  }

  return (
    <DatePicker
      className="input input-bordered w-full"
      selected={selectedTime}
      onChange={handleChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15} // Interval of time options
      timeCaption="Time"
      dateFormat="h:mm aa" // Display format in 12-hour format with AM/PM
    />
  )
}

export default TimePicker
