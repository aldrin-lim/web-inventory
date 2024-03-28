import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { Route, Routes, useNavigate, useResolvedPath } from 'react-router-dom'
import ProductForm, { ProductFormRef, ScreenPath } from './ProductForm'
import { useRef } from 'react'
import { ProductFormValues } from '../hooks/useProductFormValue'
import useCreateProduct from 'hooks/useCreateProduct'
import { toNumber } from 'util/number'
import Description from './ProductForm/Description'
import RecipeList from './ProductForm/RecipeList'
import useBoundStore from 'stores/useBoundStore'

const NewProduct = () => {
  const navigate = useNavigate()
  const productFormRef = useRef<ProductFormRef>(null)

  const resolvedPath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvedPath.pathname

  const { isCreating, createProduct } = useCreateProduct()

  const formValues = useBoundStore((state) => state.productFormValue)

  console.log('formValues', formValues)

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
      middle={<ToolbarTitle key="title" title="New Product" />}
      end={
        <ToolbarButton
          onClick={async () => {
            productFormRef.current?.submit()
          }}
          label="Save"
        />
      }
    />
  )

  const onSubmit = async (values: ProductFormValues) => {
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
      recipe: values.recipe,
    }
    await createProduct(requestBody)
    navigate('../')
  }

  return (
    <>
      <div className={[isParentScreen ? 'screen' : 'hidden'].join(' ')}>
        {isCreating && (
          <div className="loading-cover fixed z-50 flex h-screen w-screen flex-col items-center justify-center bg-white opacity-70">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}
        {renderToolbar()}
        <ProductForm onSubmit={onSubmit} ref={productFormRef} />
      </div>
      <Routes>
        <Route path={`${ScreenPath.Description}/*`} element={<Description />} />
        <Route path={`${ScreenPath.SelectRecipe}/*`} element={<RecipeList />} />
      </Routes>
    </>
  )
}

export default NewProduct
