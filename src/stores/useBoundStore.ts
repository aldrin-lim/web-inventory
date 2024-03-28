import createProductFormSlice from 'slices/productFormSlice'
import createRecipeFormSlice from 'slices/recipeFormSlice'
import { StoreState } from 'slices/slices.types'
import { create } from 'zustand'

const useBoundStore = create<StoreState>((...a) => ({
  ...createProductFormSlice(...a),
  ...createRecipeFormSlice(...a),
}))

export default useBoundStore
