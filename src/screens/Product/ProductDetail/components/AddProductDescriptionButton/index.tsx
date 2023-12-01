import { ChevronRightIcon } from '@heroicons/react/24/solid'
import {
  AddProductActionType,
  ProductDetailActionModal,
  useProductDetail,
} from 'screens/Product/contexts/ProductDetailContext'

const AddProductDescriptionButton = () => {
  const {
    dispatch,
    state: { productDetails },
  } = useProductDetail()
  const { description } = productDetails

  const setActiveModal = (modal: ProductDetailActionModal) => {
    dispatch({
      type: AddProductActionType.SetActiveModal,
      payload: modal,
    })
  }

  return (
    <button
      onClick={() => setActiveModal(ProductDetailActionModal.Description)}
      className="btn btn-ghost btn-primary btn-xs -mt-[10px]  flex w-full flex-row justify-between p-0 normal-case"
    >
      <span className="col-span-11 w-4/5 truncate overflow-ellipsis text-left text-gray-400">
        {description || 'Add Description'}
      </span>
      <ChevronRightIcon className="col-span-1 w-5" />
    </button>
  )
}

export default AddProductDescriptionButton
