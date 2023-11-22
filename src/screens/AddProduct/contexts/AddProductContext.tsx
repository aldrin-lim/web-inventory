// AddProductContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from 'types/product.types'

export enum AddProductModal {
  None = '',
  Detail = 'detail',
  Description = 'description',
}

export enum AddProductActionType {
  SetActiveModal = 'SET_ACTIVE_MODAL',
  UpdateProductDetail = 'UPDATE_PRODUCT_DETAIL',
}

interface State {
  activeModal: AddProductModal
  productDetails: Product
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
}

type Action =
  | { type: AddProductActionType.SetActiveModal; payload: AddProductModal }
  | {
      type: AddProductActionType.UpdateProductDetail
      payload: { field: keyof Product; value: unknown }
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
    default:
      return state
  }
}

const AddProductContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => {},
})

export const useAddProductContext = () => useContext(AddProductContext)

interface AddProductContextProviderProps {
  children: ReactNode
  productDetails?: Partial<Product>
}

export const AddProductContextProvider: React.FC<
  AddProductContextProviderProps
> = ({ children, productDetails }) => {
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

  console.log('defaultState', defaultState)

  const [state, dispatch] = useReducer(reducer, defaultState)

  return (
    <AddProductContext.Provider value={{ state, dispatch }}>
      {children}
    </AddProductContext.Provider>
  )
}
