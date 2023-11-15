import ImageUpload from 'components/ImageUpload'
import Toolbar from 'components/Layout/components/Toolbar'
import { ChevronRightIcon, ArchiveBoxIcon } from '@heroicons/react/24/solid'
import AddDescription from './components/AddDescription'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import AddProductDetail from './components/AddProductDetails'
import {
  AddProductActionType,
  AddProductContextProvider,
  AddProductModal,
  ProductDetails,
  useAddProductContext,
} from './contexts/AddProductContext'
import { Field, FieldProps, Formik } from 'formik'

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

  const setProductValue = (field: keyof ProductDetails, value: unknown) => {
    dispatch({
      type: AddProductActionType.UpdateProductDetail,
      payload: {
        field,
        value,
      },
    })
  }

  return (
    <div className="section relative flex flex-col gap-4 pt-0">
      <Formik initialValues={productDetails} onSubmit={() => {}}>
        {({ setFieldValue }) => {
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
                  <ToolbarButton key="save" label="Save" />,
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
                className="btn btn-primary btn-ghost btn-xs -mt-[10px]  flex w-full flex-row justify-between p-0 normal-case"
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
                      <input
                        {...field}
                        type="number"
                        placeholder="Price"
                        className="input input-bordered w-full"
                        onChange={(e) => {
                          setProductValue('price', e.target.value)
                          setFieldValue('price', e.target.value)
                        }}
                      />
                      <p className="form-control-error">{meta.error}&nbsp;</p>
                    </div>
                  )}
                </Field>

                <Field name="cost">
                  {({ field, meta }: FieldProps) => (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-xs">Cost</span>
                      </label>
                      <input
                        {...field}
                        type="number"
                        placeholder="Cost"
                        className="input input-bordered w-full"
                        onChange={(e) => {
                          setProductValue('cost', e.target.value)
                          setFieldValue('cost', e.target.value)
                        }}
                      />
                      <p className="form-control-error">{meta.error} &nbsp;</p>
                    </div>
                  )}
                </Field>

                <Field name="profit">
                  {({ field }: FieldProps) => (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-xs">Profit</span>
                      </label>
                      <input
                        {...field}
                        type="number"
                        placeholder="Profit"
                        className="input input-bordered w-full"
                        onChange={(e) => {
                          setProductValue('profit', e.target.value)
                          setFieldValue('price', e.target.value)
                        }}
                      />
                    </div>
                  )}
                </Field>
              </div>
              <ImageUpload
                onChange={(images) => setProductValue('images', images)}
              />
              <button
                className="btn btn-primary btn-ghost btn-outline flex w-full flex-row justify-between"
                onClick={() => setActiveModal(AddProductModal.Detail)}
              >
                <div className="flex flex-row items-center gap-1">
                  <ArchiveBoxIcon className="w-5" />
                  Manage Inventory
                </div>
                <ChevronRightIcon className="w-5" />
              </button>
            </>
          )
        }}
      </Formik>

      {/* MODALS */}
      <AnimatePresence>
        <motion.div
          className={[
            'absolute left-0 right-0 bg-base-100 h-full pt-0 section',
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
