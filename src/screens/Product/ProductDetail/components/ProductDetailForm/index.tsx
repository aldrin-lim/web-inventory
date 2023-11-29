import PriceInput from 'components/PriceInput'
import { Formik, Field, FieldProps, FormikProps } from 'formik'
import { Ref, forwardRef } from 'react'
import { Product, addProductSchema } from 'types/product.types'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import AddProductDescriptionButton from '../AddProductDescriptionButton'

type ProductDetailFormProps = {
  onSubmit: () => void
  initialValues: Product
  disabled?: boolean
  setFieldValue: (field: keyof Product, value: unknown) => void
}

const ProductDetailForm = forwardRef(
  (props: ProductDetailFormProps, ref: Ref<FormikProps<Product>>) => {
    const { initialValues, onSubmit, disabled = false, setFieldValue } = props

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={toFormikValidationSchema(addProductSchema)}
        validateOnChange={false}
        innerRef={ref}
      >
        {({ values, getFieldMeta }) => {
          return (
            <>
              <Field name="name">
                {({ field, meta }: FieldProps) => (
                  <div className="form-control w-full">
                    <input
                      {...field}
                      type="text"
                      placeholder="Product Name"
                      className="input input-bordered w-full"
                      onChange={(e) => {
                        setFieldValue('name', e.target.value)
                      }}
                      disabled={disabled}
                    />
                    <p className="form-control-error">{meta.error} &nbsp;</p>
                  </div>
                )}
              </Field>
              <AddProductDescriptionButton />
              <div className="grid w-full grid-cols-3 grid-rows-1 gap-4">
                <Field name="price">
                  {({ field, meta }: FieldProps) => (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-xs">Price</span>
                      </label>
                      <div className="join">
                        <div className="indicator">
                          <button className="btn disabled join-item px-2 text-gray-500">
                            ₱
                          </button>
                        </div>
                        <PriceInput
                          {...field}
                          className="input join-item input-bordered w-full pl-2"
                          placeholder="Price"
                          onChange={(value) => {
                            setFieldValue('price', value)
                            const isProfitTouched =
                              getFieldMeta('profit').touched
                            if (!isProfitTouched) {
                              setFieldValue('profit', +value - values.cost)
                            }
                          }}
                          disabled={disabled}
                        />
                      </div>
                      <p className="form-control-error">{meta.error} &nbsp;</p>
                    </div>
                  )}
                </Field>

                <Field name="cost">
                  {({ field, meta }: FieldProps) => (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-xs">Cost</span>
                      </label>
                      <div className="join">
                        <div className="indicator">
                          <button className="btn disabled join-item px-2 text-gray-500">
                            ₱
                          </button>
                        </div>
                        <PriceInput
                          {...field}
                          className="input join-item input-bordered w-full pl-2"
                          placeholder="Cost"
                          onChange={(value) => {
                            setFieldValue('cost', value)
                          }}
                          disabled={disabled}
                        />
                      </div>

                      <p className="form-control-error">{meta.error} &nbsp;</p>
                    </div>
                  )}
                </Field>

                <Field name="profit">
                  {({ field, meta }: FieldProps) => (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-xs">Profit</span>
                      </label>
                      <div className="join">
                        <div className="indicator">
                          <button className="btn disabled join-item px-2 text-gray-500">
                            ₱
                          </button>
                        </div>
                        <PriceInput
                          {...field}
                          className="input join-item input-bordered w-full pl-2"
                          placeholder="Profit"
                          value={field.value}
                          onChange={(value) => {
                            setFieldValue('profit', value)
                            const isPricedTouched =
                              getFieldMeta('price').touched
                            if (!isPricedTouched) {
                              // console.log('isProfitTouched', isProfitTouched)
                              setFieldValue('price', +value + values.cost)
                            }
                          }}
                          disabled={disabled}
                        />
                      </div>

                      <p className="form-control-error">{meta.error} &nbsp;</p>
                    </div>
                  )}
                </Field>
              </div>
            </>
          )
        }}
      </Formik>
    )
  },
)

ProductDetailForm.displayName = 'ProductDetailForm'

export default ProductDetailForm
