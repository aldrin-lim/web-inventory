// ProductDetails.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PrimaryAction from './components/ProductDetailPrimaryAction'
import { z } from 'zod'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import useCreateProduct from 'hooks/useCreateProduct'
import SlidingTransition from 'components/SlidingTransition'
import {
  ProductBatchSchema,
  ProductSoldBy,
  RecipeSchema,
} from 'types/product.types'
import { GetProductSchema } from 'api/product/getProductById'
import useDeleteProduct from 'hooks/useDeleteProduct'
import useUpdateProduct from 'hooks/useUpdateProduct'
import { v4 } from 'uuid'
import useCloneProduct from 'hooks/useCloneProduct'
import {
  computeProfitAmount,
  computeProfitPercentage,
  padWithZeros,
  profitPercentageColor,
  toNumber,
} from 'util/number'
import {
  FormikValuesSchema,
  ProductDetailFormikValue,
} from './ProductDetail.types'
import { toast } from 'react-toastify'
import { getActiveBatch } from 'util/products'
import Big from 'big.js'
import CurrencyInput from 'react-currency-input-field'
import CategoryDropdown from './components/CategoryDropdown'
import ProductImages from './components/ProductImages'
import { cloneDeep } from 'lodash'
import { measurementOptions, unitAbbrevationsToLabel } from 'util/measurement'
import BatchCard from './components/BatchCard'
import MeasurementSelect from './components/MeasurementSelect'
import { AnimatePresence, motion } from 'framer-motion'
import { CreateProductBodySchema } from 'api/product/createProduct'
import { PIECES } from 'constants copy/measurement'
import RecipeList from './screens/RecipeList'
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { formatToPeso } from 'util/currency'
import useUser from 'hooks/useUser'
import { Analytics } from 'util/analytics'
import useFieldVisibility from './hooks/useFieldVisibility'
import * as yup from 'yup'

type Recipe = z.infer<typeof RecipeSchema>

export enum Screen {
  Description = 'description',
  StockDetail = 'stock-detail',
  SelectRecipe = 'select-recipe',
  RecipeDetail = 'recipe-details',
}

type ProductDetailProps = {
  product?: z.infer<typeof GetProductSchema>
}

export type ProductAction = 'add' | 'edit'

// TODO: Disble show more on add

export const ProductDetail = () => {
  // const { product } = props
  // const location = useLocation()
  // const { taxRate, tax } = useUser()

  // const [activeScreen, setActiveScreen] = useState<Screen | null>(null)
  // const [showTaxField, setShowTaxField] = useState(false)

  // useEffect(() => {
  //   if (product?.applyTax && tax?.type === 'exclusive') {
  //     setShowTaxField(true)
  //   }
  // }, [product?.applyTax, tax])

  // const isParentScreen = activeScreen === null

  // const defaultValue = useMemo(() => {
  //   return {
  //     name: '',
  //     price: undefined,
  //     images: [],
  //     profitAmount: undefined,
  //     profitPercentage: undefined,
  //     overallCost: undefined,
  //     trackStock: true,
  //     description: '',
  //     profit: 0,
  //     category: '',
  //     soldBy: ProductSoldBy.Pieces,
  //     allowBackOrder: false,
  //     isBulkCost: false,
  //     availability: '',
  //     forSale: true,
  //     outOfStock: false,
  //     totalQuantity: 0,
  //     isExpired: false,
  //     id: v4(),
  //     batches: [
  //       {
  //         id: v4(),
  //         name: `Batch #${padWithZeros(1)}`,
  //         cost: 0,
  //         costPerUnit: 0,
  //         quantity: 1,
  //         unitOfMeasurement: 'pieces',
  //         expirationDate: null,
  //         isDeducted: false,
  //       },
  //     ],
  //   } satisfies ProductDetailFormikValue
  // }, [])
  // const navigate = useNavigate()

  // const ValidationSchema = FormikValuesSchema.superRefine(async (data, ctx) => {
  //   // TODO: Rename isForSale to isIngredient
  //   const isIngredient = data.forSale === false
  //   // If ingredient, no need to validate overall cost
  //   if (!isIngredient) {
  //     const priceValidation = z
  //       .number({
  //         coerce: true,
  //         required_error: 'Price is required',
  //         invalid_type_error: 'Price must be a number',
  //       })
  //       .safeParse(toNumber(data.price))
  //     const profitAmountValidation = z
  //       .number({
  //         required_error: 'Profit Amount is required',
  //         invalid_type_error: 'Profit Amount must be a number',
  //         coerce: true,
  //       })
  //       .safeParse(toNumber(data.profitAmount))
  //     const profitPercentageValidation = z
  //       .number({
  //         required_error: 'Profit Percentage is required',
  //         invalid_type_error: 'Profit Percentage must be a number',
  //         coerce: true,
  //       })
  //       .safeParse(toNumber(data.profitPercentage))
  //     if (priceValidation.success === false) {
  //       ctx.addIssue({
  //         path: ['price'], // Path to the field
  //         message: priceValidation.error.issues[0].message,
  //         code: 'custom',
  //       })
  //     }
  //     if (profitAmountValidation.success === false) {
  //       ctx.addIssue({
  //         path: ['profitAmount'], // Path to the field
  //         message: profitAmountValidation.error.issues[0].message,
  //         code: 'custom',
  //       })
  //     }
  //     if (profitPercentageValidation.success === false) {
  //       ctx.addIssue({
  //         path: ['profitPercentage'], // Path to the field
  //         message: profitPercentageValidation.error.issues[0].message,
  //         code: 'custom',
  //       })
  //     }

  //     if (data.isBulkCost === false && !data.recipe) {
  //       const overallCostValidation = z
  //         .number({
  //           required_error: 'Cost is required',
  //           invalid_type_error: 'Cost must be a number',
  //           coerce: true,
  //         })
  //         .positive('Cost must be greater than 0')
  //         .safeParse(toNumber(data.overallCost))
  //       if (overallCostValidation.success === false) {
  //         ctx.addIssue({
  //           path: ['overallCost'], // Path to the field
  //           message: overallCostValidation.error.issues[0].message,
  //           code: 'custom',
  //         })
  //       }
  //     }
  //   }

  //   // Validate batches

  //   if (mode === 'add') {
  //     data.batches.forEach((batch) => {
  //       const quantityValidation = z
  //         .number({
  //           coerce: true,
  //           required_error: 'Quantity is required',
  //           invalid_type_error: 'Quantity must be a number',
  //         })
  //         .positive('Quantity must be greater than 0')
  //         .safeParse(batch.quantity)
  //       if (quantityValidation.success === false) {
  //         const index = data.batches.findIndex((b) => b.id === batch.id)
  //         ctx.addIssue({
  //           path: ['batches', index, 'quantity'], // Path to the field
  //           message: quantityValidation.error.issues[0].message,
  //           code: 'custom',
  //         })
  //       }
  //     })
  //   }
  // })

  // const mode: ProductAction = product ? 'edit' : 'add'

  // const { createProduct, isCreating } = useCreateProduct()
  // const { deleteProduct, isDeleting } = useDeleteProduct()
  // const { updateProduct, isUpdating } = useUpdateProduct()
  // const { cloneProduct, isCloning } = useCloneProduct()

  // const isMutating = isCreating || isDeleting || isUpdating || isCloning

  // const overallMeasurment = useMemo(() => {
  //   if (!product) {
  //     return PIECES
  //   }

  //   return product.soldBy === ProductSoldBy.Pieces
  //     ? 'pieces'
  //     : product?.batches[0]?.unitOfMeasurement ?? 'g'
  // }, [product])

  // const [unitOfMeasurement, setUnitOfMeasurement] = useState(overallMeasurment)
  // const [showMore, setShowMore] = useState(false)
  // const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
  //   useState(false)

  // const overallCostFromBatches: number | undefined =
  //   product &&
  //   !product.isBulkCost &&
  //   product.batches[0] &&
  //   product.batches[0].cost
  //     ? product.batches[0].cost
  //     : 0

  // const overallCost = overallCostFromBatches
  //   ? overallCostFromBatches
  //   : undefined

  // const initialValues = product ?? defaultValue
  // const {
  //   submitForm,
  //   errors,
  //   getFieldProps,
  //   setFieldValue,
  //   values,
  //   setValues,
  //   initialValues: initialFormValues,
  //   validateForm,
  // } = useFormik<ProductDetailFormikValue>({
  //   initialValues: {
  //     ...initialValues,
  //     overallCost,
  //   },
  //   validationSchema: toFormikValidationSchema(ValidationSchema),
  //   enableReinitialize: false,
  //   validateOnBlur: false,
  //   onSubmit: async (formValue) => {
  //     formValue.price = toNumber(formValue.price)
  //     formValue.profitPercentage = toNumber(formValue.profitPercentage)
  //     formValue.profitAmount = toNumber(formValue.profitAmount)
  //     if (formValue.isBulkCost) {
  //       delete formValue.overallCost
  //       formValue.batches = formValue.batches.map((batch) => {
  //         return {
  //           ...batch,
  //           cost: toNumber(batch.cost),
  //           costPerUnit: toNumber(batch.costPerUnit),
  //         }
  //       })
  //     } else {
  //       formValue.batches = formValue.batches.map((batch) => {
  //         return {
  //           ...batch,
  //           cost: toNumber(formValue.overallCost),
  //           costPerUnit: toNumber(batch.costPerUnit),
  //         }
  //       })
  //     }

  //     if (formValue.recipe) {
  //       formValue.batches = formValue.batches.map((batch) => {
  //         return {
  //           ...batch,
  //           cost: toNumber(formValue.recipe?.cost),
  //         }
  //       })
  //     }

  //     const validation = await ValidationSchema.safeParseAsync(formValue)
  //     if (!validation.success) {
  //       const error = validation.error.issues[0].message
  //       console.log(validation.error)
  //       toast.error(error, {
  //         autoClose: 500,
  //         theme: 'colored',
  //       })
  //       return
  //     }

  //     if (product) {
  //       await updateProduct({
  //         id: product.id,
  //         body: validation.data,
  //       })
  //     } else {
  //       await createProduct(validation.data as CreateProductBodySchema)
  //       Analytics.track('Save Add Product')
  //       if (location.state?.from) {
  //         navigate(location.state.from)
  //         return
  //       }
  //       navigate(AppPath.ProductOverview)
  //     }
  //   },
  //   validateOnChange: false,
  // })

  // const showDescription = () => {
  //   setActiveScreen(Screen.Description)
  // }

  // const showRecipeList = () => {
  //   setActiveScreen(Screen.SelectRecipe)
  // }

  // const onRecipeSelect = useCallback(
  //   async (recipe: Recipe) => {
  //     setActiveScreen(null)
  //     await setValues(defaultValue)
  //     await setFieldValue('recipe', recipe)
  //     await setFieldValue('name', recipe.name)
  //     await setFieldValue('images', recipe.images)
  //     await setFieldValue('batches.0.cost', recipe.cost)
  //   },
  //   [defaultValue, setFieldValue, setValues],
  // )

  // const removeRecipe = () => {
  //   setValues(defaultValue)
  // }

  // const checkUnsavedChanges = () => {
  //   const hasUnsavedChanges =
  //     JSON.stringify({
  //       ...initialFormValues,
  //       overallCost: undefined,
  //     }) !== JSON.stringify({ ...values, overallCost: undefined })

  //   if (hasUnsavedChanges) {
  //     setShowUnsavedChangesDialog(true)
  //     return
  //   }
  //   goBack()
  // }

  // const goBack = () => {
  //   Analytics.track('Exit Add Product')
  //   if (location.state?.from) {
  //     navigate(location.state.from)
  //     return
  //   }
  //   navigate(AppPath.ProductOverview)
  // }

  // // Memoized values
  // const showCostInput = useMemo(() => {
  //   // TODO: Rename isForSale to isIngredient
  //   const isIngredient = values.forSale === false

  //   if (isIngredient) {
  //     return false
  //   }

  //   if (values.isBulkCost === true) {
  //     return false
  //   }

  //   return true
  // }, [values.forSale, values.isBulkCost])

  // const showPriceAndProfit = useMemo(() => {
  //   // TODO: Rename isForSale to isIngredient
  //   const isIngredient = values.forSale === false
  //   if (isIngredient) {
  //     return false
  //   }

  //   return true
  // }, [values.forSale])

  // const activeBatch = values.activeBatch ?? getActiveBatch(values.batches)

  // const computedCost = useMemo(() => {
  //   if (values.recipe) {
  //     return values.recipe.cost
  //   }

  //   if (activeBatch) {
  //     return values.isBulkCost
  //       ? toNumber(activeBatch.costPerUnit)
  //       : toNumber(values.overallCost)
  //   }

  //   return 0
  // }, [activeBatch, values.isBulkCost, values.overallCost, values.recipe])

  // const nonActiveBatches = useMemo(() => {
  //   return values.batches.filter((batch) => batch.id !== activeBatch?.id)
  // }, [values.batches, activeBatch])

  // // Event handlers

  // const submitFormikForm = useCallback(async () => {
  //   if (values.batches.length === 0) {
  //     toast.error('No batch available for use', {
  //       autoClose: 1000,
  //       theme: 'colored',
  //     })
  //     return
  //   }

  //   const validation = await ValidationSchema.safeParseAsync(values)
  //   if (!validation.success) {
  //     const error = validation.error.issues[0].message
  //     toast.error(error, {
  //       autoClose: 500,
  //       theme: 'colored',
  //     })
  //     return
  //   }

  //   submitForm()
  // }, [errors, submitForm, values])

  // const addNewBatch = async () => {
  //   const newBatch = {
  //     id: v4(),
  //     name: `Batch #${padWithZeros(values.batches.length + 1)} `,
  //     cost: values.isBulkCost ? 0 : computedCost,
  //     costPerUnit: 0,
  //     quantity: 1,
  //     unitOfMeasurement:
  //       values.soldBy === ProductSoldBy.Pieces
  //         ? 'pieces'
  //         : values.batches[0]?.unitOfMeasurement ?? 'g',
  //     expirationDate: null,
  //   } as z.infer<typeof ProductBatchSchema>

  //   await setFieldValue('batches', [...values.batches, newBatch])
  //   if (!showMore) {
  //     setShowMore(true)
  //   }
  //   await new Promise((resolve) => setTimeout(resolve, 200))
  //   const lastBatchElement = document.querySelector('#add-batch-button')
  //   if (lastBatchElement) {
  //     window.scrollTo({
  //       top: 9999,
  //       behavior: 'smooth', // Optional: Adds smooth scrolling
  //     })
  //   }

  //   if (!activeBatch) {
  //     const newActiveBatchElement = document.querySelector('#active-batch-card')
  //     if (newActiveBatchElement) {
  //       const topPos =
  //         newActiveBatchElement.getBoundingClientRect().top + window.pageYOffset
  //       window.scrollTo({
  //         top: topPos - 80, // Subtract 20 pixels to adjust the final position
  //         behavior: 'smooth', // Optional: Adds smooth scrolling
  //       })
  //     }
  //   }
  // }

  // useEffect(() => {
  //   // Prevent confusion when the there are no active batches
  //   if (!activeBatch) {
  //     if (!showMore) {
  //       setShowMore(true)
  //     }
  //   }
  // }, [activeBatch, showMore])

  // const updateBatch = useCallback(
  //   async (updatedBatch: z.infer<typeof BatchSchema>) => {
  //     await setFieldValue(
  //       'batches',
  //       values.batches.map((batch) => {
  //         if (batch.id === updatedBatch.id) {
  //           return updatedBatch
  //         }
  //         return {
  //           ...batch,
  //           unitOfMeasurement: updatedBatch.unitOfMeasurement,
  //         }
  //       }),
  //     )
  //   },
  //   [setFieldValue, values.batches],
  // )

  // const afterTaxPrice = useMemo(() => {
  //   if (values.price && taxRate) {
  //     // return values.price * (1 + taxRate / 100)
  //     return new Big(values.price)
  //       .times(new Big(1).plus(new Big(taxRate).div(100)))
  //       .toNumber()
  //   }
  //   return 0
  // }, [values.price, taxRate])

  // useEffect(() => {
  //   if (mode === 'add') {
  //     Analytics.track('Start Add Product')
  //   }
  // }, [])

  // const visibility = useFieldVisibility(
  //   values.forSale,
  //   values.isBulkCost,
  //   Boolean(values.recipe),
  //   taxRate !== null,
  // )

  // return (
  //   <>
  //     <div
  //       className={[
  //         'screen  pb-9',
  //         !isParentScreen ? 'hidden-screen' : '',
  //       ].join(' ')}
  //     >
  //       <dialog
  //         open={showUnsavedChangesDialog}
  //         id="unsaved-changes-dialog"
  //         className="modal bg-black/30"
  //       >
  //         <div className="modal-box px-4">
  //           <h3 className="text-lg font-bold">Unsaved Changes</h3>
  //           <p className="py-4">
  //             There are unsaved changes. Do you want to leave without saving?
  //           </p>
  //           <div className="font-sm modal-action">
  //             <button
  //               onClick={() => setShowUnsavedChangesDialog(false)}
  //               className="btn"
  //             >
  //               Keep editing
  //             </button>
  //             <button
  //               onClick={goBack}
  //               type="button"
  //               className="btn btn-primary"
  //             >
  //               Leave without saving
  //             </button>
  //           </div>
  //         </div>
  //       </dialog>
  //       {isMutating && (
  //         <div className="fixed z-50 flex h-screen w-screen flex-col items-center justify-center bg-white opacity-70">
  //           <span className="loading loading-ring loading-lg"></span>
  //         </div>
  //       )}
  //       <Toolbar
  //         start={
  //           <ToolbarButton
  //             icon={<ChevronLeftIcon className="w-6" />}
  //             onClick={checkUnsavedChanges}
  //             disabled={isMutating}
  //           />
  //         }
  //         middle={
  //           <ToolbarTitle
  //             key="title"
  //             title={product ? 'Edit Product' : 'New Product'}
  //           />
  //         }
  //         end={
  //           <PrimaryAction
  //             mode={product ? 'edit' : 'add'}
  //             key="primaryAction"
  //             disabled={isMutating}
  //             isLoading={isMutating}
  //             onCreate={() => {
  //               submitFormikForm()
  //             }}
  //             onDelete={async () => {
  //               if (product) {
  //                 await deleteProduct({ id: product.id })
  //                 navigate(AppPath.ProductOverview)
  //               }
  //             }}
  //             onSave={function (): void {
  //               if (!getActiveBatch(values.batches)) {
  //                 toast.error('No batch usable found', {
  //                   autoClose: 1000,
  //                   theme: 'colored',
  //                 })
  //                 return
  //               }
  //               submitFormikForm()
  //             }}
  //             onClone={async () => {
  //               if (product) {
  //                 await cloneProduct({ id: product.id })
  //               }
  //             }}
  //           />
  //         }
  //       />
  //       <div className="flex flex-col gap-1">
  //         <label className="form-control w-full ">
  //           <div className="">
  //             <span className="label-text-alt text-gray-400">Product Name</span>
  //           </div>
  //           <input
  //             {...getFieldProps('name')}
  //             autoComplete="off"
  //             type="text"
  //             placeholder="(e.g., Milk Tea, Coffee, etc.)"
  //             className="input input-bordered w-full"
  //             tabIndex={1}
  //             disabled={isMutating}
  //           />

  //           {errors.name && (
  //             <div className="label py-0">
  //               <span className="label-text-alt text-xs text-red-400">
  //                 {errors.name}
  //               </span>
  //             </div>
  //           )}
  //         </label>

  //         {/* Recipe label */}
  //         {mode === 'edit' && values.recipe && (
  //           <button
  //             disabled={isMutating}
  //             className="btn no-animation btn-xs max-w-xs  self-start rounded-[5px] text-left"
  //           >
  //             Recipe Used: {values.recipe.name}
  //           </button>
  //         )}

  //         {/* Recipe CTA */}
  //         {mode === 'add' && !values.recipe && values.forSale && (
  //           <button
  //             onClick={showRecipeList}
  //             disabled={isMutating}
  //             className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left"
  //           >
  //             Use a recipe
  //           </button>
  //         )}

  //         {mode === 'add' && values.recipe && (
  //           <button
  //             onClick={removeRecipe}
  //             disabled={isMutating}
  //             className="btn btn-primary btn-xs max-w-xs  self-start rounded-[5px] text-left"
  //           >
  //             Remove Recipe Used&nbsp;
  //             <XCircleIcon className="w-4" />
  //           </button>
  //         )}

  //         {/* Set Description CTA */}
  //         <button
  //           onClick={showDescription}
  //           disabled={isMutating}
  //           className="flex-start btn btn-ghost btn-xs w-full flex-shrink-0 flex-row flex-nowrap justify-between px-0"
  //         >
  //           <p className="text-overflow-ellipsis overflow-hidden truncate whitespace-nowrap break-words text-left">
  //             <span className="text-gray-400">
  //               {values.description === '' && 'Add Description'}
  //               {values.description}
  //             </span>
  //           </p>
  //           <ChevronRightIcon className="w-5 flex-shrink-0 text-secondary" />
  //         </button>
  //         {/* {values.recipe && (
  //           <div>
  //             <div className="flex w-full flex-row justify-between rounded-md bg-gray-200 p-2 py-1  ">
  //               <p className="font-bold">Cost:</p>
  //               <div className="flex flex-col">
  //                 <div className="flex flex-row">
  //                   <p className="font-bold">
  //                     {formatToPeso(values.recipe.cost)}
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         )} */}

  //         {visibility.currentCostLabel && (
  //           <div>
  //             <div className="flex w-full flex-row justify-between rounded-md bg-gray-200 p-2 py-1  ">
  //               <p className="font-bold">Cost:</p>
  //               <div className="flex flex-col">
  //                 <div className="flex flex-row">
  //                   <p className="font-bold">
  //                     {formatToPeso(values?.recipe?.cost ?? 0)}
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {mode === 'edit' && !values.forSale && (
  //           <div className="form-control flex w-full flex-row gap-2 ">
  //             <input
  //               {...getFieldProps('forSale')}
  //               autoComplete="off"
  //               type="checkbox"
  //               disabled
  //               checked={!values.forSale}
  //               onChange={async (e) => {
  //                 if (e.target.checked === true) {
  //                   await setFieldValue('price', undefined)
  //                   await setFieldValue('profitAmount', undefined)
  //                   await setFieldValue('profitPercentage', undefined)
  //                 } else {
  //                   await setShowTaxField(false)
  //                   await setFieldValue('applyTax', false)
  //                 }
  //               }}
  //               className="toggle toggle-primary"
  //             />
  //             <span>For ingredients purposes only</span>
  //           </div>
  //         )}

  //         {!values.recipe && (
  //           <>
  //             {/* For Sale */}
  //             {mode === 'add' && (
  //               <div className="form-control flex w-full flex-row gap-2 ">
  //                 <input
  //                   {...getFieldProps('forSale')}
  //                   autoComplete="off"
  //                   type="checkbox"
  //                   onChange={async (e) => {
  //                     await setFieldValue('forSale', !e.target.checked)
  //                     if (e.target.checked === true) {
  //                       await setFieldValue('price', undefined)
  //                       await setFieldValue('profitAmount', undefined)
  //                       await setFieldValue('profitPercentage', undefined)

  //                       // Set all cost to zero
  //                       const batches = cloneDeep(values.batches)
  //                       const updatedBatches = batches.map((batch) => {
  //                         return {
  //                           ...batch,
  //                           cost: 0,
  //                         }
  //                       })
  //                       await setFieldValue('batches', updatedBatches)
  //                     }
  //                   }}
  //                   checked={!values.forSale}
  //                   className="toggle toggle-primary"
  //                 />
  //                 <span>For ingredients purposes only</span>
  //               </div>
  //             )}

  //             {/* Cost per Unit */}
  //             {values.isBulkCost && (
  //               <div>
  //                 <div className=" w-full">
  //                   <span className="text-xs">{activeBatch?.name}</span>
  //                 </div>
  //                 <div className="mb-2 flex w-full flex-row justify-between rounded-md bg-gray-200 p-2 py-1 text-black ">
  //                   <p className="font-bold">Cost:</p>
  //                   <div className="flex flex-col">
  //                     <div className="flex flex-row">
  //                       <p className="font-bold">
  //                         {formatToPeso(
  //                           values?.isBulkCost
  //                             ? activeBatch.costPerUnit ?? 0
  //                             : activeBatch.cost,
  //                         )}
  //                       </p>
  //                       /
  //                       <p>
  //                         {' '}
  //                         {getActiveBatch(values.batches)?.unitOfMeasurement ??
  //                           0}
  //                       </p>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             )}

  //             {values.forSale && taxRate && (
  //               <div className="form-control flex flex-row gap-2 py-2">
  //                 <input
  //                   checked={showTaxField}
  //                   onChange={async (e) => {
  //                     setShowTaxField(e.target.checked)
  //                     await setFieldValue('applyTax', e.target.checked)
  //                   }}
  //                   autoComplete="off"
  //                   type="checkbox"
  //                   className="toggle toggle-primary"
  //                 />
  //                 <span>Apply Tax</span>
  //               </div>
  //             )}

  //             {/* Cost Input */}
  //             {showCostInput && (
  //               <label className="form-control">
  //                 <div className="">
  //                   <span className="label-text-alt text-gray-400">Cost</span>
  //                 </div>
  //                 <CurrencyInput
  //                   autoComplete="off"
  //                   decimalsLimit={4}
  //                   prefix="₱"
  //                   disabled={isMutating}
  //                   name={getFieldProps('cost').name}
  //                   value={values.overallCost}
  //                   type="text"
  //                   tabIndex={3}
  //                   className="input input-bordered w-full"
  //                   placeholder="₱0"
  //                   inputMode="decimal"
  //                   onValueChange={async (value) => {
  //                     await setFieldValue('overallCost', value)
  //                     const cost = toNumber(value)
  //                     if (values.price && values.price > 0) {
  //                       const price = toNumber(values.price)
  //                       const newProfitAmount = computeProfitAmount(price, cost)
  //                       const newProfitPercentage = computeProfitPercentage(
  //                         price,
  //                         cost,
  //                       )
  //                       await setFieldValue('profitAmount', newProfitAmount)
  //                       await setFieldValue(
  //                         'profitPercentage',
  //                         newProfitPercentage,
  //                       )
  //                     }

  //                     // Set the cost of all batches
  //                     const batches = cloneDeep(values.batches)
  //                     const updatedBatches = batches.map((batch) => {
  //                       return {
  //                         ...batch,
  //                         cost: toNumber(value),
  //                       }
  //                     })
  //                     await setFieldValue('batches', updatedBatches)
  //                     // TODO: Find out why cost to batches is overwritten to zero
  //                   }}
  //                 />
  //                 {errors.overallCost && (
  //                   <div className="label py-0">
  //                     <span className="label-text-alt text-xs text-red-400">
  //                       {errors.overallCost}
  //                     </span>
  //                   </div>
  //                 )}
  //               </label>
  //             )}

  //             {/* Profit */}
  //             {showPriceAndProfit && (
  //               <>
  //                 {/* Price*/}
  //                 <div className="flex w-full flex-row gap-2">
  //                   {/* Price Input */}
  //                   <label className="form-control ">
  //                     <div className="">
  //                       <span className="label-text-alt text-gray-400">
  //                         {showTaxField && tax?.type === 'exclusive'
  //                           ? 'Price Before Tax'
  //                           : 'Price'}
  //                       </span>
  //                     </div>
  //                     <CurrencyInput
  //                       autoComplete="off"
  //                       decimalsLimit={4}
  //                       prefix="₱"
  //                       disabled={isMutating}
  //                       onBlur={getFieldProps('price').onBlur}
  //                       name={getFieldProps('price').name}
  //                       value={values.price}
  //                       type="text"
  //                       tabIndex={2}
  //                       className="input input-bordered w-full"
  //                       placeholder="₱0"
  //                       inputMode="decimal"
  //                       onValueChange={async (value) => {
  //                         await setFieldValue('price', value)
  //                         const newPrice = toNumber(value)
  //                         const cost = computedCost
  //                         const newProfitAmount = computeProfitAmount(
  //                           newPrice,
  //                           cost,
  //                         )
  //                         const newProfitPercentage = computeProfitPercentage(
  //                           newPrice,
  //                           cost,
  //                         )
  //                         await setFieldValue(
  //                           'profitAmount',
  //                           toNumber(newProfitAmount),
  //                         )
  //                         await setFieldValue(
  //                           'profitPercentage',
  //                           toNumber(newProfitPercentage),
  //                         )
  //                       }}
  //                     />
  //                     {errors.price && (
  //                       <div className="label py-0">
  //                         <span className="label-text-alt text-xs text-red-400">
  //                           {errors.price}
  //                         </span>
  //                       </div>
  //                     )}
  //                   </label>
  //                 </div>

  //                 {/* Profit */}
  //                 <div className="form-control">
  //                   <div className="">
  //                     <span className="label-text-alt text-gray-400">
  //                       Profit
  //                     </span>
  //                   </div>
  //                   <div className="form-control input input-bordered relative flex flex-row items-center">
  //                     <CurrencyInput
  //                       autoComplete="off"
  //                       decimalsLimit={4}
  //                       disabled={isMutating}
  //                       onBlur={getFieldProps('profitPercentage').onBlur}
  //                       name={getFieldProps('profitPercentage').name}
  //                       value={values.profitPercentage}
  //                       placeholder="70"
  //                       type="text"
  //                       tabIndex={4}
  //                       disableGroupSeparators={true}
  //                       inputMode="decimal"
  //                       className={[
  //                         'input w-1/2 border-none bg-transparent px-0 text-left focus:outline-none',
  //                         profitPercentageColor(values.profitPercentage ?? 0),
  //                       ].join(' ')}
  //                       onValueChange={async (value) => {
  //                         await setFieldValue('profitPercentage', value)
  //                         const newProfitPercentage = toNumber(value)
  //                         const cost = computedCost
  //                         // const newPrice = cost * (1 + newProfitPercentage / 100)
  //                         const newPrice = new Big(cost)
  //                           .times(
  //                             new Big(1).plus(
  //                               new Big(newProfitPercentage).div(100),
  //                             ),
  //                           )
  //                           .toNumber()
  //                         const newProfitAmount = computeProfitAmount(
  //                           newPrice,
  //                           cost,
  //                         )

  //                         await setFieldValue('price', newPrice)
  //                         await setFieldValue('profitAmount', newProfitAmount)
  //                       }}
  //                     />
  //                     <p className="border-r-[1.5px] border-gray-300 px-2">%</p>
  //                     <CurrencyInput
  //                       autoComplete="off"
  //                       decimalsLimit={4}
  //                       prefix="₱"
  //                       disabled={isMutating}
  //                       onBlur={getFieldProps('profitAmount').onBlur}
  //                       name={getFieldProps('profitAmount').name}
  //                       value={values.profitAmount}
  //                       type="text"
  //                       tabIndex={5}
  //                       className={`input w-full border-none bg-transparent px-0 pl-2 focus:outline-none`}
  //                       placeholder="₱0"
  //                       inputMode="decimal"
  //                       onValueChange={async (value) => {
  //                         await setFieldValue('profitAmount', value)
  //                         const newProfitAmount = toNumber(value)
  //                         const cost = computedCost

  //                         // const newPrice = cost + newProfitAmount
  //                         const newPrice = new Big(cost)
  //                           .plus(new Big(newProfitAmount))
  //                           .toNumber()
  //                         const newProfitPercentage = computeProfitPercentage(
  //                           newPrice,
  //                           cost,
  //                         )

  //                         await setFieldValue('price', newPrice)
  //                         await setFieldValue(
  //                           'profitPercentage',
  //                           newProfitPercentage,
  //                         )
  //                       }}
  //                     />
  //                   </div>
  //                   {errors.profitAmount && (
  //                     <div className="label py-0">
  //                       <span className="label-text-alt text-xs text-red-400">
  //                         {errors.profitAmount}
  //                       </span>
  //                     </div>
  //                   )}
  //                 </div>

  //                 {/* After Tax */}
  //                 {showTaxField && tax?.type === 'exclusive' && (
  //                   <div className="flex w-full flex-row gap-2">
  //                     <label className="form-control ">
  //                       <div className="  ">
  //                         <span className="label-text-alt text-gray-400">
  //                           After Tax Price ({taxRate}%)
  //                         </span>
  //                       </div>
  //                       <input
  //                         className="input input-bordered disabled:border-base-content/20 disabled:bg-transparent disabled:font-bold disabled:text-primary"
  //                         disabled
  //                         value={formatToPeso(afterTaxPrice)}
  //                       />
  //                     </label>
  //                   </div>
  //                 )}
  //               </>
  //             )}
  //           </>
  //         )}

  //         {values.recipe && (
  //           <>
  //             <div className="form-control flex flex-row gap-2 py-2">
  //               <input
  //                 // {...getFieldProps('forSale')}
  //                 checked={showTaxField}
  //                 onChange={async (e) => {
  //                   setShowTaxField(e.target.checked)
  //                   await setFieldValue('applyTax', e.target.checked)
  //                 }}
  //                 autoComplete="off"
  //                 type="checkbox"
  //                 className="toggle toggle-primary"
  //               />
  //               <span>Apply Tax</span>
  //             </div>
  //             {/* Price*/}
  //             <div className="flex w-full flex-row gap-2">
  //               {/* Price Input */}
  //               <label className="form-control ">
  //                 <div className="">
  //                   <span className="label-text-alt text-gray-400">
  //                     {showTaxField ? 'Price After Tax' : 'Price'}
  //                   </span>
  //                 </div>
  //                 <CurrencyInput
  //                   autoComplete="off"
  //                   decimalsLimit={4}
  //                   prefix="₱"
  //                   disabled={isMutating}
  //                   onBlur={getFieldProps('price').onBlur}
  //                   name={getFieldProps('price').name}
  //                   value={values.price}
  //                   type="text"
  //                   tabIndex={2}
  //                   className="input input-bordered w-full"
  //                   placeholder="₱0"
  //                   inputMode="decimal"
  //                   onValueChange={async (value) => {
  //                     await setFieldValue('price', value)
  //                     const newPrice = toNumber(value)
  //                     const cost = computedCost
  //                     const newProfitAmount = computeProfitAmount(
  //                       newPrice,
  //                       cost,
  //                     )
  //                     const newProfitPercentage = computeProfitPercentage(
  //                       newPrice,
  //                       cost,
  //                     )
  //                     await setFieldValue(
  //                       'profitAmount',
  //                       toNumber(newProfitAmount),
  //                     )
  //                     await setFieldValue(
  //                       'profitPercentage',
  //                       toNumber(newProfitPercentage),
  //                     )
  //                     if (values.recipe) {
  //                       await setFieldValue(
  //                         'batches.0.cost',
  //                         values.recipe.cost,
  //                       )
  //                     }
  //                   }}
  //                 />
  //                 {errors.price && (
  //                   <div className="label py-0">
  //                     <span className="label-text-alt text-xs text-red-400">
  //                       {errors.price}
  //                     </span>
  //                   </div>
  //                 )}
  //               </label>
  //             </div>

  //             {/* Profit */}
  //             <div className="form-control">
  //               <div className="">
  //                 <span className="label-text-alt text-gray-400">Profit</span>
  //               </div>
  //               <div className="form-control input input-bordered relative flex flex-row items-center">
  //                 <CurrencyInput
  //                   autoComplete="off"
  //                   decimalsLimit={4}
  //                   disabled={isMutating}
  //                   onBlur={getFieldProps('profitPercentage').onBlur}
  //                   name={getFieldProps('profitPercentage').name}
  //                   value={values.profitPercentage}
  //                   placeholder="70"
  //                   type="text"
  //                   tabIndex={4}
  //                   disableGroupSeparators={true}
  //                   inputMode="decimal"
  //                   className={[
  //                     'input w-1/2 border-none bg-transparent px-0 text-left focus:outline-none',
  //                     profitPercentageColor(values.profitPercentage ?? 0),
  //                   ].join(' ')}
  //                   onValueChange={async (value) => {
  //                     await setFieldValue('profitPercentage', value)
  //                     const newProfitPercentage = toNumber(value)
  //                     const cost = computedCost
  //                     // const newPrice = cost * (1 + newProfitPercentage / 100)
  //                     const newPrice = new Big(cost)
  //                       .times(
  //                         new Big(1).plus(
  //                           new Big(newProfitPercentage).div(100),
  //                         ),
  //                       )
  //                       .toNumber()
  //                     const newProfitAmount = computeProfitAmount(
  //                       newPrice,
  //                       cost,
  //                     )

  //                     await setFieldValue('price', newPrice)
  //                     await setFieldValue('profitAmount', newProfitAmount)
  //                     if (values.recipe) {
  //                       await setFieldValue(
  //                         'batches.0.cost',
  //                         values.recipe.cost,
  //                       )
  //                     }
  //                   }}
  //                 />
  //                 <p className="border-r-[1.5px] border-gray-300 px-2">%</p>
  //                 <CurrencyInput
  //                   autoComplete="off"
  //                   decimalsLimit={4}
  //                   prefix="₱"
  //                   disabled={isMutating}
  //                   onBlur={getFieldProps('profitAmount').onBlur}
  //                   name={getFieldProps('profitAmount').name}
  //                   value={values.profitAmount}
  //                   type="text"
  //                   tabIndex={5}
  //                   className={`input w-full border-none bg-transparent px-0 pl-2 focus:outline-none`}
  //                   placeholder="₱0"
  //                   inputMode="decimal"
  //                   onValueChange={async (value) => {
  //                     await setFieldValue('profitAmount', value)
  //                     const newProfitAmount = toNumber(value)
  //                     const cost = computedCost

  //                     // const newPrice = cost + newProfitAmount
  //                     const newPrice = new Big(cost)
  //                       .plus(new Big(newProfitAmount))
  //                       .toNumber()
  //                     const newProfitPercentage = computeProfitPercentage(
  //                       newPrice,
  //                       cost,
  //                     )

  //                     await setFieldValue('price', newPrice)
  //                     await setFieldValue(
  //                       'profitPercentage',
  //                       newProfitPercentage,
  //                     )
  //                     if (values.recipe) {
  //                       await setFieldValue(
  //                         'batches.0.cost',
  //                         values.recipe.cost,
  //                       )
  //                     }
  //                   }}
  //                 />
  //               </div>
  //               {errors.profitAmount && (
  //                 <div className="label py-0">
  //                   <span className="label-text-alt text-xs text-red-400">
  //                     {errors.profitAmount}
  //                   </span>
  //                 </div>
  //               )}
  //             </div>

  //             {/* After Tax */}
  //             {showTaxField && tax?.type === 'exclusive' && (
  //               <div className="flex w-full flex-row gap-2">
  //                 <label className="form-control ">
  //                   <div className="">
  //                     <span className="label-text-alt text-gray-400">
  //                       After Tax Price ({taxRate}%)
  //                     </span>
  //                   </div>
  //                   <input
  //                     className="input input-bordered"
  //                     disabled
  //                     value={formatToPeso(afterTaxPrice)}
  //                   />
  //                 </label>
  //               </div>
  //             )}
  //           </>
  //         )}

  //         {/* Category */}
  //         <label className="form-control w-full ">
  //           <div className=" ">
  //             <span className="label-text-alt text-gray-400">Category</span>
  //           </div>
  //           <CategoryDropdown
  //             value={values.category}
  //             onChange={(option) => {
  //               setFieldValue('category', option?.value ?? '')
  //             }}
  //           />

  //           {errors.category && (
  //             <div className="label py-0">
  //               <span className="label-text-alt text-xs text-red-400">
  //                 {errors.category}
  //               </span>
  //             </div>
  //           )}
  //         </label>

  //         {/* Images */}
  //         <ProductImages
  //           disabled={isMutating}
  //           onImagesChange={(images) => {
  //             setFieldValue('images', images)
  //           }}
  //           images={values.images ?? []}
  //         />
  //         {/* Low Stock warning */}
  //         <label className="form-control w-full ">
  //           <div className="z-[09] ">
  //             <span className="label-text-alt text-gray-400">
  //               Low stock warning level
  //             </span>
  //           </div>
  //           <div className="join w-full">
  //             <CurrencyInput
  //               autoComplete="off"
  //               decimalsLimit={4}
  //               disabled={isMutating}
  //               onBlur={getFieldProps('stockWarning').onBlur}
  //               name={getFieldProps('stockWarning').name}
  //               value={values.stockWarning}
  //               type="text"
  //               className="input join-item input-bordered w-full"
  //               inputMode="decimal"
  //               placeholder="Quantity (Optional)"
  //               onValueChange={(value) => {
  //                 setFieldValue('stockWarning', value)
  //               }}
  //             />
  //             <div className="indicator">
  //               <button className="btn join-item no-animation">
  //                 {unitAbbrevationsToLabel(unitOfMeasurement)}
  //               </button>
  //             </div>
  //           </div>
  //         </label>

  //         {/* Back order toggle */}
  //         <div className="form-control flex w-full flex-row gap-2 py-2">
  //           <input
  //             {...getFieldProps('allowBackOrder')}
  //             autoComplete="off"
  //             checked={values.allowBackOrder}
  //             type="checkbox"
  //             className="toggle toggle-primary"
  //           />
  //           <span>Allow selling when out of stock</span>
  //         </div>

  //         {!values.recipe && (
  //           <>
  //             {/* Sell by */}
  //             <p>Use/Sell By:</p>
  //             <div className="bg-gray-100  p-2">
  //               <div className="form-control ">
  //                 <label className="label cursor-pointer justify-start gap-4">
  //                   <input
  //                     {...getFieldProps('soldBy')}
  //                     autoComplete="off"
  //                     type="radio"
  //                     className="radio-primary radio"
  //                     name="soldBy"
  //                     value={ProductSoldBy.Pieces}
  //                     checked={values.soldBy === ProductSoldBy.Pieces}
  //                     disabled={mode === 'edit'}
  //                     onChange={(e) => {
  //                       setFieldValue('soldBy', e.target.value)
  //                       if (e.target.checked) {
  //                         setFieldValue(
  //                           'batches',
  //                           values.batches.map((batch) => {
  //                             return {
  //                               ...batch,
  //                               unitOfMeasurement: 'pieces',
  //                             }
  //                           }),
  //                         )
  //                       }
  //                     }}
  //                   />
  //                   <span className="label-text">Pieces</span>
  //                 </label>
  //               </div>
  //               <div className="form-control">
  //                 <label className="label cursor-pointer justify-start gap-4">
  //                   <input
  //                     {...getFieldProps('soldBy')}
  //                     autoComplete="off"
  //                     type="radio"
  //                     className="radio-primary radio"
  //                     name="soldBy"
  //                     value={ProductSoldBy.Weight}
  //                     checked={values.soldBy === ProductSoldBy.Weight}
  //                     disabled={mode === 'edit'}
  //                     onChange={(e) => {
  //                       setFieldValue('soldBy', e.target.value)
  //                       setUnitOfMeasurement('g')
  //                       if (e.target.checked) {
  //                         setFieldValue(
  //                           'batches',
  //                           values.batches.map((batch) => {
  //                             return {
  //                               ...batch,
  //                               unitOfMeasurement: 'g',
  //                             }
  //                           }),
  //                         )
  //                       }
  //                     }}
  //                   />
  //                   <span className="label-text">Weight</span>
  //                 </label>
  //               </div>
  //               {/* Unit of measurement */}
  //               {values.soldBy === 'weight' && (
  //                 <label className="form-control w-full ">
  //                   <div className="">
  //                     <span className="label-text-alt ">
  //                       Unit of Measurement
  //                     </span>
  //                   </div>
  //                   <MeasurementSelect
  //                     disabled={mode === 'edit'}
  //                     value={{
  //                       label:
  //                         measurementOptions.find(
  //                           (option) => option.value === unitOfMeasurement,
  //                         )?.label || '',
  //                       value: unitOfMeasurement,
  //                     }}
  //                     onChange={(value) => {
  //                       if (!value) {
  //                         return
  //                       }
  //                       setUnitOfMeasurement(value?.value)
  //                       setFieldValue(
  //                         'batches',
  //                         values.batches.map((batch) => {
  //                           return {
  //                             ...batch,
  //                             unitOfMeasurement: value?.value,
  //                           }
  //                         }),
  //                       )
  //                     }}
  //                   />
  //                 </label>
  //               )}
  //             </div>

  //             {/* Bulk Cost Toggle */}
  //             <div className="flex w-full flex-row items-center justify-between">
  //               <p className="flex-grow">Stock:</p>

  //               <div className="form-control ml-auto flex w-auto flex-row gap-2 ">
  //                 <span>Bulk Cost</span>
  //                 <div className="flex flex-row gap-2">
  //                   <input
  //                     {...getFieldProps('isBulkCost')}
  //                     autoComplete="off"
  //                     checked={values.isBulkCost}
  //                     disabled={mode === 'edit'}
  //                     onChange={(e) => {
  //                       setFieldValue('isBulkCost', e.target.checked)
  //                       if (e.target.checked) {
  //                         setFieldValue(
  //                           'batches',
  //                           values.batches.map((batch) => {
  //                             return {
  //                               ...batch,
  //                               cost: 0,
  //                               costPerUnit: 0,
  //                             }
  //                           }),
  //                         )
  //                       }
  //                     }}
  //                     type="checkbox"
  //                     className="toggle toggle-primary"
  //                   />
  //                   <InformationCircleIcon className="w-5 text-neutral" />
  //                 </div>
  //               </div>
  //             </div>

  //             {/* No Active Batch Warning */}
  //             {!activeBatch && (
  //               <div className="mt-4 text-center text-gray-400">
  //                 No batch available for use. Please add a batch to continue.
  //               </div>
  //             )}

  //             {/* Active Batch */}
  //             {mode === 'edit' &&
  //               activeBatch &&
  //               [activeBatch].map((batch, index) => {
  //                 const disabled =
  //                   mode === 'edit' &&
  //                   // Check if the batch is already in the initial form values
  //                   initialFormValues.batches.findIndex(
  //                     (b) => b.id === batch.id,
  //                   ) >= 0
  //                 return (
  //                   <motion.div
  //                     key={`y-${batch.id}`}
  //                     initial={{ backgroundColor: '#856AD4', opacity: 0.5 }}
  //                     animate={{ background: '#FFF', opacity: 1 }}
  //                     transition={{ ease: 'easeInOut', duration: 0.4 }}
  //                   >
  //                     <BatchCard
  //                       productId={product?.id}
  //                       disabled={disabled}
  //                       active={true}
  //                       onRemove={async (batchId) => {
  //                         if (!disabled) {
  //                           const newBatches = [...values.batches]
  //                           const updatedBatches = newBatches.filter(
  //                             (batch) => batch.id !== batchId,
  //                           )
  //                           await setFieldValue('batches', updatedBatches)
  //                         }
  //                       }}
  //                       onChange={updateBatch}
  //                       error={
  //                         errors.batches &&
  //                         (errors.batches[
  //                           values.batches.findIndex((b) => b.id === batch.id)
  //                         ] as never)
  //                       }
  //                       batch={batch}
  //                       key={index}
  //                       soldBy={values.soldBy}
  //                       isBulkCost={values.isBulkCost}
  //                       forSale={values.forSale}
  //                     />
  //                   </motion.div>
  //                 )
  //               })}

  //             {/* Non active batches */}
  //             {mode === 'edit' && (
  //               <div
  //                 className={`collapse collapse-arrow rounded-sm bg-base-100 ${
  //                   showMore ? 'collapse-open' : 'collapse-close'
  //                 }`}
  //               >
  //                 <div
  //                   onClick={() => setShowMore(!showMore)}
  //                   className="collapse-title mx-auto w-[160px] px-0 text-center"
  //                 >
  //                   Show {showMore ? 'Less' : 'More'}
  //                 </div>
  //                 <div className="BatchesContainer collapse-content space-y-4 p-0">
  //                   {nonActiveBatches.length === 0 && (
  //                     <div>
  //                       <p className="text-center text-gray-400">
  //                         No additional batches to show
  //                       </p>
  //                     </div>
  //                   )}
  //                   {nonActiveBatches.map((batch) => {
  //                     const disabled =
  //                       mode === 'edit' &&
  //                       // Check if the batch is already in the initial form values
  //                       initialFormValues.batches.findIndex(
  //                         (b) => b.id === batch.id,
  //                       ) >= 0
  //                     return (
  //                       <BatchCard
  //                         productId={product?.id}
  //                         disabled={disabled}
  //                         key={batch.id}
  //                         mode={mode}
  //                         onRemove={async (batchId) => {
  //                           if (!disabled) {
  //                             const newBatches = [...values.batches]
  //                             const updatedBatches = newBatches.filter(
  //                               (batch) => batch.id !== batchId,
  //                             )
  //                             await setFieldValue('batches', updatedBatches)
  //                           }
  //                         }}
  //                         onChange={updateBatch}
  //                         error={
  //                           errors.batches &&
  //                           (errors.batches[
  //                             values.batches.findIndex((b) => b.id === batch.id)
  //                           ] as never)
  //                         }
  //                         batch={batch}
  //                         soldBy={values.soldBy}
  //                         isBulkCost={values.isBulkCost}
  //                         forSale={values.forSale}
  //                       />
  //                     )
  //                   })}
  //                 </div>
  //               </div>
  //             )}

  //             {/* Add Batch */}
  //             {mode === 'add' && (
  //               <div className="BatchesContainer space-y-4 p-0">
  //                 {values.batches.length === 0 && (
  //                   <div>
  //                     <p className="text-center text-gray-400">
  //                       No additional batches to show
  //                     </p>
  //                   </div>
  //                 )}
  //                 {values.batches.map((batch) => {
  //                   return (
  //                     <BatchCard
  //                       productId={product?.id}
  //                       key={batch.id}
  //                       mode={mode}
  //                       onRemove={async (batchId) => {
  //                         const newBatches = [...values.batches]
  //                         const updatedBatches = newBatches.filter(
  //                           (batch) => batch.id !== batchId,
  //                         )
  //                         await setFieldValue('batches', updatedBatches)
  //                       }}
  //                       onChange={updateBatch}
  //                       error={
  //                         errors.batches &&
  //                         (errors.batches[
  //                           values.batches.findIndex((b) => b.id === batch.id)
  //                         ] as never)
  //                       }
  //                       batch={batch}
  //                       soldBy={values.soldBy}
  //                       isBulkCost={values.isBulkCost}
  //                       forSale={values.forSale}
  //                     />
  //                   )
  //                 })}
  //               </div>
  //             )}

  //             <button
  //               onClick={addNewBatch}
  //               id="add-batch-button"
  //               className="flex-start btn btn-outline btn-primary btn-md w-full flex-shrink-0 flex-row flex-nowrap  "
  //             >
  //               <PlusIcon className="w-5 flex-shrink-0 " />

  //               <div className="flex flex-row items-center gap-2">
  //                 <p className="">New Batch</p>
  //               </div>
  //             </button>
  //           </>
  //         )}

  //         {values.recipe && (
  //           <div className="RecipeDetail flex flex-col gap-4 rounded-md bg-gray-200 p-4">
  //             <div className="flex flex-row items-center justify-start gap-4">
  //               Quantity
  //               <button className="btn no-animation w-auto flex-grow">
  //                 {values.recipe.quantity}
  //               </button>
  //             </div>
  //             <div className="grid grid-cols-12 gap-2">
  //               {values.recipe.materials.map((material, index) => {
  //                 const { name } = material.product
  //                 let totalQuantity = material.product.totalQuantity
  //                 if (
  //                   material.product.outOfStock &&
  //                   material.product.allowBackOrder
  //                 ) {
  //                   totalQuantity = material.product.batches.reduce(
  //                     (acc, batch) => acc + batch.quantity,
  //                     0,
  //                   )
  //                 }
  //                 const image = material.product.images?.[0]
  //                 const productMeasurement =
  //                   material.product.soldBy === ProductSoldBy.Weight
  //                     ? material.product.activeBatch?.unitOfMeasurement
  //                     : ''
  //                 const materialMeasurement =
  //                   material.product.soldBy === ProductSoldBy.Weight
  //                     ? material.unitOfMeasurement
  //                     : ''
  //                 return (
  //                   <div key={index} className="col-span-3 flex flex-col gap-2">
  //                     {/* {image && <image className="h-6 w-6" src={image} />} */}
  //                     {image && (
  //                       <img className="mx-auto h-10 w-10" src={image} />
  //                     )}
  //                     {!image && (
  //                       <div className="mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-md bg-gray-300">
  //                         <PhotoIcon className="w-3" />
  //                       </div>
  //                     )}
  //                     <p className="text-center text-xs font-bold ">{name}</p>
  //                     <p className="text-center text-xs">
  //                       {totalQuantity}
  //                       {productMeasurement}/{material.quantity}
  //                       {materialMeasurement}
  //                     </p>
  //                   </div>
  //                 )
  //               })}
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     <AnimatePresence>
  //       <SlidingTransition isVisible={activeScreen === Screen.Description}>
  //         <Description
  //           description={values.description}
  //           onBack={() => setActiveScreen(null)}
  //           onComplete={(desription) => {
  //             setFieldValue('description', desription)
  //           }}
  //         />
  //       </SlidingTransition>
  //       <SlidingTransition isVisible={activeScreen === Screen.SelectRecipe}>
  //         <RecipeList
  //           onBack={() => setActiveScreen(null)}
  //           onRecipeSelect={onRecipeSelect}
  //         />
  //       </SlidingTransition>
  //     </AnimatePresence>
  //   </>
  // )

  return <div>product detail</div>
}

// const BatchSchema = ProductBatchSchema.partial({ id: true })

// const productSchema = yup.object().shape({
//   name: yup.string().required('Name is required'),
//   description: yup.string().optional(),
//   forSale: yup.boolean().required(),
//   applyTax: yup
//     .boolean()
//     .when('taxRateExists', (taxRateExists, schema) =>
//       taxRateExists ? schema.required() : schema.notRequired().default(false),
//     ),

//   // UI ONLY
//   currentCostPerUnit: yup
//     .number()
//     .when('bulkCost', (bulkCost, schema) =>
//       bulkCost ? schema.required().positive() : schema.notRequired(),
//     ),
//   currentCost: yup
//     .number()
//     .when(['forSale', 'recipe', 'bulkCost'], (values, schema) => {
//       const [forSale, recipe, bulkCost] = values
//       return forSale && !recipe && !bulkCost
//         ? schema.required().positive()
//         : schema.notRequired()
//     }),
//   price: yup
//     .number()
//     .when('forSale', (forSale, schema) =>
//       forSale ? schema.required().positive() : schema.notRequired(),
//     ),
//   profitAmount: yup
//     .number()
//     .when('forSale', (forSale, schema) =>
//       forSale ? schema.required().positive() : schema.notRequired(),
//     ),
//   profitPercentage: yup
//     .number()
//     .when('forSale', (forSale, schema) =>
//       forSale ? schema.required().positive() : schema.notRequired(),
//     ),
//   bulkCost: yup.boolean().required(),

//   recipe: yup.mixed().notRequired(),
//   category: yup.string().optional(),
//   images: yup.array().of(yup.mixed()).optional(),
//   stockWarning: yup.number().positive().optional(),
//   allowBackOrder: yup.boolean().required(),
//   soldBy: yup.string().required(),
//   overAllUnitOfMeasurement: yup.string().when('soldBy', {
//     is: (value: string) => (value === 'weight' ? true : false),
//     then: (schema) => schema.required(),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   batches: yup
//     .array()
//     .of(
//       yup.object().shape({
//         name: yup.string().required(),
//         cost: yup.number().positive().required(),
//         costPerUnit: yup
//           .number()
//           .when(['$bulkCost'], (bulkCost, schema) =>
//             bulkCost ? schema.required().positive() : schema.notRequired(),
//           ),
//         unitOfMeasurement: yup.string().required(),
//         quantity: yup.number().positive().required(),
//         expirationDate: yup.date().optional(),
//       }),
//     )
//     .min(1, 'At least one batch is required'),
// })

export default ProductDetail
