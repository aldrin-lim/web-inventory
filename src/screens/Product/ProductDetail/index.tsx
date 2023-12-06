import {
  ChevronRightIcon,
  ArchiveBoxIcon,
  ChevronLeftIcon,
  PlusIcon,
} from '@heroicons/react/24/solid'
import ProductImages from 'screens/Product/ProductDetail/components/ProductImages'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { FormikProps } from 'formik'
import useCreateProduct from 'hooks/useCreateProduct'
import useUpdateProduct from 'hooks/useUpdateProduct'
import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { Product, ProductVariant } from 'types/product.types'
import {
  useProductDetail,
  ProductDetailActionModal,
  ProductDetailActionType,
} from '../contexts/ProductDetailContext'
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog'
import useDeleteProduct from 'hooks/useDeleteProduct'
import PrimaryAction from './components/ProductDetailPrimaryAction'
import ProductDetailForm from './components/ProductDetailForm'
import ProductVariantList from './components/ProductVariantList'
import { AnimatePresence, motion } from 'framer-motion'
import AddDescription from './components/AddDescription'
import AddProductDetail, {
  AddProductDetailSchema,
} from './components/AddProductDetails'
import AddProductVariant from './components/AddProductVariants'
import { subscreenAnimation } from 'constants/animation'
import { z } from 'zod'
import { ProductVariantDetailProvider } from '../contexts/ProductVariantDetailContext'
import ProductVariantDetail from './components/ProductVariantDetail'

export const ProductDetail = () => {
  const {
    dispatch,
    state: { activeModal, productDetails, mode },
  } = useProductDetail()

  const [currentVariant, setCurrentVariant] = useState<{
    variant: ProductVariant
    variantIndex: number
  } | null>(null)

  const modalDialogRef = useRef<HTMLDialogElement>(null)
  const formikRef = useRef<FormikProps<Product | ProductVariant>>(null)

  const { createProduct, isCreating } = useCreateProduct()
  const { updateProduct, isUpdating } = useUpdateProduct()
  const { deleteProduct, isDeleting } = useDeleteProduct()

  const isMutating = isUpdating || isCreating || isDeleting

  const navigate = useNavigate()

  const setActiveModal = (modal: ProductDetailActionModal) => {
    dispatch({
      type: ProductDetailActionType.SetActiveModal,
      payload: modal,
    })
  }

  const setProductValue = useCallback(
    (field: keyof Product, value: unknown) => {
      dispatch({
        type: ProductDetailActionType.UpdateProductDetail,
        payload: {
          field,
          value,
        },
      })
    },
    [dispatch],
  )

  const submitForm = async () => {
    formikRef.current?.submitForm
    if (mode === 'add') {
      await createProduct(productDetails)
    } else {
      console.log(productDetails)
      await updateProduct(productDetails)
    }
  }

  const onDeleteProduct = useCallback(async () => {
    if (productDetails.id) {
      await deleteProduct({ id: productDetails.id })
      navigate(AppPath.ProductOverview)
    } else {
      // track why id isnt being provided
    }
  }, [deleteProduct, navigate, productDetails.id])

  const onClone = useCallback(async () => {
    if (productDetails.id) {
      const newProductName = `copy of ${productDetails.name}`
      await createProduct({
        ...productDetails,
        name: newProductName,
      })
    } else {
      // track why id isnt being provided
    }
  }, [createProduct, productDetails])

  const setFieldValue = (field: keyof Product, value: unknown) => {
    formikRef.current?.setFieldValue(field, value)
    setProductValue(field, value)
  }

  const closeSubscreens = () =>
    dispatch({
      type: ProductDetailActionType.SetActiveModal,
      payload: ProductDetailActionModal.None,
    })

  const saveDescription = (description: string) => {
    dispatch({
      type: ProductDetailActionType.UpdateProductDetail,
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
    setActiveModal(ProductDetailActionModal.Description)
  }

  const onProductImagesChange = (images: Array<string>) => {
    setProductValue('images', images)
  }

  const onProductVariantClick = (index: number) => {
    if (productDetails.variants && productDetails.variants[index]) {
      setCurrentVariant({
        variantIndex: index,
        variant: productDetails.variants[index],
      })
    }
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          className={[
            'section absolute z-30 flex min-h-screen flex-col gap-4 bg-base-100  pt-0',
            currentVariant ? '' : 'hidden',
          ].join(' ')}
          variants={subscreenAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          key={JSON.stringify(currentVariant) ?? 0}
        >
          {currentVariant && (
            <ProductVariantDetailProvider
              productDetails={currentVariant.variant}
            >
              <ProductVariantDetail
                onClose={() => setCurrentVariant(null)}
                onSave={(variant) => {
                  dispatch({
                    type: ProductDetailActionType.UpdateProductVariant,
                    payload: {
                      variantIndex: currentVariant.variantIndex,
                      updatedVariant: variant,
                    },
                  })
                  setCurrentVariant(null)
                }}
              />
            </ProductVariantDetailProvider>
          )}
          {!currentVariant && <div>asdads</div>}
        </motion.div>
      </AnimatePresence>
      <div
        className={`section relative flex-col gap-4 pt-0 ${
          currentVariant ? 'hidden' : 'flex'
        }`}
      >
        <ConfirmDeleteDialog
          ref={modalDialogRef}
          productName={productDetails.name}
          onDelete={onDeleteProduct}
        />

        <Toolbar
          items={[
            <ToolbarButton
              key={2}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(AppPath.ProductOverview)}
            />,
            <ToolbarTitle
              key="title"
              title={mode === 'add' ? 'Add Product' : 'View Product'}
            />,
            <PrimaryAction
              mode={mode}
              key="primaryAction"
              isLoading={isMutating}
              onClone={onClone}
              onCreate={submitForm}
              onDelete={onDeleteProduct}
              onSave={submitForm}
            />,
          ]}
        />
        <div
          className={`inline-flex flex-grow flex-col gap-4 ${
            activeModal !== ProductDetailActionModal.None // Prevent overlapping content to appear on other subscreen
              ? 'h-0 overflow-hidden'
              : 'h-full'
          }`}
        >
          <ProductDetailForm
            initialValues={productDetails}
            onSubmit={submitForm}
            setFieldValue={setFieldValue}
            ref={formikRef}
            disabled={isMutating}
            onDescriptionButtonClick={onDescriptionButtonClick}
          />

          <ProductImages
            onImagesChange={onProductImagesChange}
            images={productDetails?.images || []}
          />

          {!productDetails.variants ||
            (productDetails.variants?.length === 0 && (
              <button
                className="btn btn-ghost btn-outline btn-primary flex w-full flex-row justify-between"
                onClick={() => setActiveModal(ProductDetailActionModal.Detail)}
                disabled={isMutating}
              >
                <div className="flex flex-row items-center gap-1">
                  <ArchiveBoxIcon className="w-5" />
                  Manage Inventory
                </div>
                <ChevronRightIcon className="w-5" />
              </button>
            ))}

          <div className="flex w-full flex-row items-center justify-between">
            <h1 className="font-bold">Variants</h1>
            {productDetails.variants && productDetails.variants.length > 0 && (
              <button
                onClick={() =>
                  setActiveModal(ProductDetailActionModal.Variants)
                }
                className="btn btn-ghost btn-sm"
              >
                <PlusIcon className="w-5 text-blue-400" />
              </button>
            )}
          </div>
          {!(productDetails.variants && productDetails.variants.length > 0) && (
            <button
              className="btn btn-ghost btn-outline btn-primary btn-md  text-center"
              onClick={() => setActiveModal(ProductDetailActionModal.Variants)}
              disabled={isMutating || productDetails.name.length < 1}
            >
              Add Variants
            </button>
          )}

          <ProductVariantList
            onItemClick={onProductVariantClick}
            variants={productDetails.variants}
          />
        </div>

        <AnimatePresence>
          <motion.div
            className={[
              'section absolute left-0 right-0 z-10 h-full bg-base-100 pt-0',
              activeModal === ProductDetailActionModal.None ? 'hidden' : '',
            ].join(' ')}
            variants={subscreenAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={activeModal}
          >
            {activeModal === ProductDetailActionModal.Description && (
              <AddDescription
                onBack={closeSubscreens}
                onSave={saveDescription}
                description={productDetails?.description}
              />
            )}

            {activeModal === ProductDetailActionModal.Detail && (
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
          </motion.div>
        </AnimatePresence>
        {[
          ProductDetailActionModal.Variants,
          ProductDetailActionModal.VariantsInfo,
        ].includes(activeModal) && <AddProductVariant />}
      </div>
    </>
  )
}

export default ProductDetail
