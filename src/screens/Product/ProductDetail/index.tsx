import { ChevronRightIcon, ArchiveBoxIcon } from '@heroicons/react/24/solid'
import ImageUpload from 'components/ImageUpload'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { Formik, Field, FieldProps } from 'formik'
import { Variants, AnimatePresence, motion } from 'framer-motion'
import useCreateProduct from 'hooks/useCreateProduct'
import useUpdateProduct from 'hooks/useUpdateProduct'
import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import AddDescription from 'screens/Product/ProductDetail/components/AddDescription'
import AddProductDetail from 'screens/Product/ProductDetail/components/AddProductDetails'
import {
  Product,
  addProductDetailSchema,
  addProductRequestSchema,
  updateProductRequestSchema,
  addProductSchema,
} from 'types/product.types'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import {
  useProductDetail,
  AddProductModal,
  AddProductActionType,
} from '../contexts/ProductDetailContext'
import UpdateActionMenu from './components/UpdateActionMenu'
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog'

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

const getProductDetailError = (productDetail: Product) => {
  const validationResult = addProductDetailSchema.safeParse(productDetail)

  if (!validationResult.success) {
    return validationResult.error.issues[0].message
  }

  return ''
}

type ProductDetailProps = {
  mode?: 'edit' | 'add'
}

export const ProductDetail = (props: ProductDetailProps) => {
  const {
    dispatch,
    state: { activeModal, productDetails },
  } = useProductDetail()
  const { mode = 'add' } = props

  const modalDialogRef = useRef<HTMLDialogElement>(null)

  const { createProduct, isCreating } = useCreateProduct()
  const { updateProduct, isUpdating } = useUpdateProduct()

  const isMutating = isUpdating || isCreating

  const { description } = productDetails

  const navigate = useNavigate()

  const setActiveModal = (modal: AddProductModal) => {
    dispatch({
      type: AddProductActionType.SetActiveModal,
      payload: modal,
    })
  }

  const setProductValue = useCallback(
    (field: keyof Product, value: unknown) => {
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

  useEffect(() => {
    if (productDetails.price && productDetails.cost) {
      setProductValue(
        'profit',
        Number(productDetails.price) - Number(productDetails.cost),
      )
    }
  }, [productDetails.cost, productDetails.price, setProductValue])

  const addProductDetailError = getProductDetailError(productDetails)

  const onProcessProduct = async () => {
    if (mode === 'add') {
      const validation = addProductRequestSchema.safeParse(productDetails)

      if (!validation.success) {
        const error = validation.error.issues[0].message
        console.log(error)
        return
      }

      const requestBody = validation.data

      await createProduct(requestBody)
    } else {
      const validation = updateProductRequestSchema.safeParse(productDetails)

      if (!validation.success) {
        const error = validation.error.issues[0].message
        console.log(error)
        return
      }

      const requestBody = validation.data
      await updateProduct({ id: requestBody.id, product: requestBody })
    }

    navigate(AppPath.ProductOverview)
  }

  const renderAction = (callback: () => void) => {
    if (mode === 'add') {
      return (
        <ToolbarButton
          label={mode === 'add' ? 'Save' : 'Update'}
          onClick={!isMutating ? callback : undefined}
          disabled={isMutating}
        />
      )
    } else {
      return (
        <UpdateActionMenu
          isLoading={isMutating}
          onDelete={() => modalDialogRef.current?.showModal()}
          onSave={callback}
          key={1}
        />
      )
    }
  }

  return (
    <div className="section relative flex flex-col gap-4 pt-0">
      <ConfirmDeleteDialog
        productName={productDetails.name}
        ref={modalDialogRef}
      />
      <Formik
        initialValues={productDetails}
        onSubmit={onProcessProduct}
        validationSchema={toFormikValidationSchema(addProductSchema)}
        validateOnChange={false}
      >
        {({ setFieldValue, submitForm, setFieldTouched }) => {
          return (
            <>
              <Toolbar
                items={[
                  <ToolbarButton
                    key="cancel"
                    label="Cancel"
                    onClick={() => navigate(AppPath.ProductOverview)}
                  />,
                  <ToolbarTitle
                    key="title"
                    title={mode === 'add' ? 'Add Product' : 'View Product'}
                  />,
                  renderAction(submitForm),
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
                      disabled={isMutating}
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
                          type="text"
                          className="input join-item input-bordered w-full pl-2"
                          placeholder="Price"
                          // This is to prevent input preppending 0 while typing
                          onClick={() => setFieldTouched('price')}
                          onChange={(e) => {
                            const valueStr = e.target.value
                            const value = parseFloat(valueStr)
                            if (valueStr.trim() === '') {
                              // Handle empty string, if necessary
                              setProductValue('price', 0)
                              setFieldValue('price', 0)
                              return
                            }
                            setProductValue('price', value)
                            setFieldValue('price', value)
                          }}
                          disabled={isMutating}
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
                          type="text"
                          className="input join-item input-bordered w-full pl-2"
                          placeholder="Cost"
                          // This is to prevent input preppending 0 while typing
                          onClick={() => setFieldTouched('cost')}
                          onChange={(e) => {
                            const valueStr = e.target.value
                            const value = parseFloat(valueStr)
                            if (valueStr.trim() === '') {
                              // Handle empty string, if necessary
                              setProductValue('cost', 0)
                              setFieldValue('cost', 0)
                              return
                            }
                            setProductValue('cost', value)
                            setFieldValue('cost', value)
                          }}
                          disabled={isMutating}
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
                images={productDetails.images}
              />
              <button
                className="btn btn-ghost btn-outline btn-primary flex w-full flex-row justify-between"
                onClick={() => setActiveModal(AddProductModal.Detail)}
                disabled={isMutating}
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

export default ProductDetail