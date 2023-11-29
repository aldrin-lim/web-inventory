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
import useCreateProduct from 'hooks/useCreateProduct'
import useUpdateProduct from 'hooks/useUpdateProduct'
import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { Product } from 'types/product.types'
import {
  useProductDetail,
  AddProductModal,
  AddProductActionType,
} from '../contexts/ProductDetailContext'
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog'
import useDeleteProduct from 'hooks/useDeleteProduct'
import ProductDetailModalManager from './components/ProductDetailModalManager'
import PrimaryAction from './components/ProductDetailPrimaryAction'
import ProductDetailForm from './components/ProductDetailForm'

export const ProductDetail = () => {
  const {
    dispatch,
    state: { activeModal, productDetails, mode },
  } = useProductDetail()

  const modalDialogRef = useRef<HTMLDialogElement>(null)
  const formikRef = useRef<FormikProps<Product>>(null)

  const { createProduct, isCreating } = useCreateProduct()
  const { updateProduct, isUpdating } = useUpdateProduct()
  const { deleteProduct, isDeleting } = useDeleteProduct()

  const isMutating = isUpdating || isCreating || isDeleting

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

  const submitForm = async () => {
    formikRef.current?.submitForm
    if (mode === 'add') {
      await createProduct(productDetails)
    } else {
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

  return (
    <div className="section relative flex flex-col gap-4 pt-0">
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
            key="primaryAction"
            isLoading={isMutating}
            onClone={onClone}
            onCreate={submitForm}
            onDelete={onDeleteProduct}
            onSave={submitForm}
          />,
        ]}
      />

      <ProductDetailForm
        intialValues={productDetails}
        onSubmit={submitForm}
        setFieldValue={setFieldValue}
        ref={formikRef}
        disabled={isMutating}
      />

      <ProductImages />

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

      <ProductDetailModalManager activeModal={activeModal} />
    </div>
  )
}

export default ProductDetail
