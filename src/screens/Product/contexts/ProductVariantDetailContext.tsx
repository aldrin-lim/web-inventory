// ProductDetail.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import {
  Product,
  ProductVariant,
  ProductVariantAttribute,
} from 'types/product.types'

export enum ProductVariantDetailActionModal {
  None = '',
  Detail = 'detail',
  Description = 'description',
  Variants = 'variants',
}

export enum ProductVariantDetailActionType {
  SetActiveModal = 'SET_ACTIVE_MODAL',
  UpdateProductDetail = 'UPDATE_PRODUCT_DETAIL',
  UpdateVariantAttribute = 'UPDATE_VARIANT_ATTRIBUTE',
  AddVariantAttribute = 'ADD_VARIANT_ATTRIBUTE',
  RemoveVariantAttribute = 'REMOVE_VARIANT_ATTRIBUTE',
  UpdateProductVariant = 'UPDATE_PRODUCT_VARIANT',
}

interface State {
  activeModal: ProductVariantDetailActionModal
  productDetails: ProductVariant
  mode: 'add' | 'edit'
}

const initialState: State = {
  activeModal: ProductVariantDetailActionModal.None,
  productDetails: {
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
  mode: 'add',
}

type Action =
  | {
      type: ProductVariantDetailActionType.SetActiveModal
      payload: ProductVariantDetailActionModal
    }
  | {
      type: ProductVariantDetailActionType.UpdateProductDetail
      payload: { field: keyof Product; value: unknown }
    }
  | {
      type: ProductVariantDetailActionType.UpdateVariantAttribute
      payload: Array<ProductVariantAttribute> // index of the variant attribute to remove
    }
  | {
      type: ProductVariantDetailActionType.AddVariantAttribute
      payload: ProductVariantAttribute
    }
  | {
      type: ProductVariantDetailActionType.RemoveVariantAttribute
      payload: number // index of the variant attribute to remove
    }
  | {
      type: ProductVariantDetailActionType.UpdateProductVariant
      payload: { variantIndex: number; updatedVariant: ProductVariant }
    }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ProductVariantDetailActionType.SetActiveModal:
      return { ...state, activeModal: action.payload }
    case ProductVariantDetailActionType.UpdateProductDetail:
      return {
        ...state,
        productDetails: {
          ...state.productDetails,
          [action.payload.field]: action.payload.value,
        },
      }
    default:
      return state
  }
}

const ProductVariantDetail = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => {},
})

export const useProductVariantDetail = () => useContext(ProductVariantDetail)

interface ProductDetailProviderProps {
  children: ReactNode
  productDetails?: Partial<Product>
  mode: 'edit' | 'add'
}

export const ProductVariantDetailProvider: React.FC<
  ProductDetailProviderProps
> = ({ children, productDetails, mode = 'add' }) => {
  let defaultState = initialState

  if (productDetails) {
    defaultState = {
      ...initialState,
      productDetails: {
        ...initialState.productDetails,
        ...productDetails,
      },
    }
  }

  if (mode === 'edit') {
    defaultState = {
      ...defaultState,
      mode: 'edit',
    }
  }

  const [state, dispatch] = useReducer(reducer, defaultState)

  return (
    <ProductVariantDetail.Provider value={{ state, dispatch }}>
      {children}
    </ProductVariantDetail.Provider>
  )
}
