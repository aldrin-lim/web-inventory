import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  ProductDetailActionType,
  ProductDetailActionModal,
  useProductDetail,
} from 'screens/Product/contexts/ProductDetailContext'
import VariantAttributeManager from './components/VariantAttributeManager'
import { ProductVariantAttribute } from 'types/product.types'
import { useEffect, useState } from 'react'

const AddProductVariant = () => {
  const { dispatch, state } = useProductDetail()

  const goBack = () => {
    dispatch({
      type: ProductDetailActionType.SetActiveModal,
      payload: ProductDetailActionModal.None,
    })
  }

  const [variantAttributes, setVariantAttributes] = useState<
    Array<ProductVariantAttribute>
  >([])

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
      type: ProductDetailActionType.UpdateVariantAttribute,
      payload: sanitizedVariantAttributes,
    })
    dispatch({
      type: ProductDetailActionType.SetActiveModal,
      payload: ProductDetailActionModal.VariantsInfo,
    })
  }

  useEffect(() => {
    setVariantAttributes(state.variantAttributes)
  }, [state.variantAttributes])

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Toolbar
        items={[
          <ToolbarButton key={1} label="Cancel" onClick={goBack} />,
          <ToolbarTitle key={2} title="Variants" />,
          <ToolbarButton key={3} label="Next" onClick={onDone} />,
        ]}
      />
      <VariantAttributeManager
        values={variantAttributes}
        onChange={handleVariantAttributeManagerChange}
      />
    </div>
  )
}

export default AddProductVariant
