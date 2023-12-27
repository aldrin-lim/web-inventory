import { ArrowSmallLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import Skeleton from './components/Skeleton'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useFormik } from 'formik'
import { Staff, StaffSchema } from 'types/staff.types'
import { useState } from 'react'

type AddStaffProps = {
  onClose: () => void
}

const AddStaffSchema = StaffSchema.omit({
  id: true,
})

const AddStaff = (props: AddStaffProps) => {
  const isLoading = false
  const { onClose } = props

  const [staff, setStaff] = useState<Staff>({
    id: '',
    firstName: '',
    lastName: '',
    position: '',
    shiftEnd: '',
    shiftStart: '',
    username: '',
    image: '',
  })

  const { getFieldMeta, getFieldProps, submitForm, errors } = useFormik({
    initialValues: business,
    onSubmit: async (values) => {},
    validationSchema: toFormikValidationSchema(AddStaffSchema),
    enableReinitialize: true,
    validateOnBlur: false,
    validate: (values) => {
      const errors = {} as Business
      const openingTime = new Date(`1970-01-01T${values.openingTime}`)
      const closingTime = new Date(`1970-01-01T${values.closingTime}`)

      if (closingTime <= openingTime) {
        errors.closingTime = 'Closing time must be after opening time.'
        errors.openingTime = 'Opening time must be before closing time.'
      }

      return errors
    },
  })

  return (
    <div className="section flex w-full flex-col gap-2 pt-0">
      <Toolbar
        items={[
          <label
            key="12"
            className="btn btn-square btn-ghost drawer-button -ml-4"
            onClick={onClose}
          >
            <ArrowSmallLeftIcon className="w-6 text-blue-400" />
          </label>,
          <ToolbarTitle key={2} title="Add Staff" />,
        ]}
      />
      <h1>
        <strong>Store Detail</strong>
      </h1>
      {isLoading && <Skeleton />}
      {!isLoading && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-xs">Store name</span>
            </label>
            <input
              {...getFieldProps('name')}
              disabled={isMutating}
              type="text"
              className="input input-bordered w-full"
            />
            <p className="form-control-error">
              {getFieldMeta('name').error}&nbsp;
            </p>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-xs">Address</span>
            </label>
            <input
              {...getFieldProps('address')}
              disabled={isMutating}
              type="text"
              className="input input-bordered w-full"
            />
            <p className="form-control-error">
              {getFieldMeta('address').error}&nbsp;
            </p>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-xs">Contact</span>
            </label>
            <input
              {...getFieldProps('contactNumber')}
              disabled={isMutating}
              type="text"
              className="input input-bordered w-full"
            />
            <p className="form-control-error">
              {getFieldMeta('contactNumber').error}&nbsp;
            </p>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-xs">Opening Time</span>
            </label>
            <input
              {...getFieldProps('openingTime')}
              disabled={isMutating}
              type="time"
              min="00:00"
              max="23:59"
              className="input input-bordered w-full"
            />
            <p className="form-control-error">
              {getFieldMeta('openingTime').error}&nbsp;
            </p>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-xs">Closing Time</span>
            </label>
            <input
              {...getFieldProps('closingTime')}
              disabled={isMutating}
              type="time"
              min="00:00"
              max="23:59"
              className="input input-bordered w-full"
            />
            <p className="form-control-error">
              {getFieldMeta('closingTime').error}&nbsp;
            </p>
          </div>
          <button
            disabled={isMutating || Object.keys(errors).length > 0}
            onClick={submitForm}
            className="btn btn-primary btn-active mt-4 w-auto"
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}

export default AddStaff
