import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  AddProductActionType,
  AddProductModal,
  useProductDetail,
} from 'screens/Product/contexts/ProductDetailContext'
import { generateProductVariants } from 'util/products'
import VariantAttributeManager from './components/VariantAttributeManager'
import { ProductVariantAttribute } from 'types/product.types'
import { useEffect, useState } from 'react'

const variantsOptionsInput = [
  {
    option: 'sizes',
    values: ['small', 'medium'],
  },
  {
    option: 'color',
    values: ['red', 'blue'],
  },
]

const AddProductVariant = () => {
  const { dispatch, state } = useProductDetail()
  const { productDetails } = state

  const goBack = () => {
    dispatch({
      type: AddProductActionType.SetActiveModal,
      payload: AddProductModal.None,
    })
  }

  const [variantAttributes, setVariantAttributes] = useState<
    Array<ProductVariantAttribute>
  >([])

  console.log(generateProductVariants(variantsOptionsInput, productDetails))

  const handleVariantAttributeManagerChange = (
    variantAttribute: Array<ProductVariantAttribute>,
  ) => {
    setVariantAttributes(variantAttribute)
  }

  const onDone = () => {
    const sanitizedVariantAttributes = variantAttributes.filter(
      (variantAttribute) => {
        const hasOption = variantAttribute.option.length > 0
        const hasOptionValues = variantAttribute.values.length > 0
        return hasOption && hasOptionValues
      },
    )
    dispatch({
      type: AddProductActionType.UpdateVariantAttribute,
      payload: sanitizedVariantAttributes,
    })
    goBack()
  }

  useEffect(() => {
    setVariantAttributes(state.variantAttributes)
  }, [state.variantAttributes])

  return (
    <div className="flex h-[90vh] flex-col gap-4">
      <Toolbar
        items={[
          <ToolbarButton key={1} label="Cancel" onClick={goBack} />,
          <ToolbarTitle key={2} title="Variants" />,
          <ToolbarButton key={3} label="Done" onClick={onDone} />,
        ]}
      />
      <h1 className="font-bold">Options</h1>
      <VariantAttributeManager
        values={variantAttributes}
        onChange={handleVariantAttributeManagerChange}
      />
    </div>
  )
}

export default AddProductVariant
