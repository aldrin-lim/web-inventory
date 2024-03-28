import { MaterialSchema } from 'types/product.types'
import { v4 } from 'uuid'
import { z } from 'zod'
import { create } from 'zustand'
import { produce } from 'immer'

type State = {
  recipeForm: {
    initialValue: RecipeFormValues
    formValue: RecipeFormValues
  }

  setRecipeInitialValue: (value: RecipeFormValues) => void

  setRecipeFormValue: (value: RecipeFormValues) => void

  setRecipeFormFieldValue: (field: string, value: unknown) => void
  resetRecipeForm: () => void
}

const useRecipeFormValue = create<State>((set) => ({
  recipeForm: {
    initialValue: {
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
    formValue: {
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
  },
  setRecipeFormValue: (value) =>
    set(
      produce((state) => {
        state.recipeForm.formValue = value
      }),
    ),
  setRecipeFormFieldValue: (field: string, value: unknown) =>
    set(
      produce((state) => {
        state.recipeForm.formValue[field] = value
      }),
    ),
  setRecipeInitialValue: (value) =>
    set(
      produce((state) => {
        state.recipeForm.initialValue = value
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
        state.recipeForm.initialValue = initialValue
        state.recipeForm.formValue = initialValue
      }),
    ),
}))

export default useRecipeFormValue

export type RecipeFormValues = z.infer<typeof UISchema>

const UISchema = z.object({
  id: z.string({
    required_error: 'Recipe is required',
  }),
  cost: z.number({
    coerce: true,
    required_error: 'Recipe Cost is required',
  }),
  images: z.array(z.string()),
  quantity: z.number(),
  name: z.string({
    required_error: 'Recipe Name is required',
  }),
  materials: z.array(MaterialSchema),
  ingredients: z.array(MaterialSchema),
  others: z.array(MaterialSchema),
})
