import { ReactNode, createContext, useReducer } from 'react'
import { Product } from 'types/product.types'
import { Material, Recipe } from 'types/recipe.types'

interface State {
  recipeDetails: Recipe
}

const initialState: State = {
  recipeDetails: {
    id: '',
    name: '',
    units: 'pieces',
    description: '',
    images: [],
    materials: [],
  },
}

export enum RecipeDetailActionType {
  AddMaterial = 'ADD_MATERIAL',
  RemoveMaterial = 'REMOVE_MATERIAL',
  UpdateMaterial = 'UPDATE_MATERIAL',
  UpdateRecipeDetail = 'UPDATE_RECIPE',
}

type Action =
  | {
      type: RecipeDetailActionType.AddMaterial
      payload: {
        quantity: number
        product: Product
      }
    }
  | {
      type: RecipeDetailActionType.RemoveMaterial
      payload: {
        productId: string
      }
    }
  | {
      type: RecipeDetailActionType.UpdateMaterial
      payload: {
        productId: string
        field: keyof Material
        value: unknown
      }
    }
  | {
      type: RecipeDetailActionType.UpdateRecipeDetail
      payload: { field: keyof Recipe; value: unknown }
    }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case RecipeDetailActionType.UpdateRecipeDetail:
      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          [action.payload.field]: action.payload.value,
        },
      }
    case RecipeDetailActionType.AddMaterial:
      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          materials: [...state.recipeDetails.materials, action.payload],
        },
      }
    case RecipeDetailActionType.UpdateMaterial: {
      const updatedMaterials = state.recipeDetails.materials.map((material) => {
        if (material.product.id === action.payload.productId) {
          return {
            ...material,
            [action.payload.field]: action.payload.value,
          }
        }
        return material
      })
      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          materials: updatedMaterials,
        },
      }
    }

    case RecipeDetailActionType.RemoveMaterial: {
      const updateMaterials = state.recipeDetails.materials.filter(
        (material) => material.product.id !== action.payload.productId,
      )
      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          materials: updateMaterials,
        },
      }
    }
    default:
      return state
  }
}

const RecipeDetailContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => {},
})

type RecipeDetailProviderProps = State & {
  children: ReactNode
}

export const ProductDetailProvider: React.FC<RecipeDetailProviderProps> = ({
  children,
  recipeDetails,
}) => {
  let defaultState = initialState

  if (recipeDetails) {
    defaultState = {
      ...initialState,
      recipeDetails,
    }
  }

  const [state, dispatch] = useReducer(reducer, defaultState)

  return (
    <RecipeDetailContext.Provider value={{ state, dispatch }}>
      {children}
    </RecipeDetailContext.Provider>
  )
}
