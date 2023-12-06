import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  ProductDetailActionType,
  ProductDetailActionModal,
  useProductDetail,
} from 'screens/Product/contexts/ProductDetailContext'
import VariantAttributeManager from './components/VariantAttributeManager'
import { ProductVariant, ProductVariantAttribute } from 'types/product.types'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { subscreenAnimation } from 'constants/animation'
import VariantOptionForm from '../VariantOptionForm'
import { generateProductVariants } from 'util/products'

const AddProductVariant = () => {
  const { dispatch, state } = useProductDetail()
  const { activeModal, productDetails } = state

  const goBack = () => {
    dispatch({
      type: ProductDetailActionType.SetActiveModal,
      payload: ProductDetailActionModal.None,
    })
  }

  const [variantAttributes, setVariantAttributes] = useState<
    Array<ProductVariantAttribute>
  >([])

  const [variants, setVariants] = useState<Array<ProductVariant>>([])

  const handleVariantAttributeManagerChange = (
    variantAttribute: Array<ProductVariantAttribute>,
  ) => {
    setVariantAttributes(variantAttribute)
  }

  const sanitizedVariantAttributes = variantAttributes.filter(
    (variantAttribute) => {
      const hasOption = variantAttribute.option.length > 0
      const hasOptionValues = variantAttribute.values.length > 0
      return hasOption && hasOptionValues
    },
  )

  const onDone = () => {
    setVariantAttributes(sanitizedVariantAttributes)
    const newVariants = generateProductVariants(
      sanitizedVariantAttributes,
      productDetails,
    )
    if (newVariants.variants) {
      setVariants(newVariants.variants)
    }
    dispatch({
      type: ProductDetailActionType.SetActiveModal,
      payload:
        variantAttributes.length > 0
          ? ProductDetailActionModal.VariantsInfo
          : ProductDetailActionModal.None,
    })
  }

  useEffect(() => {
    if (state.variantAttributes.length === 0) {
      setVariantAttributes([
        {
          option: '',
          values: [],
        },
      ])
    } else {
      setVariantAttributes(state.variantAttributes)
    }
  }, [state.variantAttributes])

  const closeSubscreens = () =>
    dispatch({
      type: ProductDetailActionType.SetActiveModal,
      payload: ProductDetailActionModal.None,
    })

  const onVariantInfoSave = (variants: Array<ProductVariant>) => {
    dispatch({
      type: ProductDetailActionType.UpdateProductDetail,
      payload: {
        field: 'variants',
        value: variants,
      },
    })
    closeSubscreens()
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          className={[
            'section absolute left-0 right-0 z-10 h-full bg-base-100 pt-0',
            activeModal === ProductDetailActionModal.None ? 'hidden' : '',
          ].join(' ')}
          variants={subscreenAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          key={activeModal}
        >
          {activeModal === ProductDetailActionModal.Variants && (
            <div className="flex flex-col gap-4 pb-4">
              <Toolbar
                items={[
                  <ToolbarButton key={1} label="Cancel" onClick={goBack} />,
                  <ToolbarTitle key={2} title="Variants" />,
                  <ToolbarButton
                    key={3}
                    label="Next"
                    disabled={sanitizedVariantAttributes.length === 0}
                    onClick={onDone}
                  />,
                ]}
              />
              <VariantAttributeManager
                values={variantAttributes}
                onChange={handleVariantAttributeManagerChange}
                onEdit={onDone}
              />
            </div>
          )}
          {activeModal === ProductDetailActionModal.VariantsInfo && (
            <VariantOptionForm
              onClose={() =>
                dispatch({
                  type: ProductDetailActionType.SetActiveModal,
                  payload: ProductDetailActionModal.Variants,
                })
              }
              onSave={onVariantInfoSave}
              variants={variants}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default AddProductVariant
