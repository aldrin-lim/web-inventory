import { PlusIcon } from '@heroicons/react/24/solid'
import { CreateRecipeRequestSchema } from 'api/recipe/createRecipe'
import { Field, FieldProps, Formik, FormikErrors } from 'formik'
import ProductImages from 'screens/Product/ProductDetail/components/ProductImages'
import {
  RecipeDetailActionType,
  RecipeDetailActiveScreen,
  useRecipeDetail,
} from 'screens/Product/contexts/RecipeDetailContext'
import { Material, Recipe } from 'types/recipe.types'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import RecipeMaterialCard from './components/RecipeMaterialCard'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { AppPath } from 'routes/AppRoutes.types'
import { useNavigate } from 'react-router-dom'
import PrimaryAction from 'screens/Product/ProductDetail/components/ProductDetailPrimaryAction'
import useCreateRecipe from 'hooks/useCreateRecipe'

type RecipeDetailsFormProps = {
  onSubmit: () => void
  initialValue: Recipe
}

const RecipeDetailsForm = (props: RecipeDetailsFormProps) => {
  const { dispatch } = useRecipeDetail()
  const navigate = useNavigate()

  const { isCreating, createRecipe } = useCreateRecipe()

  const isMutating = isCreating

  const showProductSelection = () => {
    dispatch({
      type: RecipeDetailActionType.UpdateActiveScreen,
      payload: {
        screen: RecipeDetailActiveScreen.ProductSelection,
      },
    })
  }

  return (
    <Formik
      initialValues={props.initialValue}
      onSubmit={async (values) => {
        await createRecipe(values)
      }}
      enableReinitialize
      validationSchema={toFormikValidationSchema(CreateRecipeRequestSchema)}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ values, submitForm, errors, setFieldValue }) => {
        return (
          <>
            <Toolbar
              items={[
                <ToolbarButton
                  key={1}
                  label="Cancel"
                  onClick={() => navigate(AppPath.RecipeOverview)}
                />,
                <ToolbarTitle key={2} title="Add Recipe" />,
                <PrimaryAction
                  mode={'add'}
                  key="primaryAction"
                  isLoading={isMutating}
                  onClone={() => {}}
                  onCreate={submitForm}
                  onDelete={() => {}}
                  onSave={submitForm}
                />,
              ]}
            />
            <Field name="images">
              {({ field }: FieldProps) => (
                <ProductImages
                  images={field.value}
                  onImagesChange={(images) => {
                    setFieldValue('images', images)
                  }}
                />
              )}
            </Field>

            <Field name="name">
              {({ field, meta }: FieldProps) => (
                <div className="form-control w-full ">
                  <input
                    {...field}
                    type="text"
                    placeholder="Recipe Name"
                    className="input input-bordered w-full"
                  />
                  <p className="form-control-error">{meta.error}&nbsp;</p>
                </div>
              )}
            </Field>

            <div className="flex w-full flex-row justify-between">
              <p>Cost</p>

              <p>
                <strong>₱ {values.cost.toFixed(2)}</strong>
              </p>
            </div>
            <div className="SCROLLABLE flex h-fit w-full flex-grow overflow-hidden">
              <div className="flex h-full w-full flex-col gap-4">
                <div>
                  <div className="flex flex-row justify-between">
                    <h1>Materials</h1>
                    {values.materials.length > 0 && (
                      <button
                        className="btn btn-ghost btn-sm text-blue-400"
                        onClick={showProductSelection}
                      >
                        <PlusIcon className="w-5 " />
                        Add
                      </button>
                    )}
                  </div>
                  <p className="form-control-error">
                    {typeof errors.materials === 'string' && errors.materials}
                    &nbsp;
                  </p>
                </div>
                <div className="flex h-full flex-grow ">
                  <div>
                    {values.materials.length === 0 && (
                      <button
                        className="btn btn-square  mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300 "
                        onClick={showProductSelection}
                      >
                        <PlusIcon className="w-8 text-success" />
                      </button>
                    )}
                    <div className="container-card flex flex-row flex-wrap justify-center gap-4">
                      {values.materials.length > 0 &&
                        values.materials.map((material, index) => {
                          let error = undefined
                          if (
                            errors.materials &&
                            typeof errors.materials !== 'string' &&
                            Array.isArray(errors.materials)
                          ) {
                            error = errors.materials[index]
                          }

                          return (
                            <RecipeMaterialCard
                              error={error as FormikErrors<Material>}
                              material={material}
                              key={material.product.id}
                            />
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }}
    </Formik>
  )
}

export default RecipeDetailsForm
