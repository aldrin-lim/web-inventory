import ImageUpload from 'components/ImageUpload'
import Toolbar from 'components/Layout/components/Toolbar'
import { ChevronRightIcon, ArchiveBoxIcon } from '@heroicons/react/24/solid'
import AddDescription from './components/AddDescription'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import AddProductDetail, {
  addProductDetailSchema,
} from './components/AddProductDetails'
import {
  AddProductActionType,
  AddProductContextProvider,
  AddProductModal,
  ProductDetails,
  useAddProductContext,
} from './contexts/AddProductContext'
import { Field, FieldProps, Formik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useCallback, useEffect } from 'react'

const addProductSchema = z.object({
  name: z.string({
    required_error: 'Product name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost must be a number',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }),
  images: z.array(z.string()).optional(),
})

const modalVariants: Variants = {
  hidden: {
    x: '100vw', // Start off-screen to the right
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: 'backIn' }, // 200ms linear transition
  },
  exit: {
    x: '100vw',
    opacity: 0,
    transition: { duration: 0.2, ease: 'backIn' }, // 200ms linear transition
  },
}

const getProductDetailError = (productDetail: ProductDetails) => {
  const validationResult = addProductDetailSchema.safeParse(productDetail)

  if (!validationResult.success) {
    return validationResult.error.issues[0].message
  }

  return ''
}

const AddProductComponent = () => {
  const {
    dispatch,
    state: { activeModal, productDetails },
  } = useAddProductContext()

  const { description } = productDetails

  const navigate = useNavigate()

  const setActiveModal = (modal: AddProductModal) => {
    dispatch({
      type: AddProductActionType.SetActiveModal,
      payload: modal,
    })
  }

  const setProductValue = useCallback(
    (field: keyof ProductDetails, value: unknown) => {
      dispatch({
        type: AddProductActionType.UpdateProductDetail,
        payload: {
          field,
          value,
        },
      })
    },
    [dispatch],
  )

  const onSaveProductHanlder = () => {
    const validation = addProductSchema
      .and(addProductDetailSchema)
      .and(
        z.object({
          profit: z.number({
            required_error: 'Profit is required',
            invalid_type_error: 'Profit must be a number',
          }),
        }),
      )
      .safeParse(productDetails)

    if (!validation.success) {
      const error = validation.error.issues[0].message
      console.log(error)
      return
    }

    const requestBody = validation.data

    console.log(requestBody)
  }

  useEffect(() => {
    if (productDetails.price && productDetails.cost) {
      setProductValue(
        'profit',
        Number(productDetails.price) - Number(productDetails.cost),
      )
    }
  }, [productDetails.cost, productDetails.price, setProductValue])

  const addProductDetailError = getProductDetailError(productDetails)

  return (
    <div className="section relative flex flex-col gap-4 pt-0">
      <Formik
        initialValues={productDetails}
        onSubmit={onSaveProductHanlder}
        validationSchema={toFormikValidationSchema(addProductSchema)}
        validateOnChange={false}
      >
        {({ setFieldValue, submitForm }) => {
          return (
            <>
              <Toolbar
                items={[
                  <ToolbarButton
                    key="cancel"
                    label="Cancel"
                    onClick={() => navigate(AppPath.Products)}
                  />,
                  <ToolbarTitle
                    key="title"
                    title="Inactive"
                    description="Product"
                  />,
                  <ToolbarButton
                    key="save"
                    label="Save"
                    onClick={submitForm}
                  />,
                ]}
              />

              <Field name="name">
                {({ field, meta }: FieldProps) => (
                  <div className="form-control w-full">
                    <input
                      {...field}
                      type="text"
                      placeholder="Product Name"
                      className="input input-bordered w-full"
                      onChange={(e) => {
                        setProductValue('name', e.target.value)
                        setFieldValue('name', e.target.value)
                      }}
                    />
                    <p className="form-control-error">{meta.error} &nbsp;</p>
                  </div>
                )}
              </Field>
              <button
                onClick={() => setActiveModal(AddProductModal.Description)}
                className="btn btn-ghost btn-primary btn-xs -mt-[10px]  flex w-full flex-row justify-between p-0 normal-case"
              >
                <span className="col-span-11 w-4/5 truncate overflow-ellipsis text-left text-gray-400">
                  {description || 'Add Description'}
                </span>
                <ChevronRightIcon className="col-span-1 w-5" />
              </button>
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
                        <input
                          {...field}
                          type="number"
                          className="input join-item input-bordered w-full pl-2"
                          placeholder="Price"
                          onChange={(e) => {
                            setProductValue('price', +e.target.value)
                            setFieldValue('price', +e.target.value)
                          }}
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
                        <input
                          {...field}
                          type="number"
                          className="input join-item input-bordered w-full pl-2"
                          placeholder="Cost"
                          onChange={(e) => {
                            setProductValue('cost', +e.target.value)
                            setFieldValue('cost', +e.target.value)
                          }}
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
                  <div className="join">
                    <div className="indicator">
                      <button className="btn disabled join-item px-2 text-gray-500">
                        ₱
                      </button>
                    </div>
                    <input
                      disabled
                      type="number"
                      className="input join-item input-bordered w-full pl-2"
                      placeholder="Profit"
                      value={productDetails.profit || 0}
                    />
                  </div>
                </div>
              </div>

              <ImageUpload
                onChange={(images) => setProductValue('images', images)}
              />
              <button
                className="btn btn-ghost btn-outline btn-primary flex w-full flex-row justify-between"
                onClick={() => setActiveModal(AddProductModal.Detail)}
              >
                <div className="flex flex-row items-center gap-1">
                  <ArchiveBoxIcon className="w-5" />
                  Manage Inventory
                </div>
                <ChevronRightIcon className="w-5" />
              </button>
              <p className="form-control-error">
                {addProductDetailError} &nbsp;
              </p>
            </>
          )
        }}
      </Formik>

      {/* MODALS */}
      <AnimatePresence>
        <motion.div
          className={[
            'section absolute left-0 right-0 h-full bg-base-100 pt-0',
            activeModal === AddProductModal.None ? 'hidden' : '',
          ].join(' ')}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          key={activeModal}
        >
          {activeModal === AddProductModal.Description && <AddDescription />}

          {activeModal === AddProductModal.Detail && <AddProductDetail />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const AddProduct = () => {
  return (
    <AddProductContextProvider>
      <AddProductComponent />
    </AddProductContextProvider>
  )
}

export default AddProduct
