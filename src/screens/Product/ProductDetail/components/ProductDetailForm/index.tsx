import PriceInput from 'components/PriceInput'
import { Formik, Field, FieldProps, FormikProps } from 'formik'
import { Ref, forwardRef } from 'react'
import { Product, ProductVariant } from 'types/product.types'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import AddProductDescriptionButton from '../AddProductDescriptionButton'
import { AddProductSchema } from 'api/product/createProduct'

type ProductDetailFormProps = {
  onSubmit: () => void
  initialValues: Product | ProductVariant
  disabled?: boolean
  setFieldValue: (field: keyof Product, value: unknown) => void
  onDescriptionButtonClick: () => void
}

const getVariantName = (options: ProductVariant['variantOptions']) => {
  return options.map((variant) => variant.value).join('/')
}

const isProductVariant = (
  detail: Product | ProductVariant,
): detail is ProductVariant => {
  return (detail as ProductVariant).variantOptions !== undefined
}

const ProductDetailForm = forwardRef(
  (
    props: ProductDetailFormProps,
    ref: Ref<FormikProps<Product | ProductVariant>>,
  ) => {
    const {
      initialValues,
      onSubmit,
      disabled = false,
      setFieldValue,
      onDescriptionButtonClick,
    } = props

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={toFormikValidationSchema(AddProductSchema)}
        validateOnChange={false}
        innerRef={ref}
      >
        {({ values }) => {
          return (
            <>
              {!isProductVariant(values) ? (
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
              ) : (
                <div className="flex flex-row items-end gap-1">
                  <h1 className="text-lg font-bold">
                    {getVariantName(values.variantOptions)}
                  </h1>
                  <span className="mb-1 text-xs">variant</span>
                </div>
              )}
              <AddProductDescriptionButton
                onClick={onDescriptionButtonClick}
                description={initialValues.description}
              />
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
                            const profit = +value - values.cost
                            setFieldValue('profit', profit)
                            setFieldValue('price', value)
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
                            const profit = values.price - +value
                            setFieldValue('profit', profit)
                            setFieldValue('cost', value)
                          }}
                          disabled={disabled}
                        />
                      </div>

                      <p className="form-control-error">{meta.error} &nbsp;</p>
                    </div>
                  )}
                </Field>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-xs">Profit</span>
                  </label>
                  <div className="flex h-[48px] flex-row items-center gap-2">
                    <p>₱</p>
                    <p>{values.profit.toFixed(2)}</p>
                  </div>
                </div>
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
