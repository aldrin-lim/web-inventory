import Toolbar from 'components/Layout/components/Toolbar'
import {
  Bars3Icon,
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'
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
import CurrencyInput from 'react-currency-input-field'

const StoreDetail = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useUser()
  const [showPin, hidePin] = useState(false)
  const [business, setBusiness] = useState<Business>({
    id: '',
    name: '',
    description: '',
    address: '',
    closingTime: '00:00',
    openingTime: '00:00',
    contactNumber: '',
    voidPin: '',
  })

  const {
    getFieldMeta,
    getFieldProps,
    submitForm,
    errors,
    setFieldValue,
    values,
  } = useFormik({
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
    <div className="screen pb-6">
      <Toolbar
        start={
          <label
            htmlFor="my-drawer"
            className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
          >
            <Bars3Icon className="w-6" />
          </label>
        }
        middle={<ToolbarTitle title="Store Settings" />}
      />
      {isLoading && <Skeleton />}
      {!isLoading && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="form-control w-full">
            <label className="form-control-label label">
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
            <label className="form-control-label label">
              <span className="label-text text-xs">Address</span>
            </label>
            <textarea
              {...getFieldProps('address')}
              disabled={isMutating}
              type="text"
              className="textarea textarea-bordered w-full"
            />
            <p className="form-control-error">
              {getFieldMeta('address').error}&nbsp;
            </p>
          </div>

          <div className="form-control w-full">
            <label className="form-control-label label">
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

          <div className="join">
            <div className="form-control  w-full">
              <label className="form-control-label label">
                <span className="label-text text-xs">PIN</span>
              </label>
              <input
                {...getFieldProps('voidPin')}
                disabled={isMutating}
                type={showPin ? 'text' : 'password'}
                className="input input-bordered w-full"
                onChange={(e) => {
                  // Limit up to 6
                  if (values.voidPin?.length <= 6) {
                    setFieldValue('voidPin', e.target.value.slice(0, 6))
                  }
                }}
                inputMode="numeric"
              />
              <p className="form-control-error">
                {getFieldMeta('voidPin').error}&nbsp;
              </p>
            </div>
            <button className="btn join-item ">
              {showPin ? (
                <EyeIcon onClick={() => hidePin(false)} className="w-6" />
              ) : (
                <EyeSlashIcon onClick={() => hidePin(true)} className="w-6" />
              )}
            </button>
          </div>

          <div className="form-control w-full">
            <label className="form-control-label label">
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
            <label className="form-control-label label">
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

          <div className="flex flex-col gap-2">
            <div className="form-control flex w-full flex-row gap-2 py-2">
              <input
                {...getFieldProps('applyTax')}
                autoComplete="off"
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked === true) {
                    setFieldValue('tax', { amount: 12, type: 'inclusive' })
                    setTimeout(() => {
                      window.scrollTo(0, 9999)
                    }, 100)
                  } else {
                    setFieldValue('tax', undefined)
                  }
                }}
                checked={!!values.tax}
                className="toggle toggle-primary"
              />
              <span>Apply Tax</span>
            </div>
            {values.tax && (
              <>
                <div className="">
                  <label className="label">
                    <span className="label-text text-xs">Tax Type:</span>
                  </label>
                  <div className="join">
                    <input
                      {...getFieldProps('tax.type')}
                      className="btn join-item"
                      checked={values.tax?.type === 'inclusive'}
                      type="radio"
                      name="options"
                      onChange={() => setFieldValue('tax.type', 'inclusive')}
                      aria-label="Inclusive"
                    />
                    <input
                      {...getFieldProps('tax.type')}
                      checked={values.tax?.type === 'exclusive'}
                      className="btn join-item"
                      type="radio"
                      name="options"
                      onChange={() => setFieldValue('tax.type', 'exclusive')}
                      aria-label="Exclusive"
                    />
                  </div>
                </div>
                <div className="join w-full">
                  <CurrencyInput
                    autoComplete="off"
                    decimalsLimit={4}
                    disabled={isMutating}
                    onBlur={getFieldProps('tax.amount').onBlur}
                    name={getFieldProps('tax.amount').name}
                    value={values.tax?.amount}
                    type="text"
                    tabIndex={5}
                    className={`input join-item input-bordered w-[80px] focus:outline-none`}
                    placeholder="₱0"
                    inputMode="decimal"
                    onValueChange={(value) => {
                      setFieldValue('tax.amount', value)
                    }}
                  />
                  <button className="btn join-item ">%</button>
                </div>
                <p className="form-control-error">
                  {getFieldMeta('tax.amount').error}&nbsp;
                </p>
                <p className="mt-2 px-2 text-xs">
                  {values?.tax?.type === 'inclusive' &&
                    'All products will include VAT based on the current rate you set.'}
                  {values?.tax?.type === 'exclusive' &&
                    'All products will have an additional charge based on the current rate you set'}
                </p>
              </>
            )}
          </div>

          <button
            disabled={isMutating}
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
