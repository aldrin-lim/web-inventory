// ProductDetail.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import {
  Product,
  ProductVariant,
  ProductVariantAttribute,
} from 'types/product.types'
import {
  generateProductVariants,
  getVariantOptionsFromProduct,
} from 'util/products'

export enum ProductDetailActionModal {
  None = '',
  Detail = 'detail',
  Description = 'description',
  Variants = 'variants',
  VariantsInfo = 'variantsInfo',
}

export enum ProductDetailActionType {
  SetActiveModal = 'SET_ACTIVE_MODAL',
  UpdateProductDetail = 'UPDATE_PRODUCT_DETAIL',
  UpdateVariantAttribute = 'UPDATE_VARIANT_ATTRIBUTE',
  AddVariantAttribute = 'ADD_VARIANT_ATTRIBUTE',
  RemoveVariantAttribute = 'REMOVE_VARIANT_ATTRIBUTE',
  UpdateProductVariant = 'UPDATE_PRODUCT_VARIANT',
}

interface State {
  activeModal: ProductDetailActionModal
  productDetails: Product
  mode: 'add' | 'edit'
  variantAttributes: Array<ProductVariantAttribute>
}

const initialState: State = {
  activeModal: ProductDetailActionModal.None,
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
    variants: [],
  },
  mode: 'add',
  variantAttributes: [],
}

type Action =
  | {
      type: ProductDetailActionType.SetActiveModal
      payload: ProductDetailActionModal
    }
  | {
      type: ProductDetailActionType.UpdateProductDetail
      payload: { field: keyof Product; value: unknown }
    }
  | {
      type: ProductDetailActionType.UpdateVariantAttribute
      payload: Array<ProductVariantAttribute> // index of the variant attribute to remove
    }
  | {
      type: ProductDetailActionType.AddVariantAttribute
      payload: ProductVariantAttribute
    }
  | {
      type: ProductDetailActionType.RemoveVariantAttribute
      payload: number // index of the variant attribute to remove
    }
  | {
      type: ProductDetailActionType.UpdateProductVariant
      payload: { variantIndex: number; updatedVariant: ProductVariant }
    }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ProductDetailActionType.SetActiveModal:
      return { ...state, activeModal: action.payload }
    case ProductDetailActionType.UpdateProductDetail:
      return {
        ...state,
        productDetails: {
          ...state.productDetails,
          [action.payload.field]: action.payload.value,
        },
      }
    case ProductDetailActionType.UpdateVariantAttribute: {
      if (action.payload.length === 0) {
        return {
          ...state,
          variantAttributes: [],
          productDetails: {
            ...state.productDetails,
            variants: undefined,
          },
        }
      }

      return {
        ...state,
        variantAttributes: action.payload,
        productDetails: generateProductVariants(
          action.payload,
          state.productDetails,
        ),
      }
    }
    case ProductDetailActionType.AddVariantAttribute: {
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
    case ProductDetailActionType.RemoveVariantAttribute: {
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
    case ProductDetailActionType.UpdateProductVariant: {
      const updatedVariants = [
        ...(state.productDetails.variants as ProductVariant[]),
      ]
      updatedVariants[action.payload.variantIndex] =
        action.payload.updatedVariant

      return {
        ...state,
        productDetails: {
          ...state.productDetails,
          variants: updatedVariants,
        },
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
      variantAttributes:
        productDetails.variants && Array.isArray(productDetails.variants)
          ? getVariantOptionsFromProduct(productDetails as Product)
          : [],
    }
  }

  if (mode === 'edit') {
    defaultState = {
      ...defaultState,
      mode: 'edit',
    }
  }

  // if (
  //   defaultState.productDetails &&
  //   defaultState.productDetails.variants &&
  //   Array.isArray(defaultState.productDetails.variants) &&
  //   defaultState.productDetails.variants.length > 0
  // ) {
  //   defaultState = {
  //     ...defaultState,
  //     variantAttributes: getVariantOptionsFromProduct(
  //       defaultState.productDetails.variants,
  //     ),
  //   }
  // }

  const [state, dispatch] = useReducer(reducer, defaultState)

  return (
    <ProductDetail.Provider value={{ state, dispatch }}>
      {children}
    </ProductDetail.Provider>
  )
}
