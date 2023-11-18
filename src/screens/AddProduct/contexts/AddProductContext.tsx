// AddProductContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export enum AddProductModal {
  None = '',
  Detail = 'detail',
  Description = 'description',
}

export enum AddProductActionType {
  SetActiveModal = 'SET_ACTIVE_MODAL',
  UpdateProductDetail = 'UPDATE_PRODUCT_DETAIL',
}

export interface ProductDetails {
  name: string
  price?: number
  cost?: number
  profit?: number
  images: string[]
  description: string
  quantity: number
  allowBackOrder: boolean
  measurement: string
  category?: string
  expiryDate?: Date
}

interface State {
  activeModal: AddProductModal
  productDetails: ProductDetails
}

const initialState: State = {
  activeModal: AddProductModal.None,
  productDetails: {
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
      payload: { field: keyof ProductDetails; value: unknown }
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
}

export const AddProductContextProvider: React.FC<
  AddProductContextProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AddProductContext.Provider value={{ state, dispatch }}>
      {children}
    </AddProductContext.Provider>
  )
}
