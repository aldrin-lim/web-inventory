// ProductDetail.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product, ProductVariantAttribute } from 'types/product.types'
import { generateProductVariants } from 'util/products'

export enum AddProductModal {
  None = '',
  Detail = 'detail',
  Description = 'description',
  Variants = 'variants',
}

export enum AddProductActionType {
  SetActiveModal = 'SET_ACTIVE_MODAL',
  UpdateProductDetail = 'UPDATE_PRODUCT_DETAIL',
  AddVariantAttribute = 'ADD_VARIANT_ATTRIBUTE',
  RemoveVariantAttribute = 'REMOVE_VARIANT_ATTRIBUTE',
}

interface State {
  activeModal: AddProductModal
  productDetails: Product
  mode: 'add' | 'edit'
  variantAttributes: Array<ProductVariantAttribute>
}

const initialState: State = {
  activeModal: AddProductModal.None,
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
  },
  mode: 'add',
  variantAttributes: [],
}

type Action =
  | { type: AddProductActionType.SetActiveModal; payload: AddProductModal }
  | {
      type: AddProductActionType.UpdateProductDetail
      payload: { field: keyof Product; value: unknown }
    }
  | {
      type: AddProductActionType.AddVariantAttribute
      payload: ProductVariantAttribute
    }
  | {
      type: AddProductActionType.RemoveVariantAttribute
      payload: number // index of the variant attribute to remove
    }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case AddProductActionType.SetActiveModal:
      return { ...state, activeModal: action.payload }
    case AddProductActionType.UpdateProductDetail:
      return {
        ...state,
        productDetails: {
          ...state.productDetails,
          [action.payload.field]: action.payload.value,
        },
      }
    case AddProductActionType.AddVariantAttribute: {
      const updatedVariantAttributes = [
        ...state.variantAttributes,
        action.payload,
      ]
      return {
        ...state,
        variantAttributes: updatedVariantAttributes,
        productDetails: generateProductVariants(
          updatedVariantAttributes,
          state.productDetails,
        ),
      }
    }
    case AddProductActionType.RemoveVariantAttribute: {
      const updatedVariantAttributes = state.variantAttributes.filter(
        (_, index) => index !== action.payload,
      )
      return {
        ...state,
        variantAttributes: updatedVariantAttributes,
        productDetails: generateProductVariants(
          updatedVariantAttributes,
          state.productDetails,
        ),
      }
    }
    default:
      return state
  }
}

const ProductDetail = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => {},
})

export const useProductDetail = () => useContext(ProductDetail)

interface ProductDetailProviderProps {
  children: ReactNode
  productDetails?: Partial<Product>
  mode: 'edit' | 'add'
}

export const ProductDetailProvider: React.FC<ProductDetailProviderProps> = ({
  children,
  productDetails,
  mode = 'add',
}) => {
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
    <ProductDetail.Provider value={{ state, dispatch }}>
      {children}
    </ProductDetail.Provider>
  )
}
