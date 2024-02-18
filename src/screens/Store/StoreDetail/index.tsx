import Toolbar from 'components/Layout/components/Toolbar'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import useUser from 'hooks/useUser'
import { updateUserBussiness } from 'api/users.api'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Business, UpdateUserBusinessSchema } from 'types/business.type'
import Skeleton from './Skeleton'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

const StoreDetail = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useUser()
  const [business, setBusiness] = useState<Business>({
    id: '',
    name: '',
    description: '',
    address: '',
    closingTime: '00:00',
    openingTime: '00:00',
    contactNumber: '',
  })

  const { getFieldMeta, getFieldProps, submitForm, errors } = useFormik({
    initialValues: business,
    onSubmit: async (values) => {
      await mutateAsync(values)
    },
    validationSchema: toFormikValidationSchema(UpdateUserBusinessSchema),
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

  const { mutateAsync, isLoading: isMutating } = useMutation({
    mutationFn: updateUserBussiness,
    onSuccess: async () => {
      toast.success('Store successfully updated', {
        autoClose: 500,
        theme: 'colored',
      })
    },
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue. "
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response?.data?.message
        }
      }
      toast.error(errorMessage, {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  useEffect(() => {
    const business = user?.businesses[0]
    if (business) {
      setBusiness({
        ...business,
        openingTime: business.openingTime.slice(0, 5),
        closingTime: business.closingTime.slice(0, 5),
      })
    }
  }, [isLoading, user?.businesses])

  return (
    <div className="screen">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(AppPath.Root)}
            disabled={isMutating}
          />,
          <ToolbarTitle key={2} title="Store Settings" />,
        ]}
      />
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

export default StoreDetail
