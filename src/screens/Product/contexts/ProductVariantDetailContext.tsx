// ProductVariantDetailContext.tsx
import React, { createContext, useContext, useReducer } from 'react'
import { ProductVariant } from 'types/product.types'

// Define the state and actions for the context
interface VariantState {
  variant: ProductVariant
}

const initialVariantState: VariantState = {
  variant: {
    id: '',
    name: '',
    price: 0,
    cost: 0,
    profit: 0,
    images: [],
    description: '',
    quantity: 0,
    allowBackOrder: true,
    category: '',
    expiryDate: undefined,
    measurement: '',
    variantOptions: [],
  },
}

export enum VariantActionType {
  UpdateVariant = 'UPDATE_VARIANT',
}

type VariantAction = {
  type: VariantActionType.UpdateVariant
  payload: ProductVariant
}

function variantReducer(
  state: VariantState,
  action: VariantAction,
): VariantState {
  switch (action.type) {
    case VariantActionType.UpdateVariant:
      return { ...state, variant: action.payload }
    default:
      return state
  }
}

const ProductVariantDetail = createContext<{
  state: VariantState
  dispatch: React.Dispatch<VariantAction>
}>({
  state: initialVariantState,
  dispatch: () => {},
})

export const useProductVariantDetail = () => useContext(ProductVariantDetail)

// Define the provider component
interface ProductVariantDetailProviderProps {
  children: React.ReactNode
  initialVariant: ProductVariant
}

export const ProductVariantDetailProvider: React.FC<
  ProductVariantDetailProviderProps
> = ({ children, initialVariant }) => {
  // const { dispatch: productDetailDispatch } = useProductDetail()

  const [state, dispatch] = useReducer(variantReducer, {
    ...initialVariantState,
    variant: initialVariant,
  })

  // Wrapped dispatch function that also updates the ProductDetailContext
  // const wrappedDispatch = (action: VariantAction) => {
  //   dispatch(action)

  //   if (action.type === VariantActionType.UpdateVariant) {
  //     // Assuming you have a way to find the index of the variant
  //     const variantIndex = 1 /* logic to find variantIndex */
  //     productDetailDispatch({
  //       type: ProductDetailActionType.UpdateProductVariant,
  //       payload: { variantIndex, updatedVariant: action.payload },
  //     })
  //   }
  // }
  return (
    <ProductVariantDetail.Provider value={{ state, dispatch }}>
      {children}
    </ProductVariantDetail.Provider>
  )
}
