import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  useProductDetail,
  AddProductActionType,
  AddProductModal,
} from '../../contexts/ProductDetailContext'
import { useRef } from 'react'
import { Field, FieldProps, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import MeasurementSelect from './MeasurementSelect'
import { Product, addProductDetailSchema } from 'types/product.types'

const AddProductDetail = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    dispatch,
    state: { productDetails },
  } = useProductDetail()

  const goBack = () => {
    dispatch({
      type: AddProductActionType.SetActiveModal,
      payload: AddProductModal.None,
    })
  }

  const setProductValue = (field: keyof Product, value: unknown) => {
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
        {({ submitForm, setFieldValue, values }) => {
          return (
            <>
              <Toolbar
                items={[
                  <ToolbarButton key={1} label="Cancel" onClick={goBack} />,
                  <ToolbarTitle key={2} title="Inventory" />,
                  <ToolbarButton key={3} label="Done" onClick={submitForm} />,
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
                          {({ meta }: FieldProps) => (
                            <div className="w-full">
                              <MeasurementSelect
                                onChange={(value) => {
                                  setProductValue('measurement', value?.value)
                                  setFieldValue('measurement', value?.value)
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
                        console.log(new Date(e.target.value))
                        setFieldValue('expiryDate', new Date(e.target.value))
                        setProductValue('expiryDate', new Date(e.target.value))
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
