import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PrimaryAction from './components/ProductDetailPrimaryAction'
import { z } from 'zod'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import useCreateProduct from 'hooks/useCreateProduct'
import SlidingTransition from 'components/SlidingTransition'
import Description from './screens/Description'
import StockDetail from './screens/StockDetail'
import { ProductSoldBy, RecipeSchema } from 'types/product.types'
import { GetProductSchema } from 'api/product/getProductById'
import useDeleteProduct from 'hooks/useDeleteProduct'
import useUpdateProduct from 'hooks/useUpdateProduct'
import { v4 } from 'uuid'
import useCloneProduct from 'hooks/useCloneProduct'
import {
  computeProfitAmount,
  computeProfitPercentage,
  toNumber,
} from 'util/number'
import {
  AddProductDetailSchema,
  ProductDetailFormValidationSchema,
  ProductDetailFormikValue,
  ViewProductDetailSchema,
} from './ProductDetail.types'
import { useCustomRoute } from 'util/route'
import { CreateProductBodySchema } from 'api/product/createProduct'
import { toast } from 'react-toastify'
import { UpdateProductBodySchema } from 'api/product/updateProduct'
import { getActiveBatch } from 'util/products'
import ProductForm from './components/ProductForm'
import RecipeList from './screens/RecipeList'
import ProductWithRecipeForm from './components/ProductWithRecipeForm'
import RecipeDetails from './screens/RecipeDetails'

type Recipe = z.infer<typeof RecipeSchema>

export enum ScreenPath {
  Description = 'description',
  StockDetail = 'stock-detail',
  SelectRecipe = 'select-recipe',
  RecipeDetail = 'recipe-details',
}

type ProductDetailProps = {
  product?: z.infer<typeof GetProductSchema>
}

export const ProductDetail = (props: ProductDetailProps) => {
  const defaultValue = useMemo(() => {
    return {
      name: '',
      price: 0,
      cost: 0,
      images: [],
      profitAmount: 0,
      profitPercentage: 0,
      trackStock: false,
      description: '',
      profit: 0,
      category: '',
      soldBy: ProductSoldBy.Pieces,
      allowBackOrder: false,
      isBulkCost: false,
      availability: '',
      forSale: true,
      outOfStock: false,
      totalQuantity: 0,
      batches: [
        {
          id: v4(),
          name: 'Batch 1',
          cost: 0,
          costPerUnit: 0,
          quantity: 1,
          unitOfMeasurement: 'pieces',
          expirationDate: null,
        },
      ],
    } as AddProductDetailSchema
  }, [])
  const navigate = useNavigate()

  const product = useMemo(() => {
    if (!props.product) {
      return undefined
    }

    const updatedProduct = props.product as ViewProductDetailSchema

    if (updatedProduct.isBulkCost === false && !props.product.recipe) {
      updatedProduct.cost = getActiveBatch(props.product.batches).cost
    }

    if (props.product.recipe) {
      updatedProduct.cost = props.product.recipe.cost
    }
    return updatedProduct
  }, [props.product])

  const mode: 'add' | 'edit' = product ? 'edit' : 'add'

  const { currentScreen, isParentScreen, navigateToParent } =
    useCustomRoute(ScreenPath)

  const { createProduct, isCreating } = useCreateProduct()
  const { deleteProduct, isDeleting } = useDeleteProduct()
  const { updateProduct, isUpdating } = useUpdateProduct()
  const { cloneProduct, isCloning } = useCloneProduct()

  const [isStockReset, setIsStockReset] = useState(false)

  const isMutating = isCreating || isDeleting || isUpdating || isCloning

  const initialValues = product ?? defaultValue
  const {
    submitForm,
    errors,
    getFieldProps,
    setFieldValue,
    values,
    setValues,
  } = useFormik<ProductDetailFormikValue>({
    initialValues,
    validationSchema: toFormikValidationSchema(
      ProductDetailFormValidationSchema,
    ),
    enableReinitialize: true,
    validateOnBlur: false,
    onSubmit: async (formValue) => {
      console.log(formValue)
      formValue.price = toNumber(formValue.price)
      formValue.profitPercentage = toNumber(formValue.profitPercentage)
      formValue.profitAmount = toNumber(formValue.profitAmount)

      if (formValue.isBulkCost === false) {
        formValue.batches = formValue.batches.map((batch) => {
          return {
            ...batch,
            cost: toNumber(formValue.cost),
          }
        })
      }

      const validation = (
        product ? UpdateProductBodySchema : CreateProductBodySchema
      ).safeParse(formValue)

      if (!validation.success) {
        const error = validation.error.issues[0].message
        console.log(validation.error)
        toast.error(error, {
          autoClose: 500,
          theme: 'colored',
        })
        return
      }

      if (product) {
        await updateProduct({
          id: product.id,
          body: validation.data,
        })
      } else {
        await createProduct(validation.data as CreateProductBodySchema)
        navigate(AppPath.ProductOverview)
      }
    },
    validateOnChange: false,
  })

  const showDescription = () => {
    navigate(ScreenPath.Description)
  }

  const goBackToProductScreen = () => {
    navigateToParent()
  }

  useEffect(() => {
    if (mode === 'add') {
      setFieldValue('cost', '')
      setFieldValue('price', '')
      setFieldValue('profitAmount', '')
      setFieldValue('profitPercentage', '')
    }
  }, [mode])

  const showRecipeList = () => {
    navigate(ScreenPath.SelectRecipe)
  }

  const onRecipeSelect = async (recipe: Recipe) => {
    navigateToParent()
    await setValues(initialValues)
    setFieldValue('recipe', recipe)
    setFieldValue('name', recipe.name)
    setFieldValue('cost', recipe.cost)
  }

  const removeRecipe = () => {
    setValues(initialValues)
  }

  return (
    <>
      <div
        className={['screen pb-9', !isParentScreen ? 'hidden-screen' : ''].join(
          ' ',
        )}
      >
        <Toolbar
          items={[
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(AppPath.ProductOverview)}
              disabled={isMutating}
            />,
            <ToolbarTitle
              key="title"
              title={product ? 'View Product' : 'Add Product'}
            />,
            <PrimaryAction
              mode={product ? 'edit' : 'add'}
              key="primaryAction"
              disabled={isMutating}
              isLoading={isMutating}
              onCreate={() => {
                submitForm()
              }}
              onDelete={async () => {
                if (product) {
                  await deleteProduct({ id: product.id })
                  navigate(AppPath.ProductOverview)
                }
              }}
              onSave={function (): void {
                submitForm()
              }}
              onClone={async () => {
                if (product) {
                  await cloneProduct({ id: product.id })
                }
              }}
            />,
          ]}
        />
        {!values.recipe && (
          <ProductForm
            // FormikProps
            getFieldProps={getFieldProps}
            values={values}
            errors={errors}
            setFieldValue={setFieldValue}
            setValues={setValues}
            // ComponentStateProps
            showRecipeList={showRecipeList}
            isMutating={isMutating}
            mode={mode}
            setIsStockReset={setIsStockReset}
            // AdditionalProps
            defaultValue={defaultValue}
            showDescription={showDescription}
          />
        )}
        {values.recipe && (
          <ProductWithRecipeForm
            // FormikProps
            getFieldProps={getFieldProps}
            values={values}
            errors={errors}
            setFieldValue={setFieldValue}
            setValues={setValues}
            // ComponentStateProps
            isMutating={isMutating}
            mode={mode}
            removeRecipe={removeRecipe}
            // AdditionalProps
            defaultValue={defaultValue}
            showDescription={showDescription}
            showRecipeDetail={() => navigate(ScreenPath.RecipeDetail)}
          />
        )}
      </div>
      <SlidingTransition
        direction="right"
        isVisible={currentScreen === ScreenPath.Description}
        zIndex={11}
      >
        <Description
          description={values.description}
          onBack={goBackToProductScreen}
          onComplete={(desription) => {
            setFieldValue('description', desription)
          }}
        />
      </SlidingTransition>

      <SlidingTransition
        direction="right"
        isVisible={currentScreen === ScreenPath.StockDetail}
        zIndex={11}
      >
        <StockDetail
          disabled={
            isStockReset === false &&
            mode === 'edit' &&
            values.trackStock === true
          }
          activeBatch={props.product?.activeBatch}
          value={values}
          onBack={goBackToProductScreen}
          onComplete={async (value) => {
            if (value.batches.length === 0) {
              setIsStockReset(true)
              const cost = toNumber(values.cost)
              const newBatch = {
                ...defaultValue.batches[0],
                id: v4(),
                quantity: 1,
                cost,
              }
              const newProfitAmount = computeProfitAmount(
                toNumber(values.price),
                cost,
              )
              const newProfitPercentage = computeProfitPercentage(
                toNumber(values.price),
                cost,
              )
              await setValues({
                ...values,
                allowBackOrder: false,
                trackStock: false,
                isBulkCost: false,
                soldBy: ProductSoldBy.Pieces,
                profitPercentage: newProfitPercentage,
                profitAmount: newProfitAmount,
                batches: [newBatch],
              })
            } else {
              const cost = value.isBulkCost
                ? toNumber(getActiveBatch(value.batches).costPerUnit)
                : toNumber(values.cost)

              const updatedValues = {
                ...values,
                allowBackOrder: value.allowBackOrder,
                batches: value.batches,
                soldBy: value.soldBy,
                cost,
                isBulkCost: value.isBulkCost,
              }

              if (values.price) {
                updatedValues.profitAmount = computeProfitAmount(
                  toNumber(values.price),
                  cost,
                )
                updatedValues.profitPercentage = computeProfitPercentage(
                  toNumber(values.price),
                  cost,
                )
              }

              await setValues(updatedValues)
            }
          }}
        />
      </SlidingTransition>

      <SlidingTransition
        direction="right"
        isVisible={currentScreen === ScreenPath.SelectRecipe}
        zIndex={11}
      >
        <RecipeList onBack={navigateToParent} onRecipeSelect={onRecipeSelect} />
      </SlidingTransition>
      {values.recipe && (
        <SlidingTransition
          direction="right"
          isVisible={currentScreen === ScreenPath.RecipeDetail}
          zIndex={11}
        >
          <RecipeDetails onBack={navigateToParent} recipe={values.recipe} />
        </SlidingTransition>
      )}
    </>
  )
}

export default ProductDetail
