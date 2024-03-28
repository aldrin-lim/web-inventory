import { v4 } from 'uuid'
import { StateCreator } from 'zustand'
import { produce } from 'immer'
import { RecipeFormSlice, StoreState } from './slices.types'

const createRecipeFormSlice: StateCreator<
  StoreState,
  [],
  [],
  RecipeFormSlice
> = (set) => ({
  recipeFormInitialValue: {
    id: v4(),
    name: '',
    description: '',
    cost: 0,
    images: [],
    price: 0,
    profitAmount: 0,
    profitPercentage: 0,
    profit: 0,
    quantity: 0,
    materials: [],
    ingredients: [],
    others: [],
  },
  recipeFormValue: {
    id: v4(),
    name: '',
    description: '',
    cost: 0,
    images: [],
    price: 0,
    profitAmount: 0,
    profitPercentage: 0,
    profit: 0,
    quantity: 0,
    materials: [],
    ingredients: [],
    others: [],
  },
  setRecipeFormValue: (value) =>
    set(
      produce((state: RecipeFormSlice) => {
        state.recipeFormValue = value
      }),
    ),
  setRecipeFormFieldValue: (field: string, value: unknown) =>
    set(
      produce((state) => {
        state.recipeFormValue[field] = value
      }),
    ),
  setRecipeInitialValue: (value) =>
    set(
      produce((state: RecipeFormSlice) => {
        state.recipeFormInitialValue = value
      }),
    ),
  resetRecipeForm: () =>
    set(
      produce((state) => {
        const initialValue = {
          id: v4(),
          name: '',
          description: '',
          cost: 0,
          images: [],
          price: 0,
          profitAmount: 0,
          profitPercentage: 0,
          profit: 0,
          quantity: 0,
          materials: [],
          ingredients: [],
          others: [],
        }
        state.recipeFormValue = initialValue
        state.recipeFormInitialValue = initialValue
      }),
    ),
})

export default createRecipeFormSlice
