import { PIECES } from 'constants copy/measurement'
import { MaterialSchema, ProductSoldBy } from 'types/product.types'
import { padWithZeros } from 'util/number'
import { v4 } from 'uuid'
import { z } from 'zod'
import { create } from 'zustand'
import { produce } from 'immer'

type State = {
  initialValue: ProductFormValues
  setInitialValue: (value: ProductFormValues) => void

  formValue: ProductFormValues
  setFormValue: (value: ProductFormValues) => void

  setFormFieldValue: (field: string, value: unknown) => void
  reset: () => void
}

const useProductFormValue = create<State>((set) => ({
  initialValue: {
    id: v4(),
    name: '',
    mode: 'add',
    description: '',
    currentCost: '',
    overAllMeasurement: PIECES,
    price: '',
    profitAmount: '',
    profitPercentage: '',
    images: [],
    category: '',
    isBulkCost: false,
    soldBy: ProductSoldBy.Pieces,
    isIngredient: false,
    allowBackOrder: false,
    applyTax: false,
    stockWarning: '',
    batches: [
      {
        id: v4(),
        name: `Batch #${padWithZeros(1)}`,
        cost: '',
        costPerUnit: 0,
        quantity: '',
        unitOfMeasurement: '',
        isDeducted: false,
        expirationDate: null,
      },
    ],
    recipe: undefined,
  },
  formValue: {
    id: v4(),
    name: '',
    mode: 'add',
    description: '',
    currentCost: '',
    overAllMeasurement: PIECES,
    price: '',
    profitAmount: '',
    profitPercentage: '',
    images: [],
    category: '',
    isBulkCost: false,
    soldBy: ProductSoldBy.Pieces,
    isIngredient: false,
    allowBackOrder: false,
    applyTax: false,
    stockWarning: '',
    batches: [
      {
        id: v4(),
        name: `Batch #${padWithZeros(1)}`,
        cost: '',
        costPerUnit: 0,
        quantity: '',
        unitOfMeasurement: '',
        isDeducted: false,
        expirationDate: null,
      },
    ],
    recipe: undefined,
  },
  setFormValue: (value) =>
    set(
      produce((state) => {
        state.formValue = value
      }),
    ),
  setFormFieldValue: (field: string, value: unknown) =>
    set(
      produce((state) => {
        state.formValue[field] = value
      }),
    ),
  setInitialValue: (value) =>
    set(
      produce((state) => {
        state.initialValue = value
      }),
    ),
  reset: () =>
    set(
      produce((state) => {
        const initialValue = {
          id: v4(),
          name: '',
          mode: 'add',
          description: '',
          currentCost: '',
          overAllMeasurement: PIECES,
          price: '',
          profitAmount: '',
          profitPercentage: '',
          images: [],
          category: '',
          isBulkCost: false,
          soldBy: ProductSoldBy.Pieces,
          isIngredient: false,
          allowBackOrder: false,
          applyTax: false,
          stockWarning: '',
          batches: [
            {
              id: v4(),
              name: `Batch #${padWithZeros(1)}`,
              cost: '',
              costPerUnit: 0,
              quantity: '',
              unitOfMeasurement: '',
              isDeducted: false,
              expirationDate: null,
            },
          ],
          recipe: undefined,
        }
        state.formValue = initialValue
        state.initialValue = initialValue
      }),
    ),
}))

export default useProductFormValue

export type ProductFormValues = z.infer<typeof UISchema>

const UISchema = z.object({
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
