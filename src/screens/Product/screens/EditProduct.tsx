import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useGetProduct from 'hooks/useGetProduct'
import { useEffect, useRef, useState } from 'react'
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom'
import { ProductFormValues } from '../hooks/useProductFormValue'
import ProductForm, { ProductFormRef, ScreenPath } from './ProductForm'
import { PIECES } from 'constants copy/measurement'
import useCloneProduct from 'hooks/useCloneProduct'
import useDeleteProduct from 'hooks/useDeleteProduct'
import useUpdateProduct from 'hooks/useUpdateProduct'
import { toNumber } from 'lodash'
import PrimaryAction from '../ProductDetail/components/ProductDetailPrimaryAction'
import Description from './ProductForm/Description'
import RecipeList from './ProductForm/RecipeList'
import useBoundStore from 'stores/useBoundStore'

const EditProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const setProductInitialValue = useBoundStore(
    (state) => state.setProdutctFormInitialValue,
  )

  const setProductFormValue = useBoundStore(
    (state) => state.setProductFormValue,
  )

  const { deleteProduct, isDeleting } = useDeleteProduct()
  const { updateProduct, isUpdating } = useUpdateProduct()
  const { cloneProduct, isCloning } = useCloneProduct()

  const isMutating = isDeleting || isUpdating || isCloning

  const { product, isLoading: isGettingProduct } = useGetProduct(id)
  const [isLoading, setIsLoading] = useState(true)

  const productFormRef = useRef<ProductFormRef>(null)

  const resolvedPath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvedPath.pathname

  useEffect(() => {
    if (product && isGettingProduct === false) {
      const currentCost = product.activeBatch?.cost ?? 0
      const overAllMeasurement =
        product.activeBatch?.unitOfMeasurement ?? product.isBulkCost
          ? 'g'
          : PIECES
      const formValue = {
        id: product.id,
        name: product.name,
        mode: 'edit',
        description: product.description,
        currentCost: currentCost.toString(),
        overAllMeasurement: overAllMeasurement,
        price: product.price.toString(),
        profitAmount: product.profitAmount.toString(),
        profitPercentage: product.profitPercentage.toString(),
        images: product.images,
        category: product.category,
        isBulkCost: product.isBulkCost,
        soldBy: product.soldBy,
        isIngredient: !product.forSale,
        allowBackOrder: product.allowBackOrder,
        applyTax: product.applyTax,
        stockWarning: product.stockWarning,
        batches: product.batches.map((batch) => {
          return {
            id: batch.id,
            name: batch.name,
            cost: batch.cost.toString(),
            costPerUnit: batch.costPerUnit,
            quantity: batch.quantity.toString(),
            unitOfMeasurement: batch.unitOfMeasurement,
            isDeducted: batch.isDeducted,
            expirationDate: batch.expirationDate,
          }
        }),
        recipe: product.recipe,
      } as ProductFormValues
      setProductInitialValue(formValue)
      setProductFormValue(formValue)
      setIsLoading(false)
    }
  }, [product, isGettingProduct, setProductInitialValue, setProductFormValue])

  const renderToolbar = () => (
    <Toolbar
      start={
        <ToolbarButton
          icon={<ChevronLeftIcon className="w-6" />}
          onClick={() => {
            navigate('../')
          }}
        />
      }
      middle={<ToolbarTitle key="title" title="Edit Product" />}
      end={
        <PrimaryAction
          key="primaryAction"
          onDelete={async () => {
            if (product?.id) {
              await deleteProduct({ id: product.id })
              navigate('../')
            }
          }}
          onSave={function (): void {
            productFormRef.current?.submit()
          }}
          onClone={async () => {
            if (product) {
              await cloneProduct({ id: product.id })
            }
          }}
        />
      }
    />
  )

  const onSave = async (values: ProductFormValues) => {
    const requestBody = {
      id: values.id,
      name: values.name,
      forSale: !values.isIngredient,
      description: values.description,
      price: toNumber(values.price),
      profitAmount: toNumber(values.profitAmount),
      profitPercentage: toNumber(values.profitPercentage),
      images: values.images,
      category: values.category,
      trackStock: true,
      soldBy: values.soldBy,
      allowBackOrder: values.allowBackOrder,
      isBulkCost: values.isBulkCost,
      stockWarning: values.stockWarning,
      batches: values.batches.map((batch) => {
        return {
          id: batch.id,
          name: batch.name,
          cost: toNumber(batch.cost),
          costPerUnit: toNumber(batch.costPerUnit),
          quantity: toNumber(batch.quantity),
          unitOfMeasurement: batch.unitOfMeasurement,
          isDeducted: batch.isDeducted,
          expirationDate: batch.expirationDate,
        }
      }),
    }
    await updateProduct(requestBody)
  }

  if (!id) {
    throw new Error('No product id found (EditProduct)')
  }

  if (isLoading) {
    return (
      <div className="">
        {renderToolbar()}
        <Skeleton />
      </div>
    )
  }

  return (
    <>
      <div className={[isParentScreen ? 'screen' : 'hidden'].join(' ')}>
        {renderToolbar()}
        <ProductForm onSubmit={onSave} ref={productFormRef} />
        {isMutating && (
          <div className="loading-cover fixed z-50 flex h-screen w-screen flex-col items-center justify-center bg-white opacity-70">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}
      </div>
      <Routes>
        <Route path={`${ScreenPath.Description}/*`} element={<Description />} />
        <Route path={`${ScreenPath.SelectRecipe}/*`} element={<RecipeList />} />
      </Routes>
    </>
  )

  // Now you can use the id variable in your component
}

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton h-[48px] rounded-md" />

      <div className="skeleton h-[40px] rounded-md" />

      <div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default EditProduct
