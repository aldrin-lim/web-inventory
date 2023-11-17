import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  useAddProductContext,
  AddProductActionType,
  AddProductModal,
  ProductDetails,
} from '../contexts/AddProductContext'
import { useRef } from 'react'
import { Field, FieldProps, Formik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

export const addProductDetailSchema = z.object({
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int(),
  measurement: z
    .string({
      required_error: 'Measurement is required',
      invalid_type_error: 'Measurement must be a string',
    })
    .min(1, 'Measurement must be at least 1 character long'),
  category: z
    .string({
      invalid_type_error: 'Category must be a string',
    })
    .optional(),
  allowBackOrder: z
    .boolean({
      invalid_type_error: 'Allow back order must be a boolean',
    })
    .optional(),
  expiryDate: z
    .date({
      invalid_type_error: 'Expiry Date must be a date',
    })
    .nullable()
    .optional(),
})

const AddProductDetail = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    dispatch,
    state: { productDetails },
  } = useAddProductContext()

  const goBack = () => {
    dispatch({
      type: AddProductActionType.SetActiveModal,
      payload: AddProductModal.None,
    })
  }

  const setProductValue = (field: keyof ProductDetails, value: unknown) => {
    dispatch({
      type: AddProductActionType.UpdateProductDetail,
      payload: {
        field,
        value,
      },
    })
  }

  const onFocus = () => {
    if (inputRef.current) {
      inputRef.current.select()
    }
  }

  return (
    <div className="">
      <Formik
        initialValues={{
          category: productDetails.category || '',
          expiryDate: productDetails.expiryDate || null,
          quantity: productDetails.quantity || 0,
          measurement: productDetails.measurement || '',
          allowBackOrder: productDetails.allowBackOrder,
        }}
        validationSchema={toFormikValidationSchema(addProductDetailSchema)}
        onSubmit={({
          category,
          expiryDate,
          quantity,
          measurement,
          allowBackOrder,
        }) => {
          if (category) {
            setProductValue('category', category)
          }

          if (expiryDate) {
            setProductValue('expiryDate', expiryDate)
          }

          if (quantity !== undefined || quantity !== null) {
            setProductValue('quantity', quantity)
          }

          if (measurement) {
            setProductValue('measurement', measurement)
          }
          if (allowBackOrder) {
            setProductValue('allowBackOrder', allowBackOrder)
          }
          goBack()
        }}
      >
        {({ submitForm, setFieldValue, values, errors }) => {
          return (
            <>
              <Toolbar
                items={[
                  <ToolbarButton
                    key="cancel"
                    label="Cancel"
                    onClick={goBack}
                  />,
                  <ToolbarTitle key="title" title="Description" />,
                  <ToolbarButton
                    key="save"
                    label="Save"
                    onClick={submitForm}
                  />,
                ]}
              />

              <Field name="allowBackOrder">
                {({ field }: FieldProps) => (
                  <div className="form-control flex w-full flex-row justify-between ">
                    <span>Allow purchase when out of stock</span>
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
                              className="btn  join-item"
                              onClick={() => {
                                setFieldValue('quantity', values.quantity + 1)
                              }}
                            >
                              +
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
                              className="join-itm  btn"
                              onClick={() => {
                                if (values.quantity > 0) {
                                  setFieldValue('quantity', values.quantity - 1)
                                }
                              }}
                            >
                              -
                            </button>
                          </div>
                          <p className="form-control-error">
                            {meta.error} &nbsp;
                          </p>
                        </div>
                        <Field name="measurement">
                          {({ field, meta }: FieldProps) => (
                            <div className="w-full">
                              <select
                                {...field}
                                className="select select-bordered w-full"
                              >
                                <option disabled selected value="">
                                  Select measurement
                                </option>
                                <option>grams</option>
                                <option>kilograms</option>
                              </select>
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
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-xs">Expiry Date</span>
                    </label>
                    <input
                      {...field}
                      type="date"
                      placeholder="Expiry date"
                      className="input input-bordered w-full"
                      onChange={(e) => {
                        setFieldValue('quantity', values.quantity + 1)
                        setProductValue('quantity', new Date(e.target.value))
                      }}
                    />
                    <p className="form-control-error">{meta.error}&nbsp;</p>
                  </div>
                )}
              </Field>
              <pre className="text-left text-xs">
                {JSON.stringify(errors, null, 2)}
              </pre>
            </>
          )
        }}
      </Formik>
    </div>
  )
}

export default AddProductDetail
