import { Variants, AnimatePresence, motion } from 'framer-motion'
import { ProductDetailActionModal } from 'screens/Product/contexts/ProductDetailContext'
import AddDescription from '../AddDescription'
import AddProductDetail from '../AddProductDetails'
import AddProductVariant from '../AddProductVariants'

const animationVariants: Variants = {
  hidden: {
    x: '100vw', // Start off-screen to the right
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: 'backIn' }, // 200ms linear transition
  },
  exit: {
    x: '100vw',
    opacity: 0,
    transition: { duration: 0.2, ease: 'backIn' }, // 200ms linear transition
  },
}

type ProductDetailModalManagerProps = {
  activeModal: ProductDetailActionModal
}

const ProductDetailModalManager = (props: ProductDetailModalManagerProps) => {
  const { activeModal } = props
  return (
    <AnimatePresence>
      <motion.div
        className={[
          'section absolute left-0 right-0 z-10 h-full bg-base-100 pt-0',
          activeModal === ProductDetailActionModal.None ? 'hidden' : '',
        ].join(' ')}
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key={activeModal}
      >
        {activeModal === ProductDetailActionModal.Description && (
          <AddDescription />
        )}

        {activeModal === ProductDetailActionModal.Detail && (
          <AddProductDetail />
        )}

        {activeModal === ProductDetailActionModal.Variants && (
          <AddProductVariant />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
export default ProductDetailModalManager
