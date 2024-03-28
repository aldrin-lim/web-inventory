import { PIECES } from 'constants copy/measurement'
import { ProductSoldBy } from 'types/product.types'
import { padWithZeros } from 'util/number'
import { v4 } from 'uuid'
import { StateCreator } from 'zustand'
import { produce } from 'immer'
import { ProductFormSlice, StoreState } from './slices.types'

const createProductFormSlice: StateCreator<
  StoreState,
  [],
  [],
  ProductFormSlice
> = (set) => ({
  productFormInitialValue: {
    id: v4(),
    name: '',
    mode: 'add',
    description: '',
    currentCost: '',
    overAllMeasurement: PIECES,
    price: '',
    profitAmount: '',
    profitPercentage: '',
    images: [],
    category: '',
    isBulkCost: false,
    soldBy: ProductSoldBy.Pieces,
    isIngredient: false,
    allowBackOrder: false,
    applyTax: false,
    stockWarning: '',
    batches: [
      {
        id: v4(),
        name: `Batch #${padWithZeros(1)}`,
        cost: '',
        costPerUnit: 0,
        quantity: '',
        unitOfMeasurement: '',
        isDeducted: false,
        expirationDate: null,
      },
    ],
    recipe: undefined,
  },
  productFormValue: {
    id: v4(),
    name: '',
    mode: 'add',
    description: '',
    currentCost: '',
    overAllMeasurement: PIECES,
    price: '',
    profitAmount: '',
    profitPercentage: '',
    images: [],
    category: '',
    isBulkCost: false,
    soldBy: ProductSoldBy.Pieces,
    isIngredient: false,
    allowBackOrder: false,
    applyTax: false,
    stockWarning: '',
    batches: [
      {
        id: v4(),
        name: `Batch #${padWithZeros(1)}`,
        cost: '',
        costPerUnit: 0,
        quantity: '',
        unitOfMeasurement: '',
        isDeducted: false,
        expirationDate: null,
      },
    ],
    recipe: undefined,
  },
  setProductFormValue: (value) =>
    set(
      produce((state: ProductFormSlice) => {
        state.productFormValue = value
      }),
    ),
  setProductFormFieldValue: (field: string, value: unknown) =>
    set(
      produce((state) => {
        state.productFormValue[field] = value
      }),
    ),
  setProdutctFormInitialValue: (value) =>
    set(
      produce((state: ProductFormSlice) => {
        state.productFormInitialValue = value
      }),
    ),
  resetProductForm: () =>
    set(
      produce((state) => {
        const initialValue = {
          id: v4(),
          name: '',
          mode: 'add',
          description: '',
          currentCost: '',
          overAllMeasurement: PIECES,
          price: '',
          profitAmount: '',
          profitPercentage: '',
          images: [],
          category: '',
          isBulkCost: false,
          soldBy: ProductSoldBy.Pieces,
          isIngredient: false,
          allowBackOrder: false,
          applyTax: false,
          stockWarning: '',
          batches: [
            {
              id: v4(),
              name: `Batch #${padWithZeros(1)}`,
              cost: '',
              costPerUnit: 0,
              quantity: '',
              unitOfMeasurement: '',
              isDeducted: false,
              expirationDate: null,
            },
          ],
          recipe: undefined,
        }
        state.productFormInitialValue = initialValue
        state.productFormValue = initialValue
      }),
    ),
})

export default createProductFormSlice
