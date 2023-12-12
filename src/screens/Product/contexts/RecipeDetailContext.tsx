import { ReactNode, createContext, useReducer } from 'react'
import { Product } from 'types/product.types'
import { Material, Recipe } from 'types/recipe.types'

export enum RecipeDetailActiveScreen {
  None = '',
  ProductSelection = 'productSelection',
}
interface State {
  recipeDetails: Recipe
  activeScreen: RecipeDetailActiveScreen
}

const initialState: State = {
  recipeDetails: {
    id: '',
    name: '',
    cost: 0,
    unit: 'pieces',
    description: '',
    images: [],
    materials: [],
  },
  activeScreen: RecipeDetailActiveScreen.None,
}

export enum RecipeDetailActionType {
  UpdateActiveScreen = 'UPDATE_ACTIVE_SCREEN',
  AddMaterial = 'ADD_MATERIAL',
  RemoveMaterial = 'REMOVE_MATERIAL',
  UpdateMaterial = 'UPDATE_MATERIAL',
  UpdateRecipeDetail = 'UPDATE_RECIPE',
}

type Action =
  | {
      type: RecipeDetailActionType.UpdateActiveScreen
      payload: {
        screen: RecipeDetailActiveScreen
      }
    }
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
    case RecipeDetailActionType.UpdateActiveScreen:
      return {
        ...state,
        activeScreen: action.payload.screen,
      }
    case RecipeDetailActionType.UpdateRecipeDetail:
      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          [action.payload.field]: action.payload.value,
        },
      }
    case RecipeDetailActionType.AddMaterial: {
      const updatedMaterials = [
        ...state.recipeDetails.materials,
        action.payload,
      ]
      const cost = updatedMaterials.reduce(
        (prev, curr) => prev + curr.product.cost * curr.quantity,
        0,
      )

      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          cost,
          materials: updatedMaterials,
        },
      }
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
      const cost = state.recipeDetails.materials.reduce(
        (prev, curr) => prev + curr.product.cost * curr.quantity,
        0,
      )
      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          cost,
          materials: updatedMaterials,
        },
      }
    }

    case RecipeDetailActionType.RemoveMaterial: {
      const updatedMaterials = state.recipeDetails.materials.filter(
        (material) => material.product.id !== action.payload.productId,
      )
      const cost = updatedMaterials.reduce(
        (prev, curr) => prev + curr.product.cost * curr.quantity,
        0,
      )
      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          cost,
          materials: updatedMaterials,
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
