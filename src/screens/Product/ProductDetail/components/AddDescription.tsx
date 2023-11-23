import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useEffect, useState } from 'react'
import {
  AddProductActionType,
  AddProductModal,
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
      type: AddProductActionType.UpdateProductDetail,
      payload: {
        field: 'description',
        value: description,
      },
    })
    goBack()
  }

  const goBack = () => {
    dispatch({
      type: AddProductActionType.SetActiveModal,
      payload: AddProductModal.None,
    })
  }

  return (
    <div className="">
      <Toolbar
        items={[
          <ToolbarButton key="cancel" label="Cancel" onClick={goBack} />,
          <ToolbarTitle key="title" title="Description" />,
          <ToolbarButton key="save" label="Save" onClick={onSave} />,
        ]}
      />
      <textarea
        onChange={(e) => setDescription(e.target.value)}
        value={description || productDetails.description}
        className="textarea textarea-bordered w-full text-base"
        placeholder="Add description"
        autoFocus
      />
    </div>
  )
}

export default AddDescription