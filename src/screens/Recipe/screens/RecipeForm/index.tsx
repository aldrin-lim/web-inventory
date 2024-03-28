/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { z } from 'zod'
import {
  Field,
  FieldProps,
  useFormik,
  FormikProvider,
  FormikErrors,
} from 'formik'
import { useNavigate } from 'react-router-dom'
import { Ref, forwardRef, useEffect, useImperativeHandle } from 'react'

import { toast } from 'react-toastify'
import useRecipeFormValue, { RecipeFormValues } from './hooks/useRecipeForm'
import { PlusIcon } from '@heroicons/react/24/outline'
import useBoundStore from 'stores/useBoundStore'
import { s } from 'vitest/dist/reporters-5f784f42.js'

export enum ScreenPath {
  SelectProduct = 'select-product',
}

export type RecipeFormRef = {
  submit: () => void
}

type RecipeFormProps = {
  onSubmit?: (values: RecipeFormValues) => void
}

const RecipeForm = (props: RecipeFormProps, ref: Ref<RecipeFormRef>) => {
  const navigate = useNavigate()
  const setRecipeFormValue = useBoundStore((state) => state.setRecipeFormValue)
  const initialValues = useBoundStore((state) => state.recipeFormInitialValue)

  const formValues = useBoundStore((state) => state.recipeFormValue)

  const formik = useFormik<RecipeFormValues>({
    initialValues: formValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      props.onSubmit?.(values)
    },
  })

  const {
    values,
    errors,
    touched,
    setFieldValue,
    submitForm,
    validateForm,
    setFieldError,
  } = formik

  useEffect(() => {
    setRecipeFormValue(values)
  }, [setRecipeFormValue, values])

  useImperativeHandle(
    ref,
    () => ({
      submit: async () => {
        const updatedErrors = await validateForm()
        if (updatedErrors && Object.keys(updatedErrors).length > 0) {
          const errorKey = Object.keys(updatedErrors)[0] as keyof NonNullable<
            FormikErrors<RecipeFormValues>
          >
          const errorMessage = updatedErrors[errorKey] as string
          toast.error(errorMessage, {
            autoClose: 500,
          })
        }
        submitForm()
      },
    }),
    [submitForm, validateForm],
  )

  return (
    <>
      {/* <div className=" w-full bg-black/20"></div> */}
      <FormikProvider value={formik}>
        <div className="flex flex-col gap-2">
          {/* Name */}
          <Field
            name="name"
            validate={(value: string) => {
              const validation = z
                .string({
                  required_error: 'Name is required',
                })
                .min(1, 'Name is required')
                .safeParse(value)
              if (validation.success === false) {
                return validation.error.issues[0].message
              }

              return null
            }}
          >
            {({
              field, // { name, value, onChange, onBlur }
              meta,
            }: FieldProps) => (
              <label className="form-control w-full ">
                <div className="">
                  <span className="label-text-alt text-gray-400">
                    Product Name
                  </span>
                </div>
                <input
                  {...field}
                  autoComplete="off"
                  type="text"
                  placeholder="(e.g., Milk Tea, Coffee, etc.)"
                  className="input input-bordered w-full"
                  tabIndex={1}
                />

                {meta.touched && meta.error && (
                  <div className="form-field-error label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {meta.error}
                    </span>
                  </div>
                )}
              </label>
            )}
          </Field>

          {/* Ingredients */}
          <div className="flex flex-row justify-between">
            <h1>Ingredients/Materials</h1>
            {values.ingredients.length > 0 && (
              <button
                onClick={() => navigate(ScreenPath.SelectProduct)}
                className="btn btn-ghost btn-sm text-blue-400"
              >
                <PlusIcon className="w-5 " />
                Add
              </button>
            )}
          </div>

          {values.ingredients.length === 0 && (
            <button
              onClick={() => navigate(ScreenPath.SelectProduct)}
              className="btn btn-square  mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300 "
            >
              <PlusIcon className="w-8 text-success" />
            </button>
          )}

          {/* End of Produt Form */}
        </div>

        <pre className="text-[10px]">{JSON.stringify(values, null, 2)}</pre>
      </FormikProvider>
    </>
  )
}

export default forwardRef(RecipeForm)
