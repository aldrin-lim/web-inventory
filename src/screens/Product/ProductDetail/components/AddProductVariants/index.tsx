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
  const {
    dispatch,
    state: { productDetails },
  } = useProductDetail()

  const goBack = () => {
    dispatch({
      type: AddProductActionType.SetActiveModal,
      payload: AddProductModal.None,
    })
  }

  console.log(generateProductVariants(variantsOptionsInput, productDetails))

  const handleVariantAttributeManagerChange = (
    variantAttribute: Array<ProductVariantAttribute>,
  ) => {
    console.log(JSON.stringify(variantAttribute, null, 2))
  }

  return (
    <div className="flex h-[90vh] flex-col gap-4">
      <Toolbar
        items={[
          <ToolbarButton key={1} label="Cancel" onClick={goBack} />,
          <ToolbarTitle key={2} title="Variants" />,
          <ToolbarButton key={3} label="Done" />,
        ]}
      />
      <h1 className="font-bold">Options</h1>
      <VariantAttributeManager onChange={handleVariantAttributeManagerChange} />
    </div>
  )
}

export default AddProductVariant
