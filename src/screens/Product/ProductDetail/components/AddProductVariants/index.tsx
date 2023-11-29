import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  AddProductActionType,
  AddProductModal,
  useProductDetail,
} from 'screens/Product/contexts/ProductDetailContext'
import { generateProductVariants } from 'util/products'

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

  return (
    <div className="h-[90vh]">
      <Toolbar
        items={[
          <ToolbarButton key={1} label="Cancel" onClick={goBack} />,
          <ToolbarTitle key={2} title="Variants" />,
          <ToolbarButton key={3} label="Done" />,
        ]}
      />
      <pre>{JSON.stringify(productDetails, null, 2)}</pre>
    </div>
  )
}

export default AddProductVariant
