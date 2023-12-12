import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useRef } from 'react'
import { Field, FieldProps, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { AddProductSchema } from 'api/product/createProduct'
import { z } from 'zod'
import MeasurementSelect from '../components/MeasurementSelect'

export const AddProductDetailSchema = AddProductSchema.pick({
  category: true,
  expiryDate: true,
  quantity: true,
  measurement: true,
  allowBackOrder: true,
})

type AddProductDetailProps = {
  onSave: (data: z.infer<typeof AddProductDetailSchema>) => void
  onClose: () => void
  values: z.infer<typeof AddProductDetailSchema>
}

const AddProductDetail = (props: AddProductDetailProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { onSave, onClose, values } = props

  const onFocus = () => {
    if (inputRef.current) {
      inputRef.current.select()
    }
  }

  return (
    <div className="">
      <Formik
        initialValues={{
          category: values.category || '',
          expiryDate: values.expiryDate || null,
          quantity: values.quantity || 0,
          measurement: values.measurement || 'pieces',
          allowBackOrder: values.allowBackOrder,
        }}
        validationSchema={toFormikValidationSchema(AddProductDetailSchema)}
        onSubmit={(data) => {
          onSave(data)
          onClose()
        }}
      >
        {({ submitForm, setFieldValue, values }) => {
          return (
            <>
              <Toolbar
                items={[
                  <ToolbarButton key={1} label="Cancel" onClick={onClose} />,
                  <ToolbarTitle key={2} title="Inventory" />,
                  <ToolbarButton key={3} label="Done" onClick={submitForm} />,
                ]}
              />

              <Field name="allowBackOrder">
                {({ field }: FieldProps) => (
                  <div className="form-control flex w-full flex-row justify-between ">
                    <span>Allow selling when out of stock</span>
                    <input
                      {...field}
                      checked={values.allowBackOrder}
                      type="checkbox"
                      className="toggle toggle-primary"
                    />
                  </div>
                )}
              </Field>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-xs">Quantity</span>
                </label>
                <Field name="quantity">
                  {({ field, meta }: FieldProps) => (
                    <>
                      <div className="flex w-full flex-row items-center gap-2">
                        <div>
                          <div className="join flex border border-gray-300">
                            <button
                              className="join-itm  btn"
                              onClick={() => {
                                if (values.quantity > 0) {
                                  setFieldValue('quantity', values.quantity - 1)
                                }
                              }}
                            >
                              -
                            </button>
                            <input
                              {...field}
                              ref={inputRef}
                              type="number"
                              inputMode="numeric"
                              className="input join-item max-w-[80px] text-center text-black"
                              onFocus={onFocus}
                              value={values.quantity}
                            />
                            <button
                              className="btn  join-item"
                              onClick={() => {
                                setFieldValue('quantity', values.quantity + 1)
                              }}
                            >
                              +
                            </button>
                          </div>
                          <p className="form-control-error">
                            {meta.error} &nbsp;
                          </p>
                        </div>
                        <Field name="measurement">
                          {({ field, meta }: FieldProps) => (
                            <div className="w-full">
                              <MeasurementSelect
                                value={field.value}
                                onChange={(value) => {
                                  setFieldValue('measurement', value?.label)
                                }}
                              />
                              <p className="form-control-error">
                                {meta.error}&nbsp;
                              </p>
                            </div>
                          )}
                        </Field>
                      </div>
                    </>
                  )}
                </Field>
              </div>

              <Field name="category">
                {({ field, meta }: FieldProps) => (
                  <div className="form-control w-full ">
                    <label className="label">
                      <span className="label-text text-xs">Category</span>
                    </label>
                    <input
                      {...field}
                      placeholder="Category"
                      className="input input-bordered w-full "
                    />

                    <p className="form-control-error">{meta.error}&nbsp;</p>
                  </div>
                )}
              </Field>
              <Field name="expiryDate">
                {({ field, meta }: FieldProps) => (
                  <div className="form-control relative w-full">
                    <label className="label">
                      <span className="label-text text-xs">Expiry Date</span>
                    </label>
                    <input
                      {...field}
                      type="date"
                      placeholder="Expiry date"
                      className="DatePicker input input-bordered text-left "
                      onChange={(e) => {
                        setFieldValue('expiryDate', new Date(e.target.value))
                      }}
                      value={
                        values.expiryDate
                          ? new Date(values.expiryDate)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                    />
                    <p className="form-control-error">{meta.error}&nbsp;</p>
                  </div>
                )}
              </Field>
            </>
          )
        }}
      </Formik>
    </div>
  )
}

export default AddProductDetail
