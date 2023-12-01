import {
  ChevronRightIcon,
  ArchiveBoxIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/solid'
import ProductImages from 'screens/Product/ProductDetail/components/ProductImages'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { FormikProps } from 'formik'
import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { Product, ProductVariant } from 'types/product.types'
import { z } from 'zod'
import { subscreenAnimation } from 'constants/animation'
import { AnimatePresence, motion } from 'framer-motion'
import AddDescription from '../AddDescription'
import AddProductDetail, { AddProductDetailSchema } from '../AddProductDetails'
import AddProductVariant from '../AddProductVariants'
import ProductDetailForm from '../ProductDetailForm'
import {
  ProductVariantDetailActionModal,
  ProductVariantDetailActionType,
  useProductVariantDetail,
} from 'screens/Product/contexts/ProductVariantDetailContext'

type ProductVariantDetailProps = {
  onSave: (productDetai: ProductVariant) => void
  onClose: () => void
}

export const ProductVariantDetail = (props: ProductVariantDetailProps) => {
  const {
    dispatch,
    state: { activeModal, productDetails, mode },
  } = useProductVariantDetail()

  const formikRef = useRef<FormikProps<ProductVariant | Product>>(null)

  const navigate = useNavigate()

  const setActiveModal = (modal: ProductVariantDetailActionModal) => {
    dispatch({
      type: ProductVariantDetailActionType.SetActiveModal,
      payload: modal,
    })
  }

  const setProductValue = useCallback(
    (field: keyof Product, value: unknown) => {
      dispatch({
        type: ProductVariantDetailActionType.UpdateProductDetail,
        payload: {
          field,
          value,
        },
      })
    },
    [dispatch],
  )

  const submitForm = async () => {
    formikRef.current?.submitForm()
  }

  const setFieldValue = (field: keyof Product, value: unknown) => {
    formikRef.current?.setFieldValue(field, value)
    setProductValue(field, value)
  }

  const closeSubscreens = () =>
    dispatch({
      type: ProductVariantDetailActionType.SetActiveModal,
      payload: ProductVariantDetailActionModal.None,
    })

  const saveDescription = (description: string) => {
    dispatch({
      type: ProductVariantDetailActionType.UpdateProductDetail,
      payload: {
        field: 'description',
        value: description,
      },
    })
  }

  const onSaveDetails = (data: z.infer<typeof AddProductDetailSchema>) => {
    const { category, expiryDate, quantity, measurement, allowBackOrder } = data
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
  }

  const onDescriptionButtonClick = () => {
    setActiveModal(ProductVariantDetailActionModal.Description)
  }

  const onProductImagesChange = (images: Array<string>) => {
    setProductValue('images', images)
  }

  return (
    <div className="section relative flex flex-col gap-4  pt-0">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate(AppPath.ProductOverview)}
          />,
          <ToolbarTitle
            key="title"
            title={mode === 'add' ? 'Add Product' : 'View Product'}
          />,
          <ToolbarButton
            key={3}
            label="Done"
            onClick={() => props.onSave(productDetails)}
          />,
        ]}
      />
      <div
        className={`inline-flex flex-grow flex-col gap-4 ${
          activeModal !== ProductVariantDetailActionModal.None // Prevent overlapping content to appear on other subscreen
            ? 'h-0 overflow-hidden'
            : 'h-full'
        }`}
      >
        <ProductDetailForm
          initialValues={productDetails}
          onSubmit={submitForm}
          setFieldValue={setFieldValue}
          ref={formikRef}
          onDescriptionButtonClick={onDescriptionButtonClick}
        />

        <ProductImages
          onImagesChange={onProductImagesChange}
          images={productDetails?.images || []}
        />

        <button
          className="btn btn-ghost btn-outline btn-primary flex w-full flex-row justify-between"
          onClick={() => setActiveModal(ProductVariantDetailActionModal.Detail)}
        >
          <div className="flex flex-row items-center gap-1">
            <ArchiveBoxIcon className="w-5" />
            Manage Inventory
          </div>
          <ChevronRightIcon className="w-5" />
        </button>
      </div>

      <AnimatePresence>
        <motion.div
          className={[
            'section absolute left-0 right-0 z-10 h-full bg-base-100 pt-0',
            activeModal === ProductVariantDetailActionModal.None
              ? 'hidden'
              : '',
          ].join(' ')}
          variants={subscreenAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          key={activeModal}
        >
          {activeModal === ProductVariantDetailActionModal.Description && (
            <AddDescription
              onBack={closeSubscreens}
              onSave={saveDescription}
              description={productDetails?.description}
            />
          )}

          {activeModal === ProductVariantDetailActionModal.Detail && (
            <AddProductDetail
              values={{
                category: productDetails.category || '',
                expiryDate: productDetails.expiryDate || null,
                quantity: productDetails.quantity || 0,
                measurement: productDetails.measurement || 'pieces',
                allowBackOrder: productDetails.allowBackOrder,
              }}
              onSave={onSaveDetails}
              onClose={closeSubscreens}
            />
          )}

          {activeModal === ProductVariantDetailActionModal.Variants && (
            <AddProductVariant />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ProductVariantDetail
