import { ReactNode, createContext, useContext, useReducer } from 'react'
import { Material, MaterialSchema, Recipe } from 'types/recipe.types'
import calculateMaterialCost from 'util/recipe/calculateMaterialCost'
import calculateMaxRecipeQuantity from 'util/recipe/calculateMaxRecipeQuantity'
import { z } from 'zod'

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
    measurement: 'pieces',
    description: '',
    images: [],
    materials: [],
    quantity: 0,
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

const AddMaterialPayloadSchema = MaterialSchema.pick({
  cost: true,
  measurement: true,
  product: true,
  quantity: true,
})

type AddMaterialPayload = z.infer<typeof AddMaterialPayloadSchema>

type Action =
  | {
      type: RecipeDetailActionType.UpdateActiveScreen
      payload: {
        screen: RecipeDetailActiveScreen
      }
    }
  | {
      type: RecipeDetailActionType.AddMaterial
      payload: AddMaterialPayload
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
      const newMaterial = {
        ...action.payload,
        cost: calculateMaterialCost(
          action.payload.quantity,
          action.payload.measurement,
          action.payload.product.cost,
          action.payload.product.measurement,
        ),
      }

      const updatedMaterials = [...state.recipeDetails.materials, newMaterial]

      // Recalculate the total cost of the recipe
      const totalCost = updatedMaterials.reduce(
        (prev, curr) => prev + curr.cost,
        0,
      )

      // Calculate the maximum recipe quantity
      const maxQuantity = calculateMaxRecipeQuantity(updatedMaterials)

      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          cost: totalCost,
          materials: updatedMaterials,
          quantity: maxQuantity,
        },
      }
    }
    case RecipeDetailActionType.UpdateMaterial: {
      const updatedMaterials = state.recipeDetails.materials.map((material) => {
        if (material.product.id === action.payload.productId) {
          const updatedMaterial = {
            ...material,
            [action.payload.field]: action.payload.value,
          }

          // Recalculate cost for the updated material
          updatedMaterial.cost = calculateMaterialCost(
            updatedMaterial.quantity,
            updatedMaterial.measurement,
            updatedMaterial.product.cost,
            updatedMaterial.product.measurement,
          )

          return updatedMaterial
        }
        return material
      })

      // Recalculate the total cost of the recipe
      const totalCost = updatedMaterials.reduce(
        (prev, curr) => prev + curr.cost,
        0,
      )

      // Calculate the maximum recipe quantity
      const maxQuantity = calculateMaxRecipeQuantity(updatedMaterials)

      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          cost: totalCost,
          materials: updatedMaterials,
          quantity: maxQuantity,
        },
      }
    }

    case RecipeDetailActionType.RemoveMaterial: {
      const updatedMaterials = state.recipeDetails.materials.filter(
        (material) => material.product.id !== action.payload.productId,
      )

      // Recalculate cost for each remaining material
      updatedMaterials.forEach((material) => {
        material.cost = calculateMaterialCost(
          material.quantity,
          material.measurement,
          material.product.cost,
          material.product.measurement,
        )
      })

      // Recalculate the total cost of the recipe
      const totalCost = updatedMaterials.reduce(
        (prev, curr) => prev + curr.cost,
        0,
      )

      // Calculate the maximum recipe quantity
      const maxQuantity = calculateMaxRecipeQuantity(updatedMaterials)

      return {
        ...state,
        recipeDetails: {
          ...state.recipeDetails,
          cost: totalCost,
          materials: updatedMaterials,
          quantity: maxQuantity,
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

export const useRecipeDetail = () => useContext(RecipeDetailContext)

type RecipeDetailContextProviderProps = {
  recipeDetails?: Recipe
  children: ReactNode
}

export const RecipeDetailContextProvider: React.FC<
  RecipeDetailContextProviderProps
> = ({ children, recipeDetails }) => {
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
