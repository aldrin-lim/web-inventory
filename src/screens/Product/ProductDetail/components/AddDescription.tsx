import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useEffect, useState } from 'react'
import {
  ProductDetailActionType,
  ProductDetailActionModal,
  useProductDetail,
} from '../../contexts/ProductDetailContext'

const AddDescription: React.FC = () => {
  const {
    dispatch,
    state: { productDetails },
  } = useProductDetail()

  const [description, setDescription] = useState('')

  useEffect(() => {
    scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const onSave = () => {
    dispatch({
      type: ProductDetailActionType.UpdateProductDetail,
      payload: {
        field: 'description',
        value: description,
      },
    })
    goBack()
  }

  const goBack = () => {
    dispatch({
      type: ProductDetailActionType.SetActiveModal,
      payload: ProductDetailActionModal.None,
    })
  }

  return (
    <div className="h-[90vh]">
      <Toolbar
        items={[
          <ToolbarButton key={1} label="Cancel" onClick={goBack} />,
          <ToolbarTitle key={2} title="Description" />,
          <ToolbarButton key={3} label="Done" onClick={onSave} />,
        ]}
      />
      <textarea
        onChange={(e) => setDescription(e.target.value)}
        value={description || productDetails.description}
        className="textarea textarea-bordered h-auto w-full text-base"
        placeholder="Add description"
        autoFocus
        rows={5}
      />
    </div>
  )
}

export default AddDescription
