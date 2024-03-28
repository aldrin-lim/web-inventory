import { ProductSoldBy, MaterialSchema } from 'types/product.types'
import { z } from 'zod'

export type ProductFormSlice = {
  productFormInitialValue: ProductFormValues
  productFormValue: ProductFormValues

  setProdutctFormInitialValue: (value: ProductFormValues) => void
  setProductFormValue: (value: ProductFormValues) => void
  setProductFormFieldValue: (field: string, value: unknown) => void
  resetProductForm: () => void
}

export type RecipeFormSlice = {
  recipeFormInitialValue: RecipeFormValues
  recipeFormValue: RecipeFormValues

  setRecipeInitialValue: (value: RecipeFormValues) => void
  setRecipeFormValue: (value: RecipeFormValues) => void
  setRecipeFormFieldValue: (field: string, value: unknown) => void
  resetRecipeForm: () => void
}

export type StoreState = ProductFormSlice & RecipeFormSlice

export type ProductFormValues = z.infer<typeof ProductFormUISchema>
export type RecipeFormValues = z.infer<typeof RecipeUISchema>

const ProductFormUISchema = z.object({
  id: z.string(),
  mode: z.enum(['add', 'edit']),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  overAllMeasurement: z.string(),
  currentCost: z.string().optional(),
  price: z.string().optional(),
  profitAmount: z.string(),
  profitPercentage: z.string(),
  images: z.array(z.string()),
  category: z
    .string({
      invalid_type_error: 'Category must be a string',
    })
    .optional(),
  isBulkCost: z
    .boolean({
      required_error: 'Is Bulk Cost is required',
    })
    .default(false),
  soldBy: z.nativeEnum(ProductSoldBy).default(ProductSoldBy.Pieces),
  isIngredient: z
    .boolean({
      required_error: 'Is ingredient is required',
    })
    .default(true),

  allowBackOrder: z
    .boolean({
      invalid_type_error: 'Allow back order must be a boolean',
    })
    .default(false),

  applyTax: z.boolean().default(false),

  stockWarning: z
    .string({
      invalid_type_error: 'Stock warning must be a number',
    })
    .optional(),

  batches: z
    .array(
      z.object({
        id: z.string(),
        name: z.string({
          required_error: 'Name is required',
          invalid_type_error: 'Name must be a string',
        }),
        cost: z.string({
          required_error: 'Cost is required',
        }),
        costPerUnit: z
          .number({
            coerce: true,
            invalid_type_error: 'Cost per Unit must be a number',
          })
          .optional(),
        quantity: z.string({
          required_error: 'Quantity is required',
        }),
        unitOfMeasurement: z.string({
          required_error: 'Measurement is required',
          invalid_type_error: 'Measurement must be a number',
        }),
        isDeducted: z.boolean().default(false),
        expirationDate: z
          .date({
            invalid_type_error: 'Expiration  must be a data',
            coerce: true,
          })
          .nullable(),
      }),
    )
    .min(1, 'Batches must have at least 1 item'),
  recipe: z
    .object({
      id: z.string({
        required_error: 'Recipe is required',
      }),
      cost: z.number({
        coerce: true,
        required_error: 'Recipe Cost is required',
      }),
      images: z.array(z.string()),
      quantity: z.number(),
      name: z.string({
        required_error: 'Recipe Name is required',
      }),
      materials: z.array(MaterialSchema),
    })
    .optional(),
})

const RecipeUISchema = z.object({
  id: z.string({
    required_error: 'Recipe is required',
  }),
  cost: z.number({
    coerce: true,
    required_error: 'Recipe Cost is required',
  }),
  images: z.array(z.string()),
  quantity: z.number(),
  name: z.string({
    required_error: 'Recipe Name is required',
  }),
  materials: z.array(MaterialSchema),
  ingredients: z.array(MaterialSchema),
  others: z.array(MaterialSchema),
})
